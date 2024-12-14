import * as process from 'node:process'
import type { ConfigEnv, UserConfig } from 'vite'

import { readPackageJSON } from '@cosing/node-utils'

import { defineConfig, mergeConfig } from 'vite'
import type { DefineLibraryOptions } from '../types'

import { loadLibraryPlugins } from '../plugins'
import { getCommonConfig } from './common'

/**
 * 定义库配置
 * @param userConfigPromise
 * @returns
 */
function defineLibraryConfig(userConfigPromise?: DefineLibraryOptions) {
  return defineConfig(async (config: ConfigEnv) => {
    const options = await userConfigPromise?.(config)
    const { command, mode } = config
    const { library = {}, vite = {} } = options || {}
    const root = process.cwd()
    const isBuild = command === 'build'

    const plugins = await loadLibraryPlugins({
      dts: false,
      isInjectMetadata: true,
      isBuild,
      mode,
      ...library
    })

    const { dependencies = {}, peerDependencies = {} }
      = await readPackageJSON(root)

    const externalPackages = [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies)
    ]

    const packageConfig: UserConfig = {
      build: {
        lib: {
          entry: 'src/index.ts',
          fileName: () => 'index.mjs',
          formats: ['es']
        },
        rollupOptions: {
          external: (id) => {
            return externalPackages.some(
              pkg => id === pkg || id.startsWith(`${pkg}/`)
            )
          }
        }
      },
      plugins
    }
    const commonConfig = await getCommonConfig()
    const mergedConmonConfig = mergeConfig(commonConfig, packageConfig)
    return mergeConfig(mergedConmonConfig, vite)
  })
}

export { defineLibraryConfig }
