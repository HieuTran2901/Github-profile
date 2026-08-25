import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { ChromeCapture } from './capture_cdp.js';

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
    'E:/Github project/ai-travel-marketplace/frontend',
    5181,
    'E:/Github project/ai-travel-marketplace/frontend/node_modules/vite/dist/node/index.js',
    'E:/Github project/ai-travel-marketplace/frontend/vite.config.ts'
  );

  const capturer = new ChromeCapture();
  await capturer.start();

  const routes = [
    { path: '/', name: 'home' },
    { path: '/ai/planner', name: 'ai_planner' },
    { path: '/ai/assistant', name: 'ai_assistant' },
    { path: '/ai/recommendations', name: 'ai_recommendations' },
    { path: '/ai-coins', name: 'ai_coins' },
    { path: '/challenges/lucky-wheel', name: 'lucky_wheel' }
  ];

  for (const r of routes) {
    await capturer.capture(
      `http://127.0.0.1:5181${r.path}`,
      `src/assets/projects/travel/test_${r.name}.png`,
      3500
    );
  }

  await capturer.close();
  await server.close();
}

main().catch(console.error);
