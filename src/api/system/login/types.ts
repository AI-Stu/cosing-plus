export interface LoginParams {
  tenantId: string
  grantType: 'social' | 'password' | 'sms'
  clientId?: string
  rememberMe?: boolean
  source?: string
}

// 账号密码登录入参
export interface LoginAccountParams extends LoginParams {
  username: string
  password: string
  code?: string
  uuid?: string
}

// 手机验证码登录入参
export interface LoginMobileParams extends LoginParams {
  phone: string
  code: string
}

export interface LoginResultModel {
  scope: string
  openid: string
  isNewUser: string
  access_token: string
  refresh_token: string
}

/**
 * 验证码返回
 */
export interface VerifyCodeResult {
  captchaEnabled: boolean
  uuid?: string
  img?: string
}

/**
 * 租户
 */
export interface TenantVO {
  companyName: string
  domain: any
  tenantId: string
  delFlag: string
}

export interface TenantInfo {
  tenantEnabled: boolean
  voList: TenantVO[]
}
