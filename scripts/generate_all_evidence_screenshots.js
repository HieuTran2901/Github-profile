import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { ChromeCapture } from './capture_cdp.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startViteServer(projectRoot, port, vitePkgPath, configFilePath) {
  const viteUrl = pathToFileURL(vitePkgPath).href;
  const { createServer } = await import(viteUrl);

  console.log(`[Server] Booting Vite for ${path.basename(projectRoot)} on http://127.0.0.1:${port}...`);
  const server = await createServer({
    root: projectRoot,
    server: { port, host: '127.0.0.1' },
    configFile: configFilePath
  });
  await server.listen();
  console.log(`[Server] ${path.basename(projectRoot)} ready.`);
  return server;
}

async function waitForPageReady(capturer, timeoutMs = 10000) {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutMs) {
    try {
      const evalRes = await capturer.sendSession('Runtime.evaluate', {
        expression: 'Boolean(document.querySelector("#root") && document.querySelector("#root").innerText.trim().length > 10)'
      });
      if (evalRes && evalRes.result && evalRes.result.value === true) {
        await sleep(1000); // Allow animations & layout to settle
        return true;
      }
    } catch (e) {
      // ignore
    }
    await sleep(300);
  }
  return false;
}

async function main() {
  console.log('====================================================');
  console.log('  PROJECT EVIDENCE SCREENSHOT AUTOMATION SUITE');
  console.log('====================================================\n');

  const baseOutDir = 'E:/Github project/Github-profile/src/assets/projects';
  fs.mkdirSync(`${baseOutDir}/study-planner`, { recursive: true });
  fs.mkdirSync(`${baseOutDir}/travel`, { recursive: true });
  fs.mkdirSync(`${baseOutDir}/dcc`, { recursive: true });

  const capturer = new ChromeCapture();
  await capturer.start();
  console.log('[Browser] Chrome Headless started via CDP.\n');

  const captureCatalog = [
    // --- 1. AI STUDY PLANNER ---
    {
      project: 'AI Study Planner',
      root: 'E:/Github project/AI_Study_Planner/AI_Study_Planner',
      port: 5180,
      vitePkg: 'E:/Github project/AI_Study_Planner/AI_Study_Planner/node_modules/vite/dist/node/index.js',
      config: 'E:/Github project/AI_Study_Planner/AI_Study_Planner/vite.config.ts',
      shots: [
        {
          type: 'hero',
          route: '/timer',
          file: `${baseOutDir}/study-planner/hero.png`,
          purpose: 'AI Study Timer, Focus Hub & Subject Sessions'
        },
        {
          type: 'detail1',
          route: '/roadmap',
          file: `${baseOutDir}/study-planner/detail1.png`,
          purpose: 'Interactive AI Learning Roadmap & Milestones'
        },
        {
          type: 'detail2',
          route: '/progress',
          file: `${baseOutDir}/study-planner/detail2.png`,
          purpose: 'Study Progress Analytics & Completion Trends'
        }
      ]
    },
    // --- 2. AI TRAVEL MARKETPLACE ---
    {
      project: 'AI Travel Marketplace',
      root: 'E:/Github project/ai-travel-marketplace/frontend',
      port: 5181,
      vitePkg: 'E:/Github project/ai-travel-marketplace/frontend/node_modules/vite/dist/node/index.js',
      config: 'E:/Github project/ai-travel-marketplace/frontend/vite.config.ts',
      shots: [
        {
          type: 'hero',
          route: '/ai/assistant',
          file: `${baseOutDir}/travel/hero.png`,
          purpose: 'AI Travel Concierge & Intelligent Assistant'
        },
        {
          type: 'detail1',
          route: '/ai/recommendations',
          file: `${baseOutDir}/travel/detail1.png`,
          purpose: 'Curated AI Travel Packages & Real-Time Recommendations'
        },
        {
          type: 'detail2',
          route: '/challenges/lucky-wheel',
          file: `${baseOutDir}/travel/detail2.png`,
          purpose: 'Gamified Travel Rewards & Lucky Wheel Experience'
        }
      ]
    },
    // --- 3. DEVELOPER CONTROL CENTER ---
    {
      project: 'Developer Control Center',
      root: 'E:/Github project/Developer-Control-Center',
      port: 5182,
      vitePkg: 'E:/Github project/Developer-Control-Center/node_modules/vite/dist/node/index.js',
      config: 'E:/Github project/Developer-Control-Center/vite.config.ts',
      shots: [
        {
          type: 'hero',
          route: '/',
          file: `${baseOutDir}/dcc/hero.png`,
          purpose: 'Desktop System Telemetry Dashboard (CPU/RAM/Network)'
        },
        {
          type: 'detail1',
          route: '/security',
          file: `${baseOutDir}/dcc/detail1.png`,
          purpose: 'Security Health & OSV Vulnerability Scanner'
        },
        {
          type: 'detail2',
          route: '/cicd',
          file: `${baseOutDir}/dcc/detail2.png`,
          purpose: 'CI/CD Pipeline Automation & Workflow Execution'
        }
      ]
    }
  ];

  const auditReport = [];

  for (const group of captureCatalog) {
    console.log(`\n>>> Processing [${group.project}] on port ${group.port}...`);
    let server = null;
    try {
      server = await startViteServer(group.root, group.port, group.vitePkg, group.config);
      
      // Warm-up Vite dependency bundling
      console.log(`[Warm-up] Initializing Vite bundle on http://127.0.0.1:${group.port}${group.shots[0].route}...`);
      await capturer.sendSession('Page.navigate', { url: `http://127.0.0.1:${group.port}${group.shots[0].route}` });
      await waitForPageReady(capturer, 8000);

      for (const shot of group.shots) {
        const fullUrl = `http://127.0.0.1:${group.port}${shot.route}`;
        await capturer.sendSession('Page.navigate', { url: fullUrl });
        await waitForPageReady(capturer, 6000);
        await capturer.capture(fullUrl, shot.file, 2000);

        const stats = fs.statSync(shot.file);
        auditReport.push({
          project: group.project,
          type: shot.type,
          route: shot.route,
          file: shot.file,
          purpose: shot.purpose,
          sizeBytes: stats.size,
          sizeKb: (stats.size / 1024).toFixed(1),
          dimensions: '1920 × 1080',
          aspectRatio: '16:9',
          format: 'PNG',
          status: stats.size > 20000 ? 'PASS' : 'FAIL'
        });
      }
    } catch (err) {
      console.error(`Error processing ${group.project}:`, err);
    } finally {
      if (server) {
        await server.close();
        console.log(`[Server] ${group.project} stopped.`);
      }
    }
  }

  await capturer.close();
  console.log('\n[Browser] Chrome Headless closed.');

  console.log('\n====================================================');
  console.log('  EVIDENCE VERIFICATION & AUDIT TABLE');
  console.log('====================================================');
  console.table(auditReport.map(r => ({
    Project: r.project,
    Type: r.type,
    Route: r.route,
    File: path.basename(r.file),
    Size: `${r.sizeKb} KB`,
    Resolution: r.dimensions,
    Status: r.status
  })));

  // Write JSON report
  fs.writeFileSync(
    'E:/Github project/Github-profile/scripts/capture_audit_data.json',
    JSON.stringify(auditReport, null, 2)
  );
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
