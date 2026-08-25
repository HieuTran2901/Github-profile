import { pathToFileURL } from 'node:url';

async function test() {
  console.log('Importing Vite...');
  const viteUrl = pathToFileURL('E:/Github project/AI_Study_Planner/AI_Study_Planner/node_modules/vite/dist/node/index.js').href;
  const { createServer } = await import(viteUrl);

  console.log('Starting Vite server for AI Study Planner...');
  const server = await createServer({
    root: 'E:/Github project/AI_Study_Planner/AI_Study_Planner',
    server: { port: 5180, host: '127.0.0.1' },
    configFile: 'E:/Github project/AI_Study_Planner/AI_Study_Planner/vite.config.ts'
  });
  await server.listen();
  console.log('AI Study Planner Vite server listening at http://127.0.0.1:5180');

  const res = await fetch('http://127.0.0.1:5180');
  console.log('Fetch status:', res.status);
  
  await server.close();
  console.log('Server closed successfully.');
}

test().catch(err => {
  console.error('Error in test:', err);
  process.exit(1);
});
