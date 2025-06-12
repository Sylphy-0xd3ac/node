import assert from 'node:assert/strict';
import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { tmpdir } from '../common/tmpdir.js';

if (process.platform === 'win32') process.exit(0);

test('glob internal readdir never returns null', async () => {
  tmpdir.refresh();
  
  const restrictedDir = path.join(tmpdir.path, 'restricted');
  fs.mkdirSync(restrictedDir);
  fs.chmodSync(restrictedDir, 0o000);
  
  try {
    const results = [];
    
    for await (const match of fs.glob('*', { cwd: restrictedDir })) {
      results.push(match);
    }
    
    assert.ok(true, 'glob completed without TypeError about null.length');
    
  } finally {
    try {
      fs.chmodSync(restrictedDir, 0o755);
    } catch {}
  }
});
