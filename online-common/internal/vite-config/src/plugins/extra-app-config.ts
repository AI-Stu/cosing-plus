import type { PluginOption } from 'vite';

import {
  colors,
  generatorContentHash,
  readPackageJSON
} from '@cosing/node-utils';

import { loadEnv } from '../utils/env';

interface PluginOptions {
  isBuild: boolean
  root: string
}

const GLOB_CONFIG_FILE_NAME = '_app.config.js';
const VBEN_ADMIN_PRO_APP_CONF = '_VBEN_ADMIN_PRO_APP_CONF_';

/**
 * 自定义插件
 * @description 用于将配置文件抽离出来并注入到项目中
 * @returns Promise
 */
async function viteExtraAppConfigPlugin({
  isBuild,
  root
}: PluginOptions): Promise<PluginOption | undefined> {
  let publicPath: string;
  let source: string;

  if (!isBuild) {
    return;
  }

  const { version = '' } = await readPackageJSON(root);

  return {
    async configResolved(config) {
      publicPath = ensureTrailingSlash(config.base);
      source = await getConfigSource();
    },
    async generateBundle() {
      try {
        this.emitFile({
          fileName: GLOB_CONFIG_FILE_NAME,
          source,
          type: 'asset'
        });

        console.log(`\n`);
        console.log(colors.cyan(`✨ 配置文件构建成功!`));
      }
      catch (error) {
        console.log(
          colors.red(
            `配置文件 配置文件打包失败:\n${error}`
          )
        );
      }
    },
    name: 'vite:extra-app-config',
    async transformIndexHtml(html) {
      const hash = `v=${version}-${generatorContentHash(source, 8)}`;
      const appConfigSrc = `${publicPath}${GLOB_CONFIG_FILE_NAME}?${hash}`;
      return {
        html,
        tags: [{ attrs: { src: appConfigSrc }, tag: 'script' }]
      };
    }
  };
}

async function getConfigSource() {
  const config = await loadEnv();
  const windowVariable = `window.${VBEN_ADMIN_PRO_APP_CONF}`;
  // 确保变量不会被修改
  let source = `${windowVariable}=${JSON.stringify(config)};`;
  source += `
    Object.freeze(${windowVariable});
    Object.defineProperty(window, "${VBEN_ADMIN_PRO_APP_CONF}", {
      configurable: false,
      writable: false,
    });
  `.replaceAll(/\s/g, '');
  return source;
}

function ensureTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

export { viteExtraAppConfigPlugin };
