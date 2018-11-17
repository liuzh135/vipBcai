import React, { PureComponent } from 'react';
import { List, Badge } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import stylesArticles from '../../List/Articles.less';
import styles from './Articles.less';
import { digitUppercase } from '@/utils/utils';

@connect(({ accounthistory, login, loading }) => ({
  accounthistory,
  token: login,
  loading: loading.models.accounthistory,
}))
export default class ChargeHistory extends PureComponent {
  /**
   * 页面加载完成之后获取 充值列表
   */
  componentDidMount() {
    const { dispatch, token } = this.props;
    if (!token || !token.userToken) {
      window.g_app._store.dispatch({ type: 'login/logout' });
      return;
    }
    dispatch({
      type: 'accounthistory/fetch',
      payload: {
        token: token.userToken.token,
      },
    });
  }

  getChargeList = page => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'accounthistory/fetch',
      payload: {
        token: token.userToken.token,
        page: page,
        rows: 8,
      },
    });
  };

  render() {
    const { accounthistory, loading } = this.props;

    const list = accounthistory.data ? accounthistory.data.list : [];
    const pagination = (accounthistory.data ? accounthistory.data.pagination : {}) || {};
    const statusMap = ['default', 'processing', 'success', 'error'];
    const recharstatus = ['待充值', '已充值', '作废', '驳回'];
    const ListContent = ({
      data: {
        chargeStatus,
        username,
        chargeValue,
        managerPayAccountBank,
        managerPayAccountName,
        managerPayAccount,
        createTime,
      },
    }) => (
      <div className={stylesArticles.listContent}>
        <a className={stylesArticles.listItemMetaTitle}>
          <Badge status={statusMap[chargeStatus]} />
          {recharstatus[chargeStatus]}
        </a>

        <div className={stylesArticles.description}>{'用户帐号：' + username}</div>
        <div className={stylesArticles.description}>{'支付账号银行：' + managerPayAccountBank}</div>
        <div className={stylesArticles.description}>{'支付账号名称：' + managerPayAccountName}</div>
        <div className={stylesArticles.description}>{'支付卡号：' + managerPayAccount}</div>

        <div className={stylesArticles.extra}>
          {/*<Avatar src={avatar} size="small" />*/}
          <a>{username}</a>
          充值
          {/*<a >{digitUppercase(chargeValue)}</a>*/}
          <a className={styles.money}>{chargeValue}</a>
          <span className={styles.uppercase}>（{digitUppercase(chargeValue)}）</span>
          <em>{moment(createTime).format('YYYY-MM-DD HH:mm')}</em>
        </div>
      </div>
    );
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        loading={loading}
        pagination={{
          onChange: page => {
            this.getChargeList(page);
          },
          total: pagination.total,
          pageSize: 8,
        }}
        dataSource={list}
        renderItem={item => (
          <List.Item key={item.chargeId}>
            <ListContent data={item} />
          </List.Item>
        )}
      />
    );
  }
}
