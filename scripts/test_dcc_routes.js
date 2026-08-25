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
    'E:/Github project/Developer-Control-Center',
    5182,
    'E:/Github project/Developer-Control-Center/node_modules/vite/dist/node/index.js',
    'E:/Github project/Developer-Control-Center/vite.config.ts'
  );

  const capturer = new ChromeCapture();
  await capturer.start();

  const routes = [
    { path: '/', name: 'dashboard' },
    { path: '/workspace', name: 'workspace' },
    { path: '/security', name: 'security' },
    { path: '/cicd', name: 'cicd' },
    { path: '/ai-quota', name: 'ai_quota' }
  ];

  for (const r of routes) {
    await capturer.capture(
      `http://127.0.0.1:5182${r.path}`,
      `src/assets/projects/dcc/test_${r.name}.png`,
      3500
    );
  }

  await capturer.close();
  await server.close();
}

main().catch(console.error);
