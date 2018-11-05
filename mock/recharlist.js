import { parse } from 'url';

//mock recharlist data
// mock tableListDataSource
let tableListDataSource = [];
// for (let i = 0; i < 46; i += 1) {
//   tableListDataSource.push({
//     key: i,
//     disabled: i % 6 === 0,
//     href: 'https://ant.design',
//     avatar: [
//       'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
//       'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
//     ][i % 2],
//     name: `TradeCode ${i}`,
//     title: `一个任务名称 ${i}`,
//     owner: '曲丽丽',
//     desc: '这是一段描述',
//     callNo: Math.floor(Math.random() * 1000),
//     status: Math.floor(Math.random() * 10) % 4,
//     updatedAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
//     createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
//     progress: Math.ceil(Math.random() * 100),
//   });
// }

for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    key: i,
    // disabled: i % 6 === 0,
    // href: 'https://ant.design',
    avatar: [
      'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
      'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
    ][i % 2],
    username: `liuzh ${i}`,
    chargeId: i,
    chargeValue: Math.ceil(Math.random() * 100),
    chargeType: Math.floor(Math.random() * 10) % 3,
    remarkCode: Math.floor(Math.random() * 1000),
    chargeNo: Math.floor(Math.random() * 1000),
    chargeStatus: Math.floor(Math.random() * 10) % 4,
    managerPayAccountType: Math.floor(Math.random() * 10) % 3,
    createdAt: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    managerPayAccountName: `zhangli`,
    managerPayAccount: `zhangli`,
  });
}

function getRecharList(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = parse(url, true).query;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }
  //帐号类型 筛选
  if (params.managerPayAccountType) {
    const managerPayAccountType = params.managerPayAccountType.split(',');
    let filterDataSource = [];
    managerPayAccountType.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(
          data => parseInt(data.managerPayAccountType + 1, 10) === parseInt(s[0], 10)
        )
      );
    });
    dataSource = filterDataSource;
  }
  //转账状态 筛选
  if (params.chargeStatus) {
    const chargeStatus = params.chargeStatus.split(',');
    let filterDataSource = [];
    chargeStatus.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.chargeStatus, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  //转账类型 筛选
  if (params.chargeType) {
    const chargeType = params.chargeType.split(',');
    let filterDataSource = [];
    chargeType.forEach(s => {
      filterDataSource = filterDataSource.concat(
        dataSource.filter(data => parseInt(data.chargeType + 1, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }
  //转账帐号赛选
  if (params.username) {
    dataSource = dataSource.filter(data => data.username.indexOf(params.username) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  return res.json(result);
}

function postRecharList(req, res, u, b) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key, chargeStatus } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
      break;
    case 'post':
      const i = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        key: i,
        href: 'https://ant.design',
        avatar: [
          'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
          'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        ][i % 2],
        name: `TradeCode ${i}`,
        title: `一个任务名称 ${i}`,
        owner: '曲丽丽',
        desc,
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 2,
        updatedAt: new Date(),
        createdAt: new Date(),
        progress: Math.ceil(Math.random() * 100),
      });
      break;
    case 'update':
      tableListDataSource = tableListDataSource.map(item => {
        if (item.key === key) {
          Object.assign(item, { chargeStatus });
          return item;
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/getrechar': getRecharList,
  'POST /api/getrechar': postRecharList,
};
