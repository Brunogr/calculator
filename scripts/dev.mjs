#!/usr/bin/env node
/**
 * Run backend (air) and frontend (Vite) in one terminal with prefixed logs.
 * Cross-platform: Windows, macOS, Linux.
 */
import { execSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backendTmp = path.join(root, 'backend', 'tmp');

function writeDev(message) {
  process.stderr.write(`[dev] ${message}\n`);
}

/** Best-effort: free the API port if a previous debug session left it bound. */
function stopStaleBackendOnPort(port) {
  try {
    if (process.platform === 'win32') {
      const out = execSync(`netstat -ano -p tcp | findstr :${port}`, {
        encoding: 'utf8',
        windowsHide: true,
      });
      const pids = new Set();
      for (const line of out.split(/\r?\n/)) {
        if (!/LISTENING/i.test(line)) continue;
        const pid = line.trim().split(/\s+/).at(-1);
        if (pid && /^\d+$/.test(pid) && pid !== '0') pids.add(pid);
      }
      for (const pid of pids) {
        execSync(`taskkill /PID ${pid} /T /F`, {
          stdio: 'ignore',
          windowsHide: true,
        });
      }
      return;
    }
    const pids = execSync(`lsof -ti tcp:${port}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    if (!pids) return;
    for (const pid of pids.split(/\s+/)) {
      if (/^\d+$/.test(pid)) {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      }
    }
  } catch {
    // Port already free or tooling unavailable.
  }
}

function removePath(target) {
  try {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
    return true;
  } catch {
    return false;
  }
}

function cleanBackendTmp() {
  if (!fs.existsSync(backendTmp)) return;

  if (removePath(backendTmp)) return;

  const staleNames = ['main.exe', 'main', 'build-errors.log'];
  for (const name of staleNames) {
    removePath(path.join(backendTmp, name));
  }

  if (removePath(backendTmp)) return;

  writeDev(
    `Could not remove ${path.relative(root, backendTmp)} (files may be in use). ` +
      'Stop any running backend, then run just debug again. Continuing anyway…',
  );
}

const backendPort = process.env.BACKEND_PORT ?? '3000';
const frontendPort = process.env.FRONTEND_PORT ?? '5173';
const apiBaseUrl =
  process.env.VITE_API_BASE_URL ?? `http://localhost:${backendPort}`;

const env = {
  ...process.env,
  VITE_API_BASE_URL: apiBaseUrl,
  BACKEND_PORT: backendPort,
  FRONTEND_PORT: frontendPort,
};

/** @type {{ name: string; child: import('node:child_process').ChildProcess }[]} */
const children = [];
let shuttingDown = false;

function writePrefixed(name, text, isErr) {
  const target = isErr ? process.stderr : process.stdout;
  for (const line of text.split(/\r?\n/)) {
    if (line.length === 0) continue;
    target.write(`[${name}] ${line}\n`);
  }
}

function pipeOutput(name, stream, isErr) {
  let buffer = '';
  stream.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (line.length > 0) writePrefixed(name, line, isErr);
    }
  });
  stream.on('end', () => {
    if (buffer.length > 0) writePrefixed(name, buffer, isErr);
  });
}

function run(name, cwd, command, args) {
  const child = spawn(command, args, {
    cwd: path.join(root, cwd),
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    shell: process.platform === 'win32',
  });
  pipeOutput(name, child.stdout, false);
  pipeOutput(name, child.stderr, true);
  children.push({ name, child });
  return child;
}

function killChild({ child }) {
  if (child.killed || child.exitCode !== null) return;
  if (process.platform === 'win32' && child.pid) {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true,
      shell: true,
    });
  } else {
    child.kill('SIGTERM');
  }
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const entry of children) killChild(entry);
  setTimeout(() => process.exit(exitCode), 300).unref();
}

stopStaleBackendOnPort(backendPort);
cleanBackendTmp();

run('backend', 'backend', 'go', ['run', 'github.com/air-verse/air@latest']);
run('frontend', 'frontend', 'npm', [
  'run',
  'dev',
  '--',
  '--host',
  '0.0.0.0',
  '--port',
  frontendPort,
]);

for (const { name, child } of children) {
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    const failed = code !== 0 && code !== null;
    if (failed || signal) {
      process.stderr.write(
        `[dev] ${name} stopped${signal ? ` (${signal})` : ` (exit ${code})`}\n`,
      );
      shutdown(failed ? (code ?? 1) : 0);
    }
  });
}

process.on('SIGINT', () => {
  process.stdout.write('\n[dev] shutting down...\n');
  shutdown(0);
});
process.on('SIGTERM', () => shutdown(0));
