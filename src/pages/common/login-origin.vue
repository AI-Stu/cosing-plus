<template>
  <div class="login-container">
    <div class="login-lang" flex="~" items-center justify-end gap-2 px-24px>
      <span flex items-center justify-center cursor-pointer text-16px @click="appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')">
        <!-- 亮色和暗黑模式切换按钮 -->
        <template v-if="layoutSetting.theme === 'light'">
          <carbon-moon />
        </template>
        <template v-else>
          <carbon-sun />
        </template>
        <SelectLang />
      </span>
    </div>
    <div class="login-content">
      <div class="ant-pro-form-login-container">
        <div class="ant-pro-form-login-top">
          <div class="ant-pro-form-login-header">
            <span class="ant-pro-form-login-logo">
              <img src="/logo.svg">
            </span>
            <span class="ant-pro-form-login-title">
              Cosing Plus
            </span>
          </div>
          <div class="ant-pro-form-login-desc">
            {{ t("pages.layouts.userLayout.title") }}
          </div>
        </div>
        <div class="ant-pro-form-login-main" w-335px>
          <a-form ref="formRef" :model="loginModel">
            <a-tabs v-model:active-key="loginModel.grantType" centered>
              <a-tab-pane key="password" :tab="t('pages.login.accountLogin.tab')" />
              <a-tab-pane key="sms" :tab="t('pages.login.phoneLogin.tab')" />
            </a-tabs>
            <!-- 判断是否存在error -->
            <a-alert v-if="errorAlert && loginModel.grantType === 'password'" mb-24px :message="t('pages.login.accountLogin.errorMessage')" type="error" show-icon />
            <a-alert v-if="errorAlert && loginModel.grantType === 'sms'" mb-24px :message="t('pages.login.phoneLogin.errorMessage')" type="error" show-icon />
            <template v-if="loginModel.grantType === 'password'">
              <a-form-item name="username" :rules="[{ required: true, message: t('pages.login.username.required') }]">
                <a-input v-model:value="loginModel.username" allow-clear :placeholder="t('pages.login.username.placeholder')" size="large" @press-enter="submit">
                  <template #prefix>
                    <UserOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item name="password" :rules="[{ required: true, message: t('pages.login.password.required') }]">
                <a-input-password v-model:value="loginModel.password" allow-clear :placeholder="t('pages.login.password.placeholder')" size="large" @press-enter="submit">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
            </template>
            <template v-if="loginModel.grantType === 'sms'">
              <a-form-item
                name="phone" :rules="[
                  { required: true, message: t('pages.login.phoneNumber.required') },
                  {
                    pattern: /^(86)?1([38][0-9]|4[579]|5[0-35-9]|6[6]|7[0135678]|9[89])[0-9]{8}$/,
                    message: t('pages.login.phoneNumber.invalid'),
                  },
                ]"
              >
                <a-input v-model:value="loginModel.phone" allow-clear :placeholder="t('pages.login.phoneNumber.placeholder')" size="large" @press-enter="submit">
                  <template #prefix>
                    <MobileOutlined />
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item name="code" :rules="[{ required: true, message: t('pages.login.captcha.required') }]">
                <div flex items-center>
                  <a-input
                    v-model:value="loginModel.code" style="flex: 1 1 0%; transition: width 0.3s ease 0s; margin-right: 8px;"
                    allow-clear :placeholder="t('pages.login.captcha.placeholder')" size="large" @press-enter="submit"
                  >
                    <template #prefix>
                      <LockOutlined />
                    </template>
                  </a-input>
                  <a-button :loading="codeLoading" :disabled="isActive" size="large" @click="getCode">
                    <template v-if="!isActive">
                      {{ t('pages.login.phoneLogin.getVerificationCode') }}
                    </template>
                    <template v-else>
                      {{ resetCounter - counter }} {{ t('pages.getCaptchaSecondText') }}
                    </template>
                  </a-button>
                </div>
              </a-form-item>
            </template>
            <a-form-item name="tenantId" :rules="[{ required: true, message: t('pages.login.tenant.required') }]">
              <a-select
                v-model:value="loginModel.tenantId"
                size="large"
                allow-clear
                :placeholder="t('pages.login.tenant.placeholder')"
                :options="tenantOptions"
              />
            </a-form-item>
            <div class="mb-24px" flex items-center justify-between>
              <a-checkbox v-model:checked="loginModel.remember">
                {{ t('pages.login.rememberMe') }}
              </a-checkbox>
              <a>{{ t('pages.login.forgotPassword') }}</a>
            </div>
            <a-button type="primary" block :loading="submitLoading" size="large" @click="submit">
              {{ t('pages.login.submit') }}
            </a-button>
          </a-form>
          <div class="ant-pro-form-login-other" text-14px>
            {{ t('pages.login.loginWith') }}
            <DingtalkCircleFilled class="icon" />
            <AlipayCircleFilled class="icon" />
            <!-- <TaobaoCircleFilled class="icon" />
            <WeiboCircleFilled class="icon" /> -->
          </div>
        </div>
      </div>
    </div>
    <div py-24px px-50px :data-theme="layoutSetting.theme" text-14px>
      <GlobalLayoutFooter :copyright="layoutSetting.copyright">
        <template #renderFooterLinks>
          <footer-links />
        </template>
      </GlobalLayoutFooter>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlipayCircleFilled,
  DingtalkCircleFilled,
  LockOutlined,
  MobileOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { AxiosError } from 'axios';
import type { SelectProps } from 'ant-design-vue/es/select';
import GlobalLayoutFooter from '@/layouts/components/global-footer/index.vue';
import { getTenantListApi, loginApi } from '@/api/system/login';
import { getQueryParam } from '@/utils/tools';
import type { LoginAccountParams, LoginMobileParams } from '@/api/system/login';

const message = useMessage();
const notification = useNotification();
const appStore = useAppStore();

const { layoutSetting } = storeToRefs(appStore);
const router = useRouter();
const token = useAuthorization();
const loginModel = reactive({
  tenantId: '955842',
  username: 'quxiu',
  password: undefined,
  phone: undefined,
  code: undefined,
  clientId: import.meta.env.VITE_APP_CLIENT_ID,
  grantType: 'password' as 'social' | 'password' | 'sms',
  remember: true
});
const tenantOptions = ref<SelectProps['options']>([]);
const { t } = useI18nLocale();
const formRef = shallowRef();
const codeLoading = shallowRef(false);
const resetCounter = 60;
const submitLoading = shallowRef(false);
const errorAlert = shallowRef(false);

const { counter, pause, reset, resume, isActive } = useInterval(1000, {
  controls: true,
  immediate: false,
  callback(count) {
    if (count) {
      if (count === resetCounter)
        pause();
    }
  }
});

/**
 * 获取租户列表
 */
async function initTenantList() {
  const { data } = await getTenantListApi();
  tenantOptions.value = (data?.voList || []).map((e: any) => ({
    value: e.tenantId,
    label: e.companyName
  }));
  if (tenantOptions?.value?.length !== 0) {
    loginModel.tenantId = String(tenantOptions.value[0]?.value || '955842');
  }
}

async function getCode() {
  codeLoading.value = true;
  try {
    await formRef.value.validate(['phone']);
    setTimeout(() => {
      reset();
      resume();
      codeLoading.value = false;
      message.success('验证码是：123456');
    }, 3000);
  }
  catch (error) {
    // TODO
    codeLoading.value = false;
  }
}

async function submit() {
  submitLoading.value = true;
  try {
    await formRef.value?.validate();
    let params = {} as LoginAccountParams | LoginMobileParams;

    if (loginModel.grantType === 'password') {
      params = {
        username: loginModel.username,
        password: loginModel.password
      } as unknown as LoginAccountParams;
    }
    else if (loginModel.grantType === 'sms') {
      params = {
        phone: loginModel.phone,
        code: loginModel.code
      } as unknown as LoginMobileParams;
    }
    const { data } = await loginApi({
      ...params,
      tenantId: loginModel.tenantId,
      grantType: loginModel.grantType,
      clientId: loginModel.clientId
    });

    token.value = data?.access_token;

    notification.success({
      message: '登录成功',
      description: '欢迎回来！',
      duration: 3
    });
    // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
    const redirect = getQueryParam('redirect', '/');
    router.push({
      path: redirect,
      replace: true
    });
  }
  catch (e) {
    if (e instanceof AxiosError)
      errorAlert.value = true;

    submitLoading.value = false;
  }
}

onMounted(() => {
  initTenantList();
});
</script>

<style lang="less" scoped>
.login-container{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  width: 100%;
  height: 40px;
  line-height: 44px;
}

.login-content{
  flex: 1 1;
  padding: 32px 0
}
.ant-pro-form-login-container{
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit
}

.ant-pro-form-login-top {
  text-align: center
}

.ant-pro-form-login-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  line-height: 44px
}

.ant-pro-form-login-header a {
  text-decoration: none
}

.ant-pro-form-login-title {
  position: relative;
  top: 2px;
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top
}

.ant-pro-form-login-logo img {
  width: 100%
}

.ant-pro-form-login-desc {
  margin-top: 12px;
  margin-bottom: 40px;
  color: var(--text-color-1);
  font-size: 14px
}

.ant-pro-form-login-main {
  min-width: 328px;
  max-width: 500px;
  margin: 0 auto;

  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }
  .ant-pro-form-login-other {
    margin-top: 24px;
    line-height: 22px;
    text-align: left
  }

  .icon{
    margin-left: 8px;
    color: var(--text-color-2);
    font-size: 24px;
    vertical-align: middle;
    cursor: pointer;
    transition: color .3s;

    &:hover{
      color: var(--pro-ant-color-primary);
    }
  }
}

@media(min-width: 768px){
  .login-container{
    background-image:url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
  }

  .login-content{
    padding: 32px 0 24px;
  }

  .ant-pro-form-login-container{
    padding:32px 0 24px;
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%
  }
}
</style>
