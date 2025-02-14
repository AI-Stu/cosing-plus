import { Buffer } from 'node:buffer';

const menuData = [
  {
    id: 2,
    parentId: null,
    title: '分析页',
    icon: 'DashboardOutlined',
    component: '/dashboard/analysis',
    path: '/dashboard/analysis',
    name: 'DashboardAnalysis',
    keepAlive: true,
    locale: 'menu.dashboard.analysis'
  },
  {
    id: 90,
    parentId: null,
    title: '系统管理',
    icon: 'SettingOutlined',
    component: 'RouteView',
    redirect: '/system/dict',
    path: '/system',
    name: 'System',
    locale: 'menu.system'
  },
  {
    id: 91,
    parentId: 90,
    title: '用户管理',
    component: '/system/user',
    path: '/system/user',
    name: 'SystemUser',
    keepAlive: true,
    locale: 'menu.system.user'
  },
  {
    id: 92,
    parentId: 90,
    title: '角色管理',
    component: '/system/role',
    path: '/system/role',
    name: 'SystemRole',
    keepAlive: true,
    locale: 'menu.system.role'
  },
  {
    id: 93,
    parentId: 90,
    title: '部门管理',
    component: '/system/dept',
    path: '/system/dept',
    name: 'SystemDept',
    keepAlive: true,
    locale: 'menu.system.dept'
  },
  {
    id: 94,
    parentId: 90,
    title: '岗位管理',
    component: '/system/post',
    path: '/system/post',
    name: 'SystemPost',
    keepAlive: true,
    locale: 'menu.system.post'
  },
  {
    id: 95,
    parentId: 90,
    title: '菜单管理',
    component: '/system/menu',
    path: '/system/menu',
    name: 'SystemMenu',
    keepAlive: true,
    locale: 'menu.system.menu'
  },
  {
    id: 96,
    parentId: 90,
    title: '字典管理',
    component: '/system/dict',
    path: '/system/dict',
    name: 'SystemDict',
    keepAlive: true,
    locale: 'menu.system.dict'
  },
  {
    id: 97,
    parentId: 90,
    title: '参数管理',
    component: '/system/config',
    path: '/system/config',
    name: 'SystemConfig',
    keepAlive: true,
    locale: 'menu.system.config'
  },
  {
    id: 98,
    parentId: 90,
    title: '通知公告',
    component: '/system/notice',
    path: '/system/notice',
    name: 'SystemNotice',
    keepAlive: true,
    locale: 'menu.system.notice'
  },
  {
    id: 99,
    parentId: 90,
    title: '日志管理',
    component: '/system/log',
    path: '/system/log',
    name: 'SystemLog',
    keepAlive: true,
    locale: 'menu.system.log'
  },
  {
    id: 991,
    parentId: 99,
    title: '操作日志',
    component: '/system/log/operate',
    path: '/system/log/operate',
    name: 'SystemOperateLog',
    keepAlive: true,
    locale: 'menu.system.log.operate'
  },
  {
    id: 992,
    parentId: 99,
    title: '登录日志',
    component: '/system/log/login',
    path: '/system/log/login',
    name: 'SystemLoginLog',
    keepAlive: true,
    locale: 'menu.system.log.login'
  },
  {
    id: 100,
    parentId: 90,
    title: '登录日志',
    component: '/system/client',
    path: '/system/log/client',
    name: 'SystemClient',
    keepAlive: true,
    locale: 'menu.system.client'
  },
  {
    id: 80,
    parentId: null,
    title: '项目管理',
    icon: 'FormOutlined',
    component: 'RouteView',
    redirect: '/projectManagement/sportsEvtent',
    path: '/projectManagement',
    name: 'ProjectManagement',
    locale: 'menu.ProjectManagement'
  },
  {
    id: 810,
    parentId: 80,
    title: '项目管理',
    component: '/projectManagement/sportsEvtent',
    path: '/projectManagement/sportsEvtent',
    name: 'SportsEvtent',
    locale: 'menu.ProjectManagement.SportsEvtent'
  },
  // {
  //   id: 811,
  //   parentId: 80,
  //   title: '创建项目',
  //   component: '/projectManagement/addSportsEvtent',
  //   path: '/projectManagement/addSportsEvtent',
  //   name: 'AddSportsEvtent',
  //   locale: 'menu.ProjectManagement.AddSportsEvtent'
  // },
  {
    id: 1,
    parentId: null,
    title: '仪表盘',
    icon: 'DashboardOutlined',
    component: 'RouteView',
    redirect: '/dashboard/analysis',
    path: '/dashboard',
    name: 'Dashboard',
    locale: 'menu.dashboard'
  },
  {
    id: 3,
    parentId: null,
    title: '表单页',
    icon: 'FormOutlined',
    component: 'RouteView',
    redirect: '/form/basic',
    path: '/form',
    name: 'Form',
    locale: 'menu.form'
  },
  {
    id: 5,
    parentId: null,
    title: '链接',
    icon: 'LinkOutlined',
    component: 'RouteView',
    redirect: '/link/iframe',
    path: '/link',
    name: 'Link',
    locale: 'menu.link'

  },
  {
    id: 6,
    parentId: 5,
    title: 'AntDesign',
    link: 'https://ant.design/',
    component: 'Iframe',
    path: '/link/iframe',
    name: 'LinkIframe',
    keepAlive: true,
    locale: 'menu.link.iframe'
  },
  {
    id: 7,
    parentId: 5,
    title: 'AntDesignVue',
    link: 'https://antdv.com/',
    component: 'Iframe',
    path: '/link/antdv',
    name: 'LinkAntdv',
    keepAlive: true,
    locale: 'menu.link.antdv'
  },
  {
    id: 8,
    parentId: 5,
    path: 'https://www.baidu.com',
    name: 'LinkExternal',
    title: '跳转百度',
    locale: 'menu.link.external'
  },
  {
    id: 9,
    parentId: null,
    title: '菜单',
    icon: 'BarsOutlined',
    component: 'RouteView',
    path: '/menu',
    redirect: '/menu/menu1',
    name: 'Menu',
    locale: 'menu.menu'
  },
  {
    id: 10,
    parentId: 9,
    title: '菜单1',
    component: '/menu/menu1',
    path: '/menu/menu1',
    name: 'MenuMenu11',
    keepAlive: true,
    locale: 'menu.menu.menu1'
  },
  {
    id: 11,
    parentId: 9,
    title: '菜单2',
    component: '/menu/menu2',
    path: '/menu/menu2',
    keepAlive: true,
    locale: 'menu.menu.menu2'
  },
  {
    id: 12,
    parentId: 9,
    path: '/menu/menu3',
    redirect: '/menu/menu3/menu1',
    title: '菜单1-1',
    component: 'RouteView',
    locale: 'menu.menu.menu3'
  },
  {
    id: 13,
    parentId: 12,
    path: '/menu/menu3/menu1',
    component: '/menu/menu-1-1/menu1',
    title: '菜单1-1-1',
    keepAlive: true,
    locale: 'menu.menu3.menu1'
  },
  {
    id: 14,
    parentId: 12,
    path: '/menu/menu3/menu2',
    component: '/menu/menu-1-1/menu2',
    title: '菜单1-1-2',
    keepAlive: true,
    locale: 'menu.menu3.menu2'
  },
  {
    id: 15,
    path: '/access',
    component: 'RouteView',
    redirect: '/access/common',
    title: '权限模块',
    name: 'Access',
    parentId: null,
    icon: 'ClusterOutlined',
    locale: 'menu.access'
  },
  {
    id: 16,
    parentId: 15,
    path: '/access/common',
    title: '通用权限',
    name: 'AccessCommon',
    component: '/access/common',
    locale: 'menu.access.common'
  },
  {
    id: 17,
    parentId: 15,
    path: '/access/user',
    title: '普通用户',
    name: 'AccessUser',
    component: '/access/user',
    locale: 'menu.access.user'
  },
  {
    id: 19,
    parentId: null,
    title: '异常页',
    icon: 'WarningOutlined',
    component: 'RouteView',
    redirect: '/exception/403',
    path: '/exception',
    name: 'Exception',
    locale: 'menu.exception'
  },
  {
    id: 20,
    parentId: 19,
    path: '/exception/403',
    title: '403',
    name: '403',
    component: '/exception/403',
    locale: 'menu.exception.not-permission'
  },
  {
    id: 21,
    parentId: 19,
    path: '/exception/404',
    title: '404',
    name: '404',
    component: '/exception/404',
    locale: 'menu.exception.not-find'
  },
  {
    id: 22,
    parentId: 19,
    path: '/exception/500',
    title: '500',
    name: '500',
    component: '/exception/500',
    locale: 'menu.exception.server-error'
  },
  {
    id: 23,
    parentId: null,
    title: '结果页',
    icon: 'CheckCircleOutlined',
    component: 'RouteView',
    redirect: '/result/success',
    path: '/result',
    name: 'Result',
    locale: 'menu.result'
  },
  {
    id: 24,
    parentId: 23,
    path: '/result/success',
    title: '成功页',
    name: 'ResultSuccess',
    component: '/result/success',
    locale: 'menu.result.success'
  },
  {
    id: 25,
    parentId: 23,
    path: '/result/fail',
    title: '失败页',
    name: 'ResultFail',
    component: '/result/fail',
    locale: 'menu.result.fail'
  },
  {
    id: 26,
    parentId: null,
    title: '列表页',
    icon: 'TableOutlined',
    component: 'RouteView',
    redirect: '/list/card-list',
    path: '/list',
    name: 'List',
    locale: 'menu.list'
  },
  {
    id: 27,
    parentId: 26,
    path: '/list/card-list',
    title: '卡片列表',
    name: 'ListCard',
    component: '/list/card-list',
    locale: 'menu.list.card-list'
  },
  {
    id: 28,
    parentId: null,
    title: '详情页',
    icon: 'ProfileOutlined',
    component: 'RouteView',
    redirect: '/profile/basic',
    path: '/profile',
    name: 'Profile',
    locale: 'menu.profile'
  },
  {
    id: 29,
    parentId: 28,
    path: '/profile/basic',
    title: '基础详情页',
    name: 'ProfileBasic',
    component: '/profile/basic/index',
    locale: 'menu.profile.basic'
  },
  {
    id: 30,
    parentId: 26,
    path: '/list/search-list',
    title: '搜索列表',
    name: 'SearchList',
    component: '/list/search-list',
    locale: 'menu.list.search-list'
  },
  {
    id: 31,
    parentId: 30,
    path: '/list/search-list/articles',
    title: '搜索列表（文章）',
    name: 'SearchListArticles',
    component: '/list/search-list/articles',
    locale: 'menu.list.search-list.articles'
  },
  {
    id: 32,
    parentId: 30,
    path: '/list/search-list/projects',
    title: '搜索列表（项目）',
    name: 'SearchListProjects',
    component: '/list/search-list/projects',
    locale: 'menu.list.search-list.projects'
  },
  {
    id: 33,
    parentId: 30,
    path: '/list/search-list/applications',
    title: '搜索列表（应用）',
    name: 'SearchListApplications',
    component: '/list/search-list/applications',
    locale: 'menu.list.search-list.applications'
  },
  {
    id: 34,
    parentId: 26,
    path: '/list/basic-list',
    title: '标准列表',
    name: 'BasicCard',
    component: '/list/basic-list',
    locale: 'menu.list.basic-list'
  },
  {
    id: 35,
    parentId: 28,
    path: '/profile/advanced',
    title: '高级详细页',
    name: 'ProfileAdvanced',
    component: '/profile/advanced/index',
    locale: 'menu.profile.advanced'
  },
  {
    id: 4,
    parentId: 3,
    title: '基础表单',
    component: '/form/basic-form/index',
    path: '/form/basic-form',
    name: 'FormBasic',
    keepAlive: false,
    locale: 'menu.form.basic-form'
  },
  {
    id: 36,
    parentId: null,
    title: '个人页',
    icon: 'UserOutlined',
    component: 'RouteView',
    redirect: '/account/center',
    path: '/account',
    name: 'Account',
    locale: 'menu.account'
  },
  {
    id: 37,
    parentId: 36,
    path: '/account/center',
    title: '个人中心',
    name: 'AccountCenter',
    component: '/account/center',
    locale: 'menu.account.center'
  },
  {
    id: 38,
    parentId: 36,
    path: '/account/settings',
    title: '个人设置',
    name: 'AccountSettings',
    component: '/account/settings',
    locale: 'menu.account.settings'
  },
  {
    id: 39,
    parentId: 3,
    title: '分步表单',
    component: '/form/step-form/index',
    path: '/form/step-form',
    name: 'FormStep',
    keepAlive: false,
    locale: 'menu.form.step-form'
  },
  {
    id: 40,
    parentId: 3,
    title: '高级表单',
    component: '/form/advanced-form/index',
    path: '/form/advanced-form',
    name: 'FormAdvanced',
    keepAlive: false,
    locale: 'menu.form.advanced-form'
  },
  {
    id: 41,
    parentId: 26,
    path: '/list/table-list',
    title: '查询表格',
    name: 'ConsultTable',
    component: '/list/table-list',
    locale: 'menu.list.consult-table'
  },
  {
    id: 42,
    parentId: 1,
    title: '监控页',
    component: '/dashboard/monitor',
    path: '/dashboard/monitor',
    name: 'DashboardMonitor',
    keepAlive: true,
    locale: 'menu.dashboard.monitor'
  },
  {
    id: 43,
    parentId: 1,
    title: '工作台',
    component: '/dashboard/workplace',
    path: '/dashboard/workplace',
    name: 'DashboardWorkplace',
    keepAlive: true,
    locale: 'menu.dashboard.workplace'
  },
  {
    id: 44,
    parentId: 26,
    path: '/list/crud-table',
    title: '增删改查表格',
    name: 'CrudTable',
    component: '/list/crud-table',
    locale: 'menu.list.crud-table'
  },
  {
    id: 45,
    parentId: 9,
    path: '/menu/menu4',
    redirect: '/menu/menu4/menu1',
    title: '菜单2-1',
    component: 'RouteView',
    locale: 'menu.menu.menu4'
  },
  {
    id: 46,
    parentId: 45,
    path: '/menu/menu4/menu1',
    component: '/menu/menu-2-1/menu1',
    title: '菜单2-1-1',
    keepAlive: true,
    locale: 'menu.menu4.menu1'
  },
  {
    id: 47,
    parentId: 45,
    path: '/menu/menu4/menu2',
    component: '/menu/menu-2-1/menu2',
    title: '菜单2-1-2',
    keepAlive: true,
    locale: 'menu.menu4.menu2'
  }
];

export const accessMenuData = [
  {
    id: 18,
    parentId: 15,
    path: '/access/admin',
    title: '管理员',
    name: 'AccessAdmin',
    component: '/access/admin',
    locale: 'menu.access.admin'
  }

];

export default eventHandler((event) => {
  const token = getHeader(event, 'Authorization');
  const username = Buffer.from(token as any, 'base64').toString('utf-8');
  return {
    code: 200,
    msg: '获取成功',
    data: [...menuData, ...(username === 'admin' ? accessMenuData : [])]
  };
});
