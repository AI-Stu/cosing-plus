import path, { relative } from 'node:path';
import * as process from 'node:process';
import type { CSSOptions, UserConfig } from 'vite';

import { findMonorepoRoot } from '@cosing/node-utils';
import { defineConfig, loadEnv, mergeConfig } from 'vite';
import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';
import type { DefineApplicationOptions } from '../types';

import { loadApplicationPlugins } from '../plugins';
import { loadAndConvertEnv } from '../utils/env';
import { getCommonConfig } from './common';

/**
 * 定义应用配置
 * @param userConfigPromise
 * @returns UserConfig
 */
function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
  return defineConfig(async (config) => {
    const options = await userConfigPromise?.(config);
    const { appTitle, base, port, ...envConfig } = await loadAndConvertEnv();
    const { command, mode } = config;
    const { application = {}, vite = {} } = options || {};
    const root = process.cwd();
    const isBuild = command === 'build';
    const env = loadEnv(mode, root);

    const plugins = await loadApplicationPlugins({
      compress: false,
      compressTypes: ['brotli', 'gzip'],
      devTools: true,
      env,
      extraAppConfig: true,
      html: true,
      i18n: true,
      injectAppLoading: true,
      injectMetadata: true,
      build: isBuild,
      license: true,
      mode,
      nitroMock: !isBuild,
      nitroMockOptions: {},
      print: !isBuild,
      printInfoMap: {
        'Vben Admin Docs': 'https://doc.vben.pro'
      },
      pwa: true,
      pwaOptions: getDefaultPwaOptions(appTitle, isBuild),
      ...envConfig,
      ...application
    });

    const { injectGlobalScss = true } = application;

    const applicationConfig: UserConfig = {
      base,
      build: {
        rollupOptions: {
          output: {
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'jse/index-[name]-[hash].js'
          }
        },
        target: 'es2020'
      },
      css: createCssOptions(injectGlobalScss),
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger'
            ]
          : [],
        legalComments: 'none'
      },
      plugins,
      server: {
        host: true,
        port,
        warmup: {
          // 预热文件
          clientFiles: [
            './index.html',
            './src/main.ts',
            './src/{views,layouts,router,store,api,adapter}/*'
          ]
        }
      }
    };

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig
    );
    return mergeConfig(mergedCommonConfig, vite);
  });
}

/**
 * 创建css配置
 * @param injectGlobalScss
 * @returns CSSOptions
 */
function createCssOptions(injectGlobalScss = true): CSSOptions {
  const root = findMonorepoRoot();
  return {
    preprocessorOptions: injectGlobalScss
      ? {
          scss: {
            additionalData: (content: string, filepath: string) => {
              const relativePath = relative(root, filepath);
              // apps下的包注入全局样式
              if (relativePath.startsWith(`apps${path.sep}`)) {
                return `@use "@cosing/styles/global" as *;\n${content}`;
              }
              return content;
            },
            api: 'modern',
            importers: [new NodePackageImporter()]
          }
        }
      : {}
  };
}

function getDefaultPwaOptions(name: string, isBuild: boolean): Partial<PwaPluginOptions> {
  return {
    manifest: {
      description: 'Cosing Plus是一个基于Vue3、Vite5、ant-design-vue4、Pinia、UnoCSS和Typescript的一整套企业级中后台前端/设计解决方案。',
      icons: [
        {
          sizes: '192x192',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-192.png',
          type: 'image/png'
        },
        {
          sizes: '512x512',
          src: 'https://unpkg.com/@vbenjs/static-source@0.1.7/source/pwa-icon-512.png',
          type: 'image/png'
        }
      ],
      name: `${name}${!isBuild ? ' dev' : ''}`,
      short_name: `${name}${!isBuild ? ' dev' : ''}`
    }
  };
}

export { defineApplicationConfig };
