import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getWebSocketDebuggerUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${PORT}/json/version`, (r) => {
          let data = '';
          r.on('data', (chunk) => data += chunk);
          r.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
      });
      if (res && res.webSocketDebuggerUrl) {
        return res.webSocketDebuggerUrl;
      }
    } catch (e) {
      await sleep(300);
    }
  }
  throw new Error('Could not connect to Chrome debugging port');
}

export class ChromeCapture {
  constructor() {
    this.chromeProc = null;
    this.ws = null;
    this.messageId = 1;
    this.pending = new Map();
  }

  async start() {
    this.chromeProc = spawn(CHROME_PATH, [
      '--headless=new',
      '--disable-gpu',
      '--remote-debugging-port=' + PORT,
      '--window-size=1920,1080',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--hide-scrollbars',
      'about:blank'
    ], { stdio: 'ignore' });

    const wsUrl = await getWebSocketDebuggerUrl();
    this.ws = new WebSocket(wsUrl);

    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
        if (msg.params.type === 'error') console.log(`  [Browser Console Error]`, text);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log(`  [Browser Uncaught Exception]`, msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description || '');
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    // Get existing main target or create one if none exists
    const targetsRes = await this.send('Target.getTargets');
    const mainTarget = targetsRes.targetInfos?.find(t => t.type === 'page') || targetsRes.targetInfos?.[0];
    let targetId = mainTarget?.targetId;
    if (!targetId) {
      const res = await this.send('Target.createTarget', { url: 'about:blank', width: 1920, height: 1080 });
      targetId = res.targetId;
    }
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    this.sessionId = sessionId;

    await this.sendSession('Page.enable');
    await this.sendSession('Runtime.enable');
    await this.sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      mobile: false,
      screenWidth: 1920,
      screenHeight: 1080
    });

    // Inject mock for desktop / Tauri environment so browser renders Tauri apps seamlessly
    await this.sendSession('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.__TAURI_INTERNALS__ = {
          transformCallback: () => () => {},
          unregisterListener: () => {},
          invoke: async (cmd, args) => {
            console.log('[Tauri Mock invoke]', cmd, args);
            return {};
          },
          metadata: { currentWindow: { label: 'main' } }
        };
        window.__TAURI__ = {
          core: { invoke: async () => ({}) },
          event: { listen: async () => () => {}, emit: async () => {} }
        };
      `
    });
  }

  send(method, params = {}) {
    const id = this.messageId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  sendSession(method, params = {}) {
    const id = this.messageId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, sessionId: this.sessionId, method, params }));
    });
  }

  async capture(url, outputPath, waitMs = 3000, preEval = null) {
    console.log(`[Capture] Navigating to: ${url}`);
    await this.sendSession('Page.navigate', { url });
    await sleep(waitMs);

    if (preEval) {
      await this.sendSession('Runtime.evaluate', { expression: preEval });
      await sleep(500);
    }

    return this.captureCurrentSurface(outputPath);
  }

  async captureCurrentSurface(outputPath) {
    // Hide native scrollbar visually without restricting overflow/scrolling
    await this.sendSession('Runtime.evaluate', {
      expression: `
        if (!document.getElementById('__hide_scrollbars_style__')) {
          const style = document.createElement('style');
          style.id = '__hide_scrollbars_style__';
          style.innerHTML = '::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; }';
          document.head.appendChild(style);
        }
      `
    });

    const result = await this.sendSession('Page.captureScreenshot', {
      format: 'png',
      quality: 100,
      fromSurface: true,
      captureBeyondViewport: false
    });

    const buffer = Buffer.from(result.data, 'base64');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, buffer);
    console.log(`[Capture] Saved screenshot (${buffer.length} bytes) -> ${outputPath}`);
    return buffer.length;
  }

  async close() {
    if (this.ws) this.ws.close();
    if (this.chromeProc) this.chromeProc.kill();
  }
}
