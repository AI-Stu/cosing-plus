import { existsSync } from 'node:fs';
import * as process from 'node:process';
import { join } from 'node:path';
import type { DefineConfig } from '../types';

import { defineApplicationConfig } from './application';
import { defineLibraryConfig } from './library';

export * from './application';
export * from './library';

/**
 * 定义配置
 * @param userConfigPromise
 * @param type
 * @returns UserConfig
 */
function defineConfig(
  userConfigPromise?: DefineConfig,
  type: 'application' | 'auto' | 'library' = 'auto'
) {
  let projectType = type;

  // 根据包是否存在 index.html,自动判断类型
  if (projectType === 'auto') {
    const htmlPath = join(process.cwd(), 'index.html');
    projectType = existsSync(htmlPath) ? 'application' : 'library';
  }

  switch (projectType) {
    // 应用模式
    case 'application': {
      return defineApplicationConfig(userConfigPromise);
    }
    // 库模式
    case 'library': {
      return defineLibraryConfig(userConfigPromise);
    }
    default: {
      throw new Error(`Unsupported project type: ${projectType}`);
    }
  }
}

export { defineConfig };
