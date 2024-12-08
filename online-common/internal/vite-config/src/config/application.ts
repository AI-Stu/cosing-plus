import path, { relative } from 'node:path'
import * as process from 'node:process'
import type { UserConfig } from 'vite'

import { findMonorepoRoot } from '@cosing/node-utils'
import { NodePackageImporter } from 'sass'
import { defineConfig, loadEnv, mergeConfig } from 'vite'
import type { DefineApplicationOptions } from '../types'

import { defaultImportmapOptions, getDefaultPwaOptions } from '../options'
import { loadApplicationPlugins } from '../plugins'
import { loadAndConvertEnv } from '../utils/env'
import { getCommonConfig } from './common'

/**
 * 定义应用配置
 * @param userConfigPromise
 * @returns
 */
function defineApplicationConfig(userConfigPromise?: DefineApplicationOptions) {
  return defineConfig(async (config) => {
    const options = await userConfigPromise?.(config)
    const { appTitle, base, port, ...envConfig } = await loadAndConvertEnv()
    const { command, mode } = config
    const { application = {}, vite = {} } = options || {}
    const root = process.cwd()
    const isBuild = command === 'build'
    const env = loadEnv(mode, root)

    const plugins = await loadApplicationPlugins({
      archiver: true,
      archiverPluginOptions: {},
      compress: false,
      compressTypes: ['brotli', 'gzip'],
      devtools: true,
      env,
      extraAppConfig: true,
      html: true,
      i18n: true,
      importmapOptions: defaultImportmapOptions,
      injectAppLoading: true,
      injectMetadata: true,
      isBuild,
      license: true,
      mode,
      nitroMock: !isBuild,
      nitroMockOptions: {},
      print: !isBuild,
      printInfoMap: {
        'Vben Admin Docs': 'https://doc.vben.pro',
      },
      pwa: true,
      pwaOptions: getDefaultPwaOptions(appTitle),
      vxeTableLazyImport: true,
      ...envConfig,
      ...application,
    })

    const { injectGlobalScss = true } = application

    const applicationConfig: UserConfig = {
      base,
      build: {
        rollupOptions: {
          output: {
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'jse/index-[name]-[hash].js',
          },
        },
        target: 'es2015',
      },
      css: createCssOptions(injectGlobalScss),
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger',
            ]
          : [],
        legalComments: 'none',
      },
      plugins,
      server: {
        host: true,
        port,
        warmup: {
          // 预热文件
          clientFiles: [
            './index.html',
            './src/bootstrap.ts',
            './src/{views,layouts,router,store,api,adapter}/*',
          ],
        },
      },
    }

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(),
      applicationConfig,
    )
    return mergeConfig(mergedCommonConfig, vite)
  })
}

function createCssOptions(injectGlobalScss = true) {
  const root = findMonorepoRoot()
  return {
    preprocessorOptions: injectGlobalScss
      ? {
          scss: {
            additionalData: (content: string, filepath: string) => {
              const relativePath = relative(root, filepath)
              // apps下的包注入全局样式
              if (relativePath.startsWith(`apps${path.sep}`)) {
                return `@use "@cosing/styles/global" as *;\n${content}`
              }
              return content
            },
            api: 'modern',
            importers: [new NodePackageImporter()],
          },
        }
      : {},
  }
}

export { defineApplicationConfig }
