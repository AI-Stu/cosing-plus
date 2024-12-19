<script setup lang="ts">
import { CopyrightCircleOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'GlobalFooter'
});

defineProps<{
  copyright?: string
  icp?: string
  record?: string
}>();

const prefixCls = shallowRef('ant-pro-global-footer');
</script>

<template>
  <div :class="prefixCls">
    <div v-if="$slots.renderFooterLinks" :class="`${prefixCls}-links`">
      <slot name="renderFooterLinks" />
    </div>
    <div v-if="copyright" :class="`${prefixCls}-copyright`">
      <CopyrightCircleOutlined /> {{ copyright }}
      <a v-if="icp" href="https://beian.miit.gov.cn/" target="_blank" class="pl-4">{{ icp }}</a>
      <span v-if="record" class="pl-4">
        <img alt="" class="record" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAFIUlEQVR4AR3BfWycdQHA8e/ze5577nme3l3v2t5dz96cdAPawba6FxBSQUbiYLqCNUHxDxSdSEyUYOQPjcaSaYL/zIgGMUMStvAHOhNIuyDbKEFkAXWhcSx76bqt613Xt+v17rl7nufuefPpPh8pDEOwmqwLEIgwwFZL6LFeoNFrXflk5L23//P9lu2pX/ry9sNd27a9Cf2lViskbtsgJEBwUyqJQsTFAylE+CGoGfRw8YHpt44+/eE/Lo2E9rQ21zKQM2msYxf+YL88/rvhB/vHB/ePvhrGPzcRthqEkgSEyCQRROqSSSNcIzQyoDra5J/+MvnEU6ceaziz2m0JmQPaIk9rc9x7T56ue/LKgadOfu3Eiy+MS7oct1QJh//iKmdYJ1gnC4ScQhGVYuuTg+/8/vUajx/o5zvFOp1/Pkflok9lxqf21Zd5xD/LM0e+yeG/u4QXX/lbwnA0oSXQOuKsk8fGxpCteeKGN1iaOHh+37cu9xd39PKbW88w/coacmccLwyIGSqe6XP5rWvse6KLfzp3cOhXJ2/ft2Ppe55Xn5id+qiS7f8Kgki8ZaM47yTGLybVf8/v4uFdJo2pOuJ6DSkdJ77q43y4SOyWbrSGzcprHzO6t83k5S0c/cAvJKSmjhhinSBSW14pBh+9eyiQdFAsUuY89QWI+S6sOkibDNSdacSNJioBK1dt+rpaIElUG4J4Vjk0MDx6CxFBZPbCya+3y+XhTEIFL05YKNAz3EuDEPPebvzHiySeH8J4Zhsia5Db2UPTakMYUsgZUJp6YHXu9HeJCCJGIjNYN136sw5o3Zz42EDZk6KyfyN+2UT6XxPr+CLu1TXU54bpenY7x45UgQ6Gtio0Z5ZwSjNFIoJIsDq/v15VuLNoUrxL5aWjHbz/Qomh3QU6jSTWuSrBUgvnbJVkeY1PD17ixSNx8kNptvbVWCm3cFcvDBMRRITSTJt1QWr5Eo/t9fHcBO7EAt1vnEH0xWhnZYKcQs+eAoXJK6wc/pRmW2Z0JEayMo1ZV1CSIkZEIaIbnz0lbr824uf7ePJuk0N9WV4qD+LOnaO7Mo3o1LHPVTE35yhnCvxV6JBK8+QXlvCSRdJ3SBiZDceJKNwkcmE9ZH7G5M7Bq/z6pzv5xXP3MWFuhbrLiFWhKy04djxJAwPI8JMfauzePM38NOBYBJ65nYhCREm3d3nJPO6CS2npPD8ejjN6qoPJty0uiG08tOUyBX0Fb7yPdtVmw4DBzx+6xuLpa1iuhtajoqTVASIKkfTW/d/2rd++bi+0qa8Y1N84yaZHhxg8oIH/AX5FobFkc/TZ67CxG0rnufrmRexkD4n+BPFeAyN71ygReWxsDEXtO6vnB2YCb+rBeI+sNRdDast1lEKe5qKMWXPxO5L4WgftpsT86TKelqLr7lsJlVQlsWnvI1pKf0+SN6EQce1Z7GW77CzotpYPOvN7NuPXmvhmHQwVWU2j6tBea9AsVdE2dqMV87TWLJyyGeobGsipFDogiITtK8j862e5HcneWKZAqxYQ+AqBL+MsmxAGtCs1GtPLSHIMJAnnxgoxXZD/YqFHNcwfBDY3CSKqnCLevftR0+r8o1UqNVV5jVTOIyZZqJKL3FojtG2SAz2kNqcQagOlU0XK9F73lM//UjFu+4asLrNOYV3oIsUUq17p+JF9Pv+8XVt+uOXO3f+ZLdktgSkltLToUvQk5g2u69m0peTum1qdWTplz1ZP9N2fCyRZJvQd1v0fFAQz706Eg8sAAAAASUVORK5CYII=">
        <a target="_blank" href="https://beian.mps.gov.cn/#/query/webSearch">{{ record }}</a>
      </span>
    </div>
  </div>
</template>

<style lang="less">
@import "index";
</style>
