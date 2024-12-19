import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import type { Options as PluginAutoImportOptions } from 'unplugin-auto-import/types';
import type { Options as PluginComponentsOptions } from 'unplugin-vue-components/types';
import type { ConfigEnv, PluginOption, UserConfig } from 'vite';
import type { PluginOptions } from 'vite-plugin-dts';
import type { Options as PwaPluginOptions } from 'vite-plugin-pwa';

interface PrintPluginOptions {
  /**
   * 打印的数据
   */
  infoMap?: Record<string, string | undefined>
}

interface NitroMockPluginOptions {
  /**
   * mock server 包名
   */
  mockServerPackage?: string

  /**
   * mock 服务端口
   */
  port?: number

  /**
   * mock 日志是否打印
   */
  verbose?: boolean
}

interface ArchiverPluginOptions {
  /**
   * 输出文件名
   * @default dist
   */
  name?: string
  /**
   * 输出目录
   * @default .
   */
  outputDir?: string
}

/**
 * 用于判断是否需要加载插件
 */
interface ConditionPlugin {
  // 判断条件
  condition?: boolean
  // 插件对象
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>
}

interface CommonPluginOptions {
  /** 是否开启devtools */
  devTools?: boolean
  /** 环境变量 */
  env?: Record<string, any>
  /** 是否注入metadata */
  injectMetadata?: boolean
  /** 是否构建模式 */
  build?: boolean
  /** 构建模式 */
  mode?: string
  /** 开启自动引入 */
  autoImport?: boolean
  autoImportOptions?: PluginAutoImportOptions
  /** 开启依赖分析 */
  visualizer?: boolean
  visualizerOptions?: PluginVisualizerOptions
}

interface ApplicationPluginOptions extends CommonPluginOptions {
  /** 开启 gzip|brotli 压缩 */
  compress?: boolean
  /** 压缩类型 */
  compressTypes?: ('brotli' | 'gzip')[]
  /** 在构建的时候抽离配置文件 */
  extraAppConfig?: boolean
  /** 是否开启html插件  */
  html?: boolean
  /** 是否开启i18n */
  i18n?: boolean
  /** 是否注入app loading */
  injectAppLoading?: boolean
  /** 是否注入全局scss */
  injectGlobalScss?: boolean
  /** 是否注入版权信息 */
  license?: boolean
  /** 是否开启nitro mock */
  nitroMock?: boolean
  /** nitro mock 插件配置 */
  nitroMockOptions?: NitroMockPluginOptions
  /** 开启控制台自定义打印 */
  print?: boolean
  /** 打印插件配置 */
  printInfoMap?: PrintPluginOptions['infoMap']
  /** 是否开启pwa */
  pwa?: boolean
  /** pwa 插件配置 */
  pwaOptions?: Partial<PwaPluginOptions>
  /** 自动导入组件 */
  components?: boolean
  componentsOptions?: PluginComponentsOptions
}

interface LibraryPluginOptions extends CommonPluginOptions {
  /** 开启 dts 输出 */
  dts?: boolean | PluginOptions
}

type ApplicationOptions = ApplicationPluginOptions

type LibraryOptions = LibraryPluginOptions

type DefineApplicationOptions = (config?: ConfigEnv) => Promise<{
  application?: ApplicationOptions
  vite?: UserConfig
}>

type DefineLibraryOptions = (config?: ConfigEnv) => Promise<{
  library?: LibraryOptions
  vite?: UserConfig
}>

type DefineConfig = DefineApplicationOptions | DefineLibraryOptions

export type {
  ApplicationPluginOptions,
  ArchiverPluginOptions,
  CommonPluginOptions,
  ConditionPlugin,
  DefineApplicationOptions,
  DefineConfig,
  DefineLibraryOptions,
  LibraryPluginOptions,
  NitroMockPluginOptions,
  PrintPluginOptions
};
