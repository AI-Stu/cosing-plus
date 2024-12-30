/*
 * @Description: 注册全局组件
 * @Author: Guanghao_Hu
 * @Date: 2024-09-23 15:46:03
 * @LastEditors: Do not edit
 * @LastEditTime: 2024-09-23 15:51:07
 */
import DictTag from './DictTag/index.vue';
import ImagePreview from './ImagePreview/index.vue';
import TableRightToolbar from './TableRightToolbar/index.vue';

const compList = [DictTag, ImagePreview, TableRightToolbar];

export function registerGlobComp(app: { component: (arg0: any, arg1: any) => void }) {
  compList.forEach((comp) => {
    app.component(comp.name || comp.displayName, comp);
  });
}
