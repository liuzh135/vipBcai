export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  {
    path: '/index',
    component: '../layouts/BasicBocaiIndexLayout',
    routes: [
      { path: '/index', redirect: '/index/competition' },
      {
        path: '/index/competition',
        name: 'competition',
        component: './Index',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // user info
      { path: '/', redirect: '/account/usercenter' },

      {
        path: '/account/usercenter',
        name: 'usercenter',
        icon: 'home',
        component: './Account/Center/Center',
        routes: [
          {
            path: '/account/usercenter',
            redirect: '/account/usercenter/chargeHistory',
          },
          {
            path: '/account/usercenter/chargeHistory',
            component: './Account/Center/ChargeHistory',
          },
          {
            path: '/account/usercenter/exchargeHistory',
            component: './Account/Center/ExchargeHistory',
          },
          {
            path: '/account/usercenter/accountList',
            component: './Account/Center/AccountList',
          },
        ],
      },
      {
        path: '/charge',
        name: 'charge',
        icon: 'star',
        authority: ['admin', 'agent'],
        routes: [
          {
            path: '/charge',
            redirect: '/charge/recharge',
          },
          {
            path: '/charge/recharge',
            name: 'recharge',
            component: './UserCenter/UserCenterInfo',
          },
          {
            path: '/charge/excharge',
            name: 'excharge',
            component: './Excharge/exchargeList',
          },
        ],
      },
      {
        //充值提现
        name: 'recharge',
        icon: 'pay-circle',
        path: '/recharge',
        hideInMenu: false,
        routes: [
          {
            path: '/recharge/rechargePage',
            name: 'recharge',
            component: './recharge/RecharageStep',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/recharge/rechargePage',
                name: 'recharge',
                redirect: '/recharge/rechargePage/info',
              },
              {
                path: '/recharge/rechargePage/info',
                name: 'info',
                component: './recharge/RecharageStep/Step1',
              },
              {
                path: '/recharge/rechargePage/confirm',
                name: 'confirm',
                component: './recharge/RecharageStep/Step2',
              },
              {
                path: '/recharge/rechargePage/result',
                name: 'result',
                component: './recharge/RecharageStep/Step3',
              },
            ],
          },
          {
            path: '/recharge/putforward',
            name: 'putforward',
            component: './recharge/Putforward',
          },
        ],
      },
      {
        path: '/manager',
        name: 'accountmanager',
        icon: 'user',
        authority: ['admin', 'agent'],
        routes: [
          {
            path: '/manager/agent',
            name: 'agent',
            component: './AccountManager/AgentList',
          },
          {
            path: '/manager/viplist',
            name: 'viplist',
            component: './AccountManager/VipList',
          },
          {
            path: '/manager/deleteagent',
            name: 'deleteagent',
            component: './AccountManager/DeleteAgentList',
          },
          {
            path: '/manager/deletevip',
            name: 'deletevip',
            component: './AccountManager/DeleteVipList',
          },
          {
            name: 'adduseroragent',
            path: '/manager/adduseroragent',
            hideInMenu: true,
            component: './AccountManager/AddUserOrAgent',
          },
        ],
      },
      {
        path: '/report',
        name: 'report',
        icon: 'bar-chart',
        routes: [
          {
            path: '/report/agent',
            name: 'agent',
            component: './ReportManager/AgentDayReport',
          },
          {
            path: '/report/vipReport',
            name: 'vip',
            component: './ReportManager/VipDayReport',
          },
          {
            path: '/report/recharge',
            name: 'recharge',
            component: './ReportManager/RechargeReport',
          },
          {
            path: '/report/online',
            name: 'onlineUser',
            component: './ReportManager/OnlineAccount',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/chargeHistory',
              },
              {
                path: '/account/center/chargeHistory',
                component: './Account/Center/ChargeHistory',
              },
              {
                path: '/account/center/exchargeHistory',
                component: './Account/Center/ExchargeHistory',
              },
              {
                path: '/account/center/accountList',
                component: './Account/Center/AccountList',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
