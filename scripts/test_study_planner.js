import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { ChromeCapture } from './capture_cdp.js';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startViteServer(projectRoot, port, vitePkgPath, configFilePath) {
  const viteUrl = pathToFileURL(vitePkgPath).href;
  const { createServer } = await import(viteUrl);

  const server = await createServer({
    root: projectRoot,
    server: { port, host: '127.0.0.1' },
    configFile: configFilePath
  });
  await server.listen();
  return server;
}

async function main() {
  const server = await startViteServer(
    'E:/Github project/AI_Study_Planner/AI_Study_Planner',
    5180,
    'E:/Github project/AI_Study_Planner/AI_Study_Planner/node_modules/vite/dist/node/index.js',
    'E:/Github project/AI_Study_Planner/AI_Study_Planner/vite.config.ts'
  );

  const capturer = new ChromeCapture();
  await capturer.start();

  await capturer.capture('http://127.0.0.1:5180/', 'src/assets/projects/study-planner/test_dash.png', 4000);
  await capturer.capture('http://127.0.0.1:5180/roadmap', 'src/assets/projects/study-planner/test_roadmap.png', 4000);
  await capturer.capture('http://127.0.0.1:5180/landing', 'src/assets/projects/study-planner/test_landing.png', 4000);

  await capturer.close();
  await server.close();
}

main().catch(console.error);
