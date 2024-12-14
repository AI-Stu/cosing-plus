import { resolve } from 'node:path';
import * as process from 'node:process';
import fsExtra from 'fs-extra';
import { transformSync } from 'esbuild';

const themeConfig = resolve(process.cwd(), './src/config/default-setting.ts');
const code = fsExtra.readFileSync(themeConfig, 'utf-8');

function toJs(code: string) {
  const res = transformSync(code, {
    target: 'esnext',
    loader: 'ts'
  });
  console.log(res.code);
}

toJs(code);
