export {};
declare module 'axios' {
  interface AxiosResponse<T = any> {
    code: number
    msg: string
    rows: T
    total: number
  }

  interface AxiosOptions<T> {
    url: string
    params?: T
    data?: T
  }

}
