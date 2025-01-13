import type {
  AxiosError,
  AxiosInstance,
  AxiosOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import axios from 'axios';
import FileSaver from 'file-saver';
import { AxiosLoading } from './loading';
import { tansParams } from './tools';
import router from '@/router';
import { decryptBase64, decryptWithAes, encryptBase64, encryptWithAes, generateAesKey } from '@/composables/crypto';
import { decrypt, encrypt } from '@/composables/jsencrypt';
import { STORAGE_AUTHORIZE_KEY, useAuthorization, useSessionRequest } from '@/composables/authorization';
import { ContentTypeEnum, RequestEnum } from '@/enums/HttpEnum';
import { ErrorCodeEnum, HttpStatusEnum } from '@/enums/RespEnum';

export interface ResponseBody<T = any> {
  code: number
  data?: T
  msg: string
}

/**  请求配置  */
export interface RequestConfigExtra<T = any> {
  token?: boolean // 设置为false的时候不会携带token
  customDev?: boolean // 是否开启自定义接口
  loading?: boolean // 是否开启全局请求loading
  repeatSubmit?: boolean // 是否开启防止重复提交
  encrypt?: boolean // 是否开启参数加密
  extraData?: T // 额外参数
}
const { VITE_APP_CLIENT_ID, VITE_APP_ENCRYPT, PROD } = import.meta.env;
const encryptHeader = 'encrypt-key';
const requestConfigExtra = {
  token: true,
  customDev: false,
  loading: false,
  repeatSubmit: true,
  encrypt: true
};
const service: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 60000,
  headers: {
    'Content-Type': ContentTypeEnum.JSON,
    'clientid': VITE_APP_CLIENT_ID
  }
});

const axiosLoading = new AxiosLoading(); // 全局请求loading
const message = useMessage();
export function globalHeaders() {
  const token = useAuthorization();
  return {
    Authorization: `Bearer ${token.value}`,
    clientid: VITE_APP_CLIENT_ID
  };
}

/**
 * 处理请求
 * @param config
 * @returns Promise
 */
async function requestHandler(config: InternalAxiosRequestConfig & RequestConfigExtra): Promise<InternalAxiosRequestConfig> {
  config = {
    ...requestConfigExtra,
    ...config
  };
  const token = useAuthorization();
  const sessionRequest = useSessionRequest();

  // 携带token
  if (token.value && config.token)
    config.headers.set(STORAGE_AUTHORIZE_KEY, `Bearer ${token.value}`);

  // 开启参数加密
  if (VITE_APP_ENCRYPT && config.encrypt && PROD) {
    if ([RequestEnum.POST, RequestEnum.PUT].includes(config.method as RequestEnum)) {
      const aesKey = generateAesKey(); // 生成一个 AES 密钥
      config.headers.set(encryptHeader, encrypt(encryptBase64(aesKey)));
      config.data = typeof config.data === 'object'
        ? encryptWithAes(JSON.stringify(config.data), aesKey)
        : encryptWithAes(config.data, aesKey);
    }
  }

  // 重复提交
  if (config.repeatSubmit && [RequestEnum.POST, RequestEnum.PUT].includes(config.method as RequestEnum)) {
    const requestObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    };
    sessionRequest.value = requestObj;
  }

  // FormData数据去请求头Content-Type
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  // 增加多语言的配置
  const { locale } = useI18nLocale();
  config.headers.set('Accept-Language', locale.value ?? 'zh-CN');

  // 开启全局loading
  if (config.loading)
    axiosLoading.addLoading();
  return config;
}

/**
 * 处理响应
 * @param response
 * @returns ResponseBody<any> | AxiosResponse<any> | Promise<any> | any
 */
function responseHandler(response: any): ResponseBody<any> | AxiosResponse<any> | Promise<any> | any {
  const notification = useNotification();
  const token = useAuthorization();
  const { config, headers, request } = response;
  let { data } = response;

  if (VITE_APP_ENCRYPT && PROD && config.encrypt) {
    // 加密后的 AES 秘钥
    const keyStr = headers[encryptHeader];
    // 加密
    if (keyStr) {
      // 请求体 AES 解密
      const base64Str = decrypt(keyStr);
      // base64 解码 得到请求头的 AES 秘钥
      const aesKey = decryptBase64(base64Str.toString());
      // aesKey 解码 data
      const decryptData = decryptWithAes(data, aesKey);
      // 将结果 (得到的是 JSON 字符串) 转为 JSON
      data = JSON.parse(decryptData);
    }
  }

  // 未设置状态码则默认成功状态
  const code = data.code || HttpStatusEnum.SUCCESS;
  // 获取错误信息
  const msg = ErrorCodeEnum[code] || data.msg || ErrorCodeEnum.DEFAULT;
  // 二进制数据则直接返回
  if (request.responseType === 'blob' || request.responseType === 'arraybuffer') {
    return data;
  }

  // 请求成功
  if (code === HttpStatusEnum.SUCCESS) {
    return Promise.resolve(data);
  }

  // 请求异常
  notification?.error({
    message: code,
    description: msg,
    duration: 3
  });
  if ([
    HttpStatusEnum.UNAUTHORIZED,
    HttpStatusEnum.UNAUTHORIZED_TENANT,
    HttpStatusEnum.AUTHENTICATION_FAILED
  ].includes(code)) {
    /**
     * 这里处理清空用户信息和token的逻辑，后续扩展
     */
    token.value = null;
    router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    }).then(() => {});
  }
  return Promise.reject(data);
}

/**
 * 处理错误
 * @param error
 * @returns Promise
 */
function errorHandler(error: AxiosError): Promise<any> {
  return Promise.reject(error);
}

service.interceptors.request.use(requestHandler);

service.interceptors.response.use(responseHandler, errorHandler);

export default service;

/**
 * 实例化请求
 * @param options
 * @returns Promise
 */
function servicePromise<R = any, T = any>(options: AxiosOptions<T> & RequestConfigExtra): Promise<ResponseBody<R>> {
  const { loading } = options;
  return new Promise((resolve, reject) => {
    service.request(options).then((res) => {
      resolve(res as any);
    }).catch((e: Error | AxiosError) => {
      reject(e);
    }).finally(() => {
      if (loading) {
        axiosLoading.closeLoading();
      }
    });
  });
}

/**
 * get 请求
 * @param url
 * @param params
 * @param config
 * @returns Promise
 */
export function useGet< R = any, T = any>(
  url: string,
  params?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R> | AxiosResponse<any> | any> {
  const options = {
    url,
    params,
    method: RequestEnum.GET,
    ...config
  };
  return servicePromise< R, T >(options);
}

/**
 * Post 请求
 * @param url
 * @param data
 * @param config
 * @returns Promise
 */
export function usePost< R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R> | AxiosResponse<any> | any> {
  const options = {
    url,
    data,
    method: RequestEnum.POST,
    ...config
  };
  return servicePromise< R, T >(options);
}

/**
 * Put 请求
 * @param url
 * @param data
 * @param config
 * @returns Promise
 */
export function usePut< R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.PUT,
    ...config
  };
  return servicePromise<R, T>(options);
}

/**
 * Delete 请求
 * @param url
 * @param data
 * @param config
 * @returns Promise
 */
export function useDelete< R = any, T = any>(
  url: string,
  data?: T,
  config?: AxiosRequestConfig & RequestConfigExtra
): Promise<ResponseBody<R>> {
  const options = {
    url,
    data,
    method: RequestEnum.DELETE,
    ...config
  };
  return servicePromise<R, T>(options);
}

/**
 * 通用下载方法
 * @description 主要用于代码生成器导出功能
 * @param url
 * @param params
 * @param fileName
 * @returns Promise
 */
export function useDownload(url: string, params: any, fileName: string) {
  axiosLoading.addLoading();

  return service.post(url, params, {
    transformRequest: [
      (params: any) => {
        return tansParams(params);
      }
    ],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob'
  }).then(async (resp: any) => {
    if (resp.type !== 'application/json') {
      const blob = new Blob([resp]);
      FileSaver.saveAs(blob, fileName);
    }
    else {
      const resText = await resp.data.text();
      const rspObj = JSON.parse(resText);
      // 未设置状态码则默认成功状态
      const code = rspObj.code || HttpStatusEnum.SUCCESS;
      // 获取错误信息
      const errMsg = ErrorCodeEnum[code] || rspObj.msg || ErrorCodeEnum.DEFAULT;
      message.error(errMsg);
    }
  }).catch((r: any) => {
    console.error(r);
    message.error('下载文件出现错误，请联系管理员！');
  }).finally(() => {
    axiosLoading.closeLoading();
  });
}
