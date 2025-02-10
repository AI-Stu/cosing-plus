/**
 * 用于配置全局错误处理功能，可以监控vue错误、脚本错误、静态资源错误和Promise错误
 */
import type { App } from 'vue';
import { ErrorTypeEnum } from '@/enums/ExceptionEnum';

/**
 * 处理错误堆栈信息
 * @param error
 */
function processStackMsg(error) {
  if (!error.stack) {
    return '';
  }
  let stack = error.stack
    .replace(/\n/g, '') // Remove line breaks to save the size of the transmitted content
    .replace(/\bat\b/gi, '@') // At in chrome, @ in ff
    .split('@') // Split information with @
    .slice(0, 9) // The maximum stack length (Error.stackTraceLimit = 10), so only take the first 10
    .map((v: string) => v.replace(/^\s*|\s*$/g, '')) // Remove extra spaces
    .join('~') // Manually add separators for later display
    .replace(/\?[^:]+/g, ''); // Remove redundant parameters of js file links (?x=1 and the like)
  const msg = error.toString();
  if (!stack.includes(msg)) {
    stack = `${msg}@${stack}`;
  }
  return stack;
}

/**
 * 获取计算机名称
 * @param vm
 */
function formatComponentName(vm) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root'
    };
  }

  const options = vm.$options;
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous'
    };
  }
  const name = options.name || options._componentTag;
  return {
    name,
    path: options.__file
  };
}

/**
 * 配置Vue错误处理函数
 * @param { Error } err
 * @param { any } vm
 * @param { string } info
 */
function vueErrorHandler(err, vm, info) {
  const { name, path } = formatComponentName(vm);
  console.log({
    type: ErrorTypeEnum.VUE,
    name,
    file: path,
    message: err.message,
    stack: processStackMsg(err),
    detail: info,
    url: window.location.href
  });
}

/**
 * 配置脚本错误处理函数
 * @param { event | string} event
 * @param { string= } source
 * @param { number= } lineno
 * @param { number= } colno
 * @param { Error= } error
 * @returns { boolean } scriptErrorHandler
 */
export function scriptErrorHandler(event, source, lineno, colno, error) {
  if (event === 'Script error.' && !source) {
    return false;
  }
  const errorInfo = {};
  colno = colno || (window.event && window.event.errorCharacter) || 0;
  errorInfo.message = event;
  if (error?.stack) {
    errorInfo.stack = error.stack;
  }
  else {
    errorInfo.stack = '';
  }
  const name = source ? source.substr(source.lastIndexOf('/') + 1) : 'script';

  console.log({
    type: ErrorTypeEnum.SCRIPT,
    name,
    file: source,
    detail: `lineno${lineno}`,
    url: window.location.href,
    ...errorInfo
  });
  return true;
}

/**
 * 配置Promise错误处理函数
 */
function registerPromiseErrorHandler() {
  window.addEventListener(
    'unhandledrejection',
    (event) => {
      console.log({
        type: ErrorTypeEnum.PROMISE,
        name: 'Promise Error!',
        file: 'none',
        detail: 'promise error!',
        url: window.location.href,
        stack: 'promise error!',
        message: event.reason
      });
    },
    true
  );
}

/**
 * 配置监控资源加载错误处理功能
 */
function registerResourceErrorHandler() {
  // 监控资源加载错误（img、script、css、jsonp）
  window.addEventListener(
    'error',
    (e) => {
      const target = e.target ? e.target : e.srcElement;

      console.log({
        type: ErrorTypeEnum.RESOURCE,
        name: 'Resource Error!',
        file: (e.target || {}).currentSrc,
        detail: JSON.stringify({
          tagName: target.localName,
          html: target.outerHTML,
          type: e.type
        }),
        url: window.location.href,
        stack: 'resource is not found',
        message: `${(e.target || {}).localName} is load error`
      });
    },
    true
  );
}

/**
 * 配置全局错误处理
 * @param { App } app
 */
export function setupErrorHandle(app: App<any>) {
  // Vue异常监控；
  app.config.errorHandler = vueErrorHandler;

  // 脚本错误
  window.onerror = scriptErrorHandler;

  // promise
  // registerPromiseErrorHandler();

  // 静态资源异常
  registerResourceErrorHandler();
}
