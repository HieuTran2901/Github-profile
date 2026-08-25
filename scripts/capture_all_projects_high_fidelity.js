import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ChromeCapture } from './capture_cdp.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

async function startProjectViteServer(projectPath, port) {
  process.chdir(projectPath);
  const viteUrl = pathToFileURL(`${projectPath}/node_modules/vite/dist/node/index.js`).href;
  const { createServer } = await import(viteUrl);

  console.log(`[Server] Starting Vite for ${path.basename(projectPath)} on http://127.0.0.1:${port}...`);
  const server = await createServer({
    root: projectPath,
    server: { port, host: '127.0.0.1' },
    configFile: fs.existsSync(`${projectPath}/vite.config.ts`) ? `${projectPath}/vite.config.ts` : undefined
  });
  await server.listen();
  console.log(`[Server] ${path.basename(projectPath)} ready on http://127.0.0.1:${port}\n`);
  return server;
}

async function waitForComprehensiveReadiness(capturer, timeoutMs = 15000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    const evalRes = await capturer.sendSession('Runtime.evaluate', {
      expression: `
        (function() {
          const root = document.querySelector('#root');
          const hasRootChildren = Boolean(root && root.children.length > 0);
          const hasNav = typeof window.__NAVIGATE_TO_SCREEN__ === 'function' || Boolean(window.__APP_READY__);
          const styleSheets = document.styleSheets.length;
          const images = Array.from(document.querySelectorAll('img'));
          const imagesLoaded = images.length === 0 || images.every(img => img.complete && img.naturalWidth > 0);
          const bodyBg = window.getComputedStyle(document.body).backgroundColor;

          return {
            hasRoot: hasRootChildren,
            hasNav,
            styleSheets,
            imagesCount: images.length,
            imagesLoaded,
            bodyBg,
            ready: hasRootChildren && hasNav && styleSheets >= 1 && imagesLoaded
          };
        })()
      `,
      returnByValue: true
    });

    if (evalRes && evalRes.result && evalRes.result.value && evalRes.result.value.ready) {
      return evalRes.result.value;
    }
    await sleep(250);
  }
  throw new Error('Timeout waiting for page readiness');
}

async function navigateAndWaitForScreen(capturer, targetScreen, expectedPath, expectedKeywords = [], timeoutMs = 15000) {
  console.log(`\n[Navigation] In-app navigating to: ${expectedPath}...`);

  const navEval = await capturer.sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        if (typeof window.__NAVIGATE_TO_SCREEN__ === 'function') {
          window.__NAVIGATE_TO_SCREEN__("${expectedPath}");
          return 'CALLED';
        }
        return 'MISSING';
      })()
    `,
    returnByValue: true
  });
  console.log(`[Navigation Handler Status]: ${navEval?.result?.value}`);

  // Small delay to allow React state transition to start
  await sleep(400);

  const startTime = Date.now();
  let latestDiag = null;

  while (Date.now() - startTime < timeoutMs) {
    const evalRes = await capturer.sendSession('Runtime.evaluate', {
      expression: `
        (function() {
          const diag = typeof window.__GET_DIAGNOSTICS__ === 'function' ? window.__GET_DIAGNOSTICS__() : {};
          const active = window.__ACTIVE_SCREEN__ || window.location.pathname;
          const bodyText = document.body.innerText.toLowerCase();
          const domMatches = ${JSON.stringify(expectedKeywords)}.length === 0 || 
            ${JSON.stringify(expectedKeywords)}.every(k => bodyText.includes(k.toLowerCase()));
          
          return {
            activeScreen: active,
            pathname: window.location.pathname,
            scrollY: window.scrollY,
            styleSheets: document.styleSheets.length,
            imagesCount: document.querySelectorAll('img').length,
            domMatches,
            snippet: bodyText.substring(0, 150).replace(/\\s+/g, ' ')
          };
        })()
      `,
      returnByValue: true
    });

    if (evalRes && evalRes.result && evalRes.result.value) {
      latestDiag = evalRes.result.value;
      if (latestDiag.pathname === expectedPath && latestDiag.activeScreen === expectedPath && latestDiag.domMatches) {
        // Wait 1200ms for animations, image decode and layout stabilization
        await sleep(1200);
        return {
          success: true,
          diagnostics: latestDiag
        };
      }
    }
    await sleep(300);
  }

  return {
    success: false,
    diagnostics: latestDiag
  };
}

async function verifyDOMContent(capturer, expectedTexts) {
  const evalRes = await capturer.sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const bodyText = document.body.innerText.toLowerCase();
        const matches = ${JSON.stringify(expectedTexts)}.every(txt => bodyText.includes(txt.toLowerCase()));
        return {
          matches,
          snippet: document.body.innerText.substring(0, 200).replace(/\\s+/g, ' ')
        };
      })()
    `,
    returnByValue: true
  });
  return evalRes?.result?.value || { matches: false, snippet: '' };
}

async function runProjectAuditAndCapture(config) {
  console.log(`\n================================================================`);
  console.log(`  RUNNING AUDIT & CAPTURE FOR: ${config.name.toUpperCase()}`);
  console.log(`================================================================`);

  fs.mkdirSync(config.outDir, { recursive: true });
  if (config.portfolioSyncDir) {
    fs.mkdirSync(config.portfolioSyncDir, { recursive: true });
  }

  let server = null;
  const capturer = new ChromeCapture();
  const projectReport = [];

  try {
    server = await startProjectViteServer(config.projectRoot, config.port);
    await capturer.start();

    const initialUrl = `http://127.0.0.1:${config.port}/`;
    console.log(`[Browser] Navigating to initial root URL: ${initialUrl}`);
    await capturer.sendSession('Page.navigate', { url: initialUrl });

    const readiness = await waitForComprehensiveReadiness(capturer);
    console.log('[Audit] Readiness Gate Passed:', readiness);

    for (let i = 0; i < config.screens.length; i++) {
      const scr = config.screens[i];
      console.log(`\n--- [Screen ${i + 1}/${config.screens.length}] ${scr.title} (${scr.path}) ---`);

      // 1. In-app navigation with hard state & DOM synchronization
      const navRes = await navigateAndWaitForScreen(capturer, i, scr.path, scr.expectedKeywords);
      if (!navRes.success) {
        console.error(`❌ HARD GATE FAILED for ${config.name} screen ${scr.path}`);
        console.error(`Diagnostics:`, navRes.diagnostics);
        throw new Error(`Failed to synchronize in-app navigation for ${config.name} at ${scr.path}`);
      }

      console.log(`[DOM Assertion] Snippet: "${navRes.diagnostics.snippet.substring(0, 80)}..."`);

      // 2. Current viewport surface capture
      const outFile = path.join(config.outDir, `${scr.id}.png`);
      const sizeBytes = await capturer.captureCurrentSurface(outFile);
      const sha256 = getFileHash(outFile);

      // 4. Also copy to portfolio assets if requested
      if (config.portfolioSyncMap && config.portfolioSyncMap[scr.id]) {
        const syncTarget = path.join(config.portfolioSyncDir, config.portfolioSyncMap[scr.id]);
        fs.copyFileSync(outFile, syncTarget);
        console.log(`[Sync] Copied to portfolio asset: ${syncTarget}`);
      }

      console.log(`[Capture Result] File: ${path.basename(outFile)} | Size: ${(sizeBytes / 1024).toFixed(1)} KB | SHA-256: ${sha256.substring(0, 16)}...`);

      projectReport.push({
        project: config.name,
        screenId: scr.id,
        title: scr.title,
        path: scr.path,
        file: `${scr.id}.png`,
        filePath: outFile,
        scrollY: navRes.diagnostics?.scrollY ?? 0,
        sizeBytes,
        sizeKb: (sizeBytes / 1024).toFixed(1),
        sha256,
        domMatch: navRes.diagnostics?.domMatches ?? true,
        status: 'PASS'
      });
    }

    // 5. Check uniqueness within project
    console.log(`\n[Uniqueness Matrix for ${config.name}]`);
    let unique = true;
    for (let a = 0; a < projectReport.length; a++) {
      for (let b = a + 1; b < projectReport.length; b++) {
        const itemA = projectReport[a];
        const itemB = projectReport[b];
        if (itemA.sha256 === itemB.sha256) {
          unique = false;
          console.error(`❌ DUPLICATE: ${itemA.file} === ${itemB.file}`);
        } else {
          console.log(`✓ ${itemA.file} ≠ ${itemB.file}`);
        }
      }
    }

    if (!unique) {
      throw new Error(`Uniqueness check failed for project ${config.name}`);
    }

    return projectReport;

  } finally {
    await capturer.close();
    if (server) await server.close();
  }
}

async function main() {
  const masterReport = [];

  // 1. AI Study Planner
  const studyPlannerConfig = {
    name: 'AI Study Planner',
    projectRoot: 'E:/Github project/AI_Study_Planner/AI_Study_Planner',
    port: 5174,
    outDir: 'E:/Github project/AI_Study_Planner/AI_Study_Planner/docs/screenshots',
    portfolioSyncDir: 'E:/Github project/Github-profile/src/assets/projects/study_planner',
    portfolioSyncMap: {
      'screen1_dashboard': 'hero.png',
      'screen2_roadmap': 'detail1.png',
      'screen3_timer': 'detail2.png'
    },
    screens: [
      { id: 'screen1_dashboard', title: 'Dashboard Overview', path: '/', expectedKeywords: ['Welcome', 'Study'] },
      { id: 'screen2_roadmap', title: 'Learning Roadmap', path: '/roadmap', expectedKeywords: ['Roadmap'] },
      { id: 'screen3_timer', title: 'Study Focus Timer', path: '/timer', expectedKeywords: ['Timer'] },
      { id: 'screen4_progress', title: 'Analytics & Progress', path: '/progress', expectedKeywords: ['Progress'] }
    ]
  };

  // 2. AI Travel Marketplace
  const travelConfig = {
    name: 'AI Travel Marketplace',
    projectRoot: 'E:/Github project/ai-travel-marketplace/frontend',
    port: 5175,
    outDir: 'E:/Github project/ai-travel-marketplace/frontend/docs/screenshots',
    portfolioSyncDir: 'E:/Github project/Github-profile/src/assets/projects/travel',
    portfolioSyncMap: {
      'screen1_marketplace': 'hero.png',
      'screen2_planner': 'detail1.png',
      'screen3_lucky_wheel': 'detail2.png'
    },
    screens: [
      { id: 'screen1_marketplace', title: 'Marketplace Home', path: '/', expectedKeywords: ['Design the trip', 'Explore Trips'] },
      { id: 'screen2_planner', title: 'AI Trip Planner', path: '/ai/planner', expectedKeywords: ['No itinerary generated yet'] },
      { id: 'screen3_lucky_wheel', title: 'Lucky Wheel Challenge', path: '/challenges/lucky-wheel', expectedKeywords: ['Quay', '20.000'] },
      { id: 'screen4_membership', title: 'AI Coins & Membership', path: '/ai-coins', expectedKeywords: ['AI Coins', 'Special Coins'] }
    ]
  };

  // 3. Developer Control Center
  const controlCenterConfig = {
    name: 'Developer Control Center',
    projectRoot: 'E:/Github project/Developer-Control-Center',
    port: 5176,
    outDir: 'E:/Github project/Developer-Control-Center/docs/screenshots',
    portfolioSyncDir: 'E:/Github project/Github-profile/src/assets/projects/control_center',
    portfolioSyncMap: {
      'screen1_dashboard': 'hero.png',
      'screen2_workspace': 'detail1.png',
      'screen3_security': 'detail2.png'
    },
    screens: [
      { id: 'screen1_dashboard', title: 'Control Dashboard', path: '/', expectedKeywords: ['System', 'Dashboard'] },
      { id: 'screen2_workspace', title: 'Workspace Projects', path: '/workspace', expectedKeywords: ['Workspace'] },
      { id: 'screen3_security', title: 'Security & Audit', path: '/security', expectedKeywords: ['Security'] },
      { id: 'screen4_cicd', title: 'CI/CD Pipelines', path: '/cicd', expectedKeywords: ['Pipeline'] }
    ]
  };

  const results1 = await runProjectAuditAndCapture(studyPlannerConfig);
  masterReport.push(...results1);

  const results2 = await runProjectAuditAndCapture(travelConfig);
  masterReport.push(...results2);

  const results3 = await runProjectAuditAndCapture(controlCenterConfig);
  masterReport.push(...results3);

  console.log('\n================================================================');
  console.log('  ALL PROJECTS HIGH-FIDELITY SCREENSHOT VERIFICATION SUMMARY');
  console.log('================================================================');
  console.table(masterReport.map(r => ({
    Project: r.project,
    Screen: r.title,
    Path: r.path,
    File: r.file,
    Size: `${r.sizeKb} KB`,
    SHA256: `${r.sha256.substring(0, 12)}...`,
    DOM: r.domMatch ? 'PASS' : 'CHECK',
    Status: r.status
  })));

  // Save audit data to JSON
  fs.writeFileSync(
    'E:/Github project/Github-profile/scripts/all_projects_screenshot_audit_data.json',
    JSON.stringify(masterReport, null, 2)
  );

  console.log('\n[SUCCESS] All project screenshots captured, verified unique, and synced.');
}

main().catch(err => {
  console.error('Execution failure:', err);
  process.exit(1);
});
