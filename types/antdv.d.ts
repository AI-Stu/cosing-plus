import type { PresetColorType } from 'ant-design-vue/lib/_util/colors';

declare global {
  declare type ATagType = 'error' | 'default' | 'success' | 'processing' | 'warning' | PresetColorType;
  declare type FormInstance = FormInstance;
}
