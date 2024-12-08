import { join } from 'node:path'
import * as process from 'node:process'
import fsp from 'node:fs/promises'
import * as dotenv from 'dotenv'
import type { ApplicationPluginOptions } from '../types'

const getBoolean = (value: string | undefined) => value === 'true'

function getString(value: string | undefined, fallback: string) {
  return value ?? fallback
}

function getNumber(value: string | undefined, fallback: number) {
  return Number(value) || fallback
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string
  const reg = /--mode ([\d_a-z]+)/
  const result = reg.exec(script)

  if (result) {
    const mode = result[1]
    return ['.env', `.env.${mode}`]
  }
  return ['.env', '.env.production']
}

/**
 * 获取以指定前缀开头的环境变量
 * @param match prefix
 * @param confFiles ext
 */
async function loadEnv<T = Record<string, string>>(
  match = 'VITE_GLOB_',
  confFiles = getConfFiles(),
) {
  let envConfig = {}

  for (const confFile of confFiles) {
    try {
      const envPath = await fsp.readFile(join(process.cwd(), confFile), {
        encoding: 'utf8',
      })
      const env = dotenv.parse(envPath)
      envConfig = { ...envConfig, ...env }
    }
    catch (error) {
      console.error(`Error while parsing ${confFile}`, error)
    }
  }
  const reg = new RegExp(`^(${match})`)
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })
  return envConfig as T
}

/**
 * 加载并转换.env文件
 * @param match
 * @param confFiles
 * @returns
 */
async function loadAndConvertEnv(
  match = 'VITE_',
  confFiles = getConfFiles(),
): Promise<
  {
    appTitle: string
    base: string
    port: number
  } & Partial<ApplicationPluginOptions>
  > {
  const envConfig = await loadEnv(match, confFiles)

  const {
    VITE_APP_TITLE,
    VITE_ARCHIVER,
    VITE_BASE,
    VITE_COMPRESS,
    VITE_DEVTOOLS,
    VITE_INJECT_APP_LOADING,
    VITE_NITRO_MOCK,
    VITE_PORT,
    VITE_PWA,
    VITE_VISUALIZER,
  } = envConfig

  const compressTypes = (VITE_COMPRESS ?? '')
    .split(',')
    .filter(item => item === 'brotli' || item === 'gzip')

  return {
    appTitle: getString(VITE_APP_TITLE, 'Vben Admin'),
    archiver: getBoolean(VITE_ARCHIVER),
    base: getString(VITE_BASE, '/'),
    compress: compressTypes.length > 0,
    compressTypes,
    devtools: getBoolean(VITE_DEVTOOLS),
    injectAppLoading: getBoolean(VITE_INJECT_APP_LOADING),
    nitroMock: getBoolean(VITE_NITRO_MOCK),
    port: getNumber(VITE_PORT, 5173),
    pwa: getBoolean(VITE_PWA),
    visualizer: getBoolean(VITE_VISUALIZER),
  }
}

export { loadAndConvertEnv, loadEnv }
