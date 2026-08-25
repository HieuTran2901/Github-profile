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

  console.log(`[Server] Starting Vite for ${path.basename(projectRoot)} on port ${port}...`);
  const server = await createServer({
    root: projectRoot,
    server: { port, host: '127.0.0.1' },
    configFile: configFilePath
  });
  await server.listen();
  console.log(`[Server] ${path.basename(projectRoot)} ready at http://127.0.0.1:${port}`);
  return server;
}

async function main() {
  console.log('=== STARTING PROJECT EVIDENCE SCREENSHOT AUTOMATION ===\n');

  // 1. Ensure asset directories exist
  const baseOutDir = 'E:/Github project/Github-profile/src/assets/projects';
  fs.mkdirSync(`${baseOutDir}/study-planner`, { recursive: true });
  fs.mkdirSync(`${baseOutDir}/travel`, { recursive: true });
  fs.mkdirSync(`${baseOutDir}/dcc`, { recursive: true });

  // 2. Start Chrome Headless
  const capturer = new ChromeCapture();
  await capturer.start();
  console.log('[Browser] Chrome Headless started with CDP.');

  const results = [];

  // =========================================================================
  // PROJECT 1: AI STUDY PLANNER
  // =========================================================================
  console.log('\n--- CAPTURING AI STUDY PLANNER ---');
  let studyPlannerServer = null;
  try {
    studyPlannerServer = await startViteServer(
      'E:/Github project/AI_Study_Planner/AI_Study_Planner',
      5180,
      'E:/Github project/AI_Study_Planner/AI_Study_Planner/node_modules/vite/dist/node/index.js',
      'E:/Github project/AI_Study_Planner/AI_Study_Planner/vite.config.ts'
    );

    // Capture Hero (Dashboard)
    await capturer.capture(
      'http://127.0.0.1:5180/',
      `${baseOutDir}/study-planner/hero.png`,
      3500
    );
    results.push({
      project: 'AI Study Planner',
      type: 'hero',
      file: 'src/assets/projects/study-planner/hero.png',
      route: '/',
      desc: 'AI Study Dashboard with progress analytics, active courses, and personalized AI schedules'
    });

    // Capture Detail 1 (AI Roadmap)
    await capturer.capture(
      'http://127.0.0.1:5180/roadmap',
      `${baseOutDir}/study-planner/detail1.png`,
      3500
    );
    results.push({
      project: 'AI Study Planner',
      type: 'detail1',
      file: 'src/assets/projects/study-planner/detail1.png',
      route: '/roadmap',
      desc: 'Interactive AI-generated Learning Roadmap and Milestone Breakdown'
    });

    // Capture Detail 2 (Progress & Analytics)
    await capturer.capture(
      'http://127.0.0.1:5180/progress',
      `${baseOutDir}/study-planner/detail2.png`,
      3500
    );
    results.push({
      project: 'AI Study Planner',
      type: 'detail2',
      file: 'src/assets/projects/study-planner/detail2.png',
      route: '/progress',
      desc: 'Study Statistics, Completion Trends, and Performance Metrics'
    });

  } catch (err) {
    console.error('Error capturing AI Study Planner:', err);
  } finally {
    if (studyPlannerServer) await studyPlannerServer.close();
  }

  // =========================================================================
  // PROJECT 2: AI TRAVEL MARKETPLACE
  // =========================================================================
  console.log('\n--- CAPTURING AI TRAVEL MARKETPLACE ---');
  let travelServer = null;
  try {
    travelServer = await startViteServer(
      'E:/Github project/ai-travel-marketplace/frontend',
      5181,
      'E:/Github project/ai-travel-marketplace/frontend/node_modules/vite/dist/node/index.js',
      'E:/Github project/ai-travel-marketplace/frontend/vite.config.ts'
    );

    // Capture Hero (Marketplace Home)
    await capturer.capture(
      'http://127.0.0.1:5181/',
      `${baseOutDir}/travel/hero.png`,
      3500
    );
    results.push({
      project: 'AI Travel Marketplace',
      type: 'hero',
      file: 'src/assets/projects/travel/hero.png',
      route: '/',
      desc: 'AI Travel Marketplace Home with smart search, curated packages, and live travel experiences'
    });

    // Capture Detail 1 (AI Trip Planner)
    await capturer.capture(
      'http://127.0.0.1:5181/ai/planner',
      `${baseOutDir}/travel/detail1.png`,
      3500
    );
    results.push({
      project: 'AI Travel Marketplace',
      type: 'detail1',
      file: 'src/assets/projects/travel/detail1.png',
      route: '/ai/planner',
      desc: 'Intelligent AI Trip Planner with customized day-by-day itinerary generation'
    });

    // Capture Detail 2 (AI Search & Recommendations)
    await capturer.capture(
      'http://127.0.0.1:5181/search',
      `${baseOutDir}/travel/detail2.png`,
      3500
    );
    results.push({
      project: 'AI Travel Marketplace',
      type: 'detail2',
      file: 'src/assets/projects/travel/detail2.png',
      route: '/search',
      desc: 'Real-time Travel Search, Smart Filters, and Instant Booking Inventory'
    });

  } catch (err) {
    console.error('Error capturing AI Travel Marketplace:', err);
  } finally {
    if (travelServer) await travelServer.close();
  }

  // =========================================================================
  // PROJECT 3: DEVELOPER CONTROL CENTER (DCC)
  // =========================================================================
  console.log('\n--- CAPTURING DEVELOPER CONTROL CENTER ---');
  let dccServer = null;
  try {
    dccServer = await startViteServer(
      'E:/Github project/Developer-Control-Center',
      5182,
      'E:/Github project/Developer-Control-Center/node_modules/vite/dist/node/index.js',
      'E:/Github project/Developer-Control-Center/vite.config.ts'
    );

    // Capture Hero (Dashboard)
    await capturer.capture(
      'http://127.0.0.1:5182/',
      `${baseOutDir}/dcc/hero.png`,
      3500
    );
    results.push({
      project: 'Developer Control Center',
      type: 'hero',
      file: 'src/assets/projects/dcc/hero.png',
      route: '/',
      desc: 'Desktop System Dashboard with real-time CPU/RAM telemetry, active projects, and workspace controls'
    });

    // Capture Detail 1 (Security Overview)
    await capturer.capture(
      'http://127.0.0.1:5182/security',
      `${baseOutDir}/dcc/detail1.png`,
      3500
    );
    results.push({
      project: 'Developer Control Center',
      type: 'detail1',
      file: 'src/assets/projects/dcc/detail1.png',
      route: '/security',
      desc: 'Security Health & OSV Vulnerability Scanner analyzing project dependencies'
    });

    // Capture Detail 2 (CI/CD Pipeline Overview)
    await capturer.capture(
      'http://127.0.0.1:5182/cicd',
      `${baseOutDir}/dcc/detail2.png`,
      3500
    );
    results.push({
      project: 'Developer Control Center',
      type: 'detail2',
      file: 'src/assets/projects/dcc/detail2.png',
      route: '/cicd',
      desc: 'CI/CD Pipeline Automation, Workflow Stages, and Build Execution Status'
    });

  } catch (err) {
    console.error('Error capturing Developer Control Center:', err);
  } finally {
    if (dccServer) await dccServer.close();
  }

  // Close browser
  await capturer.close();

  console.log('\n=== CAPTURE SUMMARY ===');
  for (const r of results) {
    const stats = fs.statSync(r.file);
    console.log(`✓ [${r.project}] (${r.type}) ${r.file} - ${stats.size} bytes (${(stats.size / 1024).toFixed(1)} KB)`);
  }
}

main().catch(err => {
  console.error('Fatal error in capture script:', err);
  process.exit(1);
});
