#!/usr/bin/env node

const { execFileSync } = require('child_process');
const os = require('os');
const path = require('path');
require('dotenv').config();
console.log("Using tunnel URL: ", process.env.TUNNEL_URL);

if (os.type() === 'Linux' || os.type() === 'Darwin') {
  execFileSync('chmod', ['+x', `${path.resolve(__dirname, './utils/setup.sh')}`], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  execFileSync('./utils/setup.sh', {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true,
  });
} else if (os.type() === 'Windows_NT') {
  execFileSync(
    'powershell',
    ['-ExecutionPolicy', 'ByPass', '-File', `${path.resolve(__dirname, './utils/setup.ps1')}`],
    {
      stdio: 'inherit',
      cwd: __dirname,
    }
  );
} else {
  throw new Error(`Unsupported OS found: ${os.type()}`);
}
