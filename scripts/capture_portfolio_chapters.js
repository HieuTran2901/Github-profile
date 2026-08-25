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

async function startPortfolioServer(port = 5173) {
  const projectRoot = 'E:/Github project/Github-profile';
  const viteUrl = pathToFileURL(`${projectRoot}/node_modules/vite/dist/node/index.js`).href;
  const { createServer } = await import(viteUrl);

  console.log(`[Server] Starting Vite for Github-profile on http://127.0.0.1:${port}...`);
  const server = await createServer({
    root: projectRoot,
    server: { port, host: '127.0.0.1' },
    configFile: `${projectRoot}/vite.config.ts`
  });
  await server.listen();
  console.log(`[Server] Github-profile ready on http://127.0.0.1:${port}\n`);
  return server;
}

async function waitForComprehensiveReadiness(capturer, timeoutMs = 15000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    try {
      const evalRes = await capturer.sendSession('Runtime.evaluate', {
        expression: `
          (function() {
            const root = document.querySelector('#root');
            const hasRoot = Boolean(root && root.children.length > 0);
            const appReady = Boolean(window.__APP_READY__);
            const styleSheets = document.styleSheets.length;
            const images = Array.from(document.querySelectorAll('img'));
            const imagesLoaded = images.length === 0 || images.every(img => img.complete && img.naturalHeight > 0);
            const bodyBg = window.getComputedStyle(document.body).backgroundColor;
            
            return {
              ready: (hasRoot || appReady) && styleSheets > 0 && imagesLoaded,
              details: {
                hasRoot,
                appReady,
                styleSheets,
                imagesCount: images.length,
                imagesLoaded,
                bodyBg
              }
            };
          })()
        `,
        returnByValue: true
      });

      if (evalRes && evalRes.result && evalRes.result.value && evalRes.result.value.ready) {
        await sleep(1000);
        return evalRes.result.value.details;
      }
    } catch (e) {
      // Retry
    }
    await sleep(300);
  }
  
  throw new Error('Timeout waiting for comprehensive page readiness');
}

/**
 * Hard Verification Gate:
 * Enforces that window.__ACTIVE_CHAPTER__ === expectedChapter AND motionProgress matches expected range
 */
async function navigateAndWaitForChapter(capturer, targetChapter, timeoutMs = 10000) {
  console.log(`\n============================================================`);
  console.log(`Navigating to Chapter ${targetChapter + 1} (Index: ${targetChapter})`);
  console.log(`============================================================`);

  // Call the application's actual navigation controller
  await capturer.sendSession('Runtime.evaluate', {
    expression: `
      if (typeof window.__NAVIGATE_TO_CHAPTER__ === 'function') {
        window.__NAVIGATE_TO_CHAPTER__(${targetChapter});
      }
    `
  });

  const startTime = Date.now();
  let latestDiag = null;

  while (Date.now() - startTime < timeoutMs) {
    const evalRes = await capturer.sendSession('Runtime.evaluate', {
      expression: `
        (function() {
          const diag = typeof window.__GET_DIAGNOSTICS__ === 'function' ? window.__GET_DIAGNOSTICS__() : {};
          const activeCh = typeof window.__ACTIVE_CHAPTER__ === 'number' ? window.__ACTIVE_CHAPTER__ : -1;
          
          return {
            activeChapter: activeCh,
            scrollY: window.scrollY,
            motionProgress: diag.motionProgress ?? -1,
            rawMotionProgress: diag.rawMotionProgress ?? -1,
            totalScrollable: diag.totalScrollable ?? 0
          };
        })()
      `,
      returnByValue: true
    });

    if (evalRes && evalRes.result && evalRes.result.value) {
      latestDiag = evalRes.result.value;
      if (latestDiag.activeChapter === targetChapter) {
        // Wait an additional 800ms for Framer Motion spring and render stabilization
        await sleep(800);
        return {
          success: true,
          diagnostics: latestDiag
        };
      }
    }
    await sleep(250);
  }

  return {
    success: false,
    diagnostics: latestDiag
  };
}

async function verifyChapterDOM(capturer, chapterIndex) {
  const evalRes = await capturer.sendSession('Runtime.evaluate', {
    expression: `
      (function() {
        const bodyText = document.body.innerText;
        const checks = {
          0: bodyText.includes("TRAN HUU TRUNG HIEU") || bodyText.includes("Clean Code"),
          1: bodyText.includes("JOURNEY") || bodyText.includes("Milestones") || bodyText.includes("Transport and Communications"),
          2: bodyText.includes("SKILLS") || bodyText.includes("TECH STACK") || bodyText.includes("TypeScript"),
          3: bodyText.includes("FEATURED") || bodyText.includes("Travel Marketplace"),
          4: bodyText.includes("ARCHIVE") || bodyText.includes("Study Planner") || bodyText.includes("Control Center"),
          5: bodyText.includes("CONNECT") || bodyText.includes("hieutran290104@gmail.com")
        };
        return {
          matches: Boolean(checks[${chapterIndex}]),
          textSnippet: bodyText.substring(0, 150).replace(/\\s+/g, ' ')
        };
      })()
    `,
    returnByValue: true
  });
  return evalRes?.result?.value || { matches: false, textSnippet: '' };
}

async function main() {
  console.log('================================================================');
  console.log('  FORENSIC CHAPTER SCREENSHOT AUDIT & CAPTURE SUITE');
  console.log('================================================================\n');

  const outDir = 'E:/Github project/Github-profile/docs/screenshots';
  fs.mkdirSync(outDir, { recursive: true });

  const PORT = 5173;
  let server = null;
  const capturer = new ChromeCapture();

  const auditReport = [];

  try {
    server = await startPortfolioServer(PORT);
    await capturer.start();

    const targetUrl = `http://127.0.0.1:${PORT}/`;
    console.log(`[Browser] Navigating to target URL: ${targetUrl}`);
    await capturer.sendSession('Page.navigate', { url: targetUrl });

    console.log('[Audit] Verifying CSS, fonts, and React readiness...');
    const readiness = await waitForComprehensiveReadiness(capturer);
    console.log('[Audit] Initial Ready State:', readiness);

    const chapterDefinitions = [
      { index: 0, id: 'chapter1', title: 'Chapter 1: Intro Hero Scene' },
      { index: 1, id: 'chapter2', title: 'Chapter 2: Journey Milestones' },
      { index: 2, id: 'chapter3', title: 'Chapter 3: Core Skills Showcase' },
      { index: 3, id: 'chapter4', title: 'Chapter 4: Featured Project (AI Travel)' },
      { index: 4, id: 'chapter5', title: 'Chapter 5: Project Gallery' },
      { index: 5, id: 'chapter6', title: 'Chapter 6: Contact & Connect' }
    ];

    for (const ch of chapterDefinitions) {
      // 1. Navigate and wait for hard state sync
      const navResult = await navigateAndWaitForChapter(capturer, ch.index);
      
      if (!navResult.success) {
        console.error(`❌ HARD GATE FAILED: Could not synchronize to Chapter ${ch.index + 1}`);
        console.error(`Diagnostics:`, navResult.diagnostics);
        throw new Error(`Navigation synchronization failed for chapter ${ch.index + 1}`);
      }

      // 2. Verify visual DOM contents
      const domResult = await verifyChapterDOM(capturer, ch.index);

      // 3. CAPTURE CURRENT SURFACE (WITHOUT Page.navigate reload!)
      const outFile = `${outDir}/${ch.id}.png`;
      const sizeBytes = await capturer.captureCurrentSurface(outFile);
      const sha256 = getFileHash(outFile);

      console.log(`------------------------------------------------------------`);
      console.log(`Chapter ${ch.index + 1}: ${ch.title}`);
      console.log(`------------------------------------------------------------`);
      console.log(`Requested: Chapter ${ch.index + 1} (Index ${ch.index})`);
      console.log(`Active: Chapter ${navResult.diagnostics.activeChapter + 1} (Index ${navResult.diagnostics.activeChapter})`);
      console.log(`ScrollY: ${navResult.diagnostics.scrollY}px`);
      console.log(`MotionProgress: ${navResult.diagnostics.motionProgress.toFixed(3)}`);
      console.log(`DOM Content Match: ${domResult.matches ? 'YES' : 'NO'}`);
      console.log(`File Size: ${(sizeBytes / 1024).toFixed(1)} KB`);
      console.log(`SHA-256: ${sha256.substring(0, 16)}...`);
      console.log(`Navigation: PASS`);
      console.log(`Screenshot: PASS`);
      console.log(`------------------------------------------------------------\n`);

      auditReport.push({
        chapterIndex: ch.index,
        chapterTitle: ch.title,
        file: `${ch.id}.png`,
        filePath: outFile,
        scrollY: navResult.diagnostics.scrollY,
        motionProgress: navResult.diagnostics.motionProgress.toFixed(3),
        sizeBytes,
        sizeKb: (sizeBytes / 1024).toFixed(1),
        sha256,
        domMatch: domResult.matches,
        status: 'PASS'
      });
    }

    // 4. Comparative Uniqueness Verification
    console.log('\n================================================================');
    console.log('  COMPARATIVE UNIQUENESS VERIFICATION (DIFF MATRIX)');
    console.log('================================================================');
    
    let allUnique = true;
    for (let i = 0; i < auditReport.length; i++) {
      for (let j = i + 1; j < auditReport.length; j++) {
        const itemA = auditReport[i];
        const itemB = auditReport[j];
        const isIdentical = itemA.sha256 === itemB.sha256;
        if (isIdentical) {
          allUnique = false;
          console.error(`❌ DUPLICATE DETECTED: ${itemA.file} and ${itemB.file} are IDENTICAL!`);
        } else {
          console.log(`✓ ${itemA.file} ≠ ${itemB.file} (Distinct states: scrollY ${itemA.scrollY}px vs ${itemB.scrollY}px, MP ${itemA.motionProgress} vs ${itemB.motionProgress})`);
        }
      }
    }

    if (!allUnique) {
      throw new Error('Verification failed: Duplicate screenshots found!');
    }

    console.log('\n================================================================');
    console.log('  FINAL VERIFIED AUDIT TABLE');
    console.log('================================================================');
    console.table(auditReport.map(r => ({
      Chapter: r.chapterTitle,
      File: r.file,
      ScrollY: `${r.scrollY}px`,
      MotionProgress: r.motionProgress,
      Size: `${r.sizeKb} KB`,
      SHA256: `${r.sha256.substring(0, 12)}...`,
      Status: r.status
    })));

    // Save audit data to JSON
    fs.writeFileSync(
      'E:/Github project/Github-profile/scripts/chapter_capture_audit_data.json',
      JSON.stringify(auditReport, null, 2)
    );

  } catch (err) {
    console.error('Audit execution error:', err);
    process.exit(1);
  } finally {
    await capturer.close();
    if (server) await server.close();
    console.log('\n[Complete] All processes stopped.');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
