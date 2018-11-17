import React, { PureComponent } from 'react';
import { List, Icon, Avatar, Tag, Badge } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import stylesArticles from '../../List/Articles.less';
import styles from './Articles.less';
import { digitUppercase } from '@/utils/utils';

@connect(({ accounthistory, login, loading }) => ({
  accounthistory,
  token: login.userToken,
  loading: loading.models.accounthistory,
}))
export default class ExchargeHistory extends PureComponent {
  /**
   * 页面加载完成之后获取 充值列表
   */
  componentDidMount() {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'accounthistory/fetchExcharge',
      payload: {
        token: token.token,
      },
    });
  }

  getChargeList = page => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'accounthistory/fetchExcharge',
      payload: {
        token: token.token,
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
    const recharstatus = ['待兑换', '已兑换', '作废', '驳回'];

    const ListContent = ({
      data: {
        exchangeNo,
        exchangeValue,
        userPayAccountBank,
        userPayAccount,
        userPayAccountName,
        exchangeStatus,
      },
    }) => (
      <div className={stylesArticles.listContent}>
        <div className={stylesArticles.description}>{'发卡行名称：' + userPayAccountBank}</div>
        <div className={stylesArticles.description}>{'卡号账号姓名：' + userPayAccountName}</div>
        <div className={stylesArticles.description}>{'支付卡号：' + userPayAccount}</div>
        <div className={stylesArticles.description}>{'流水号：' + exchangeNo}</div>
        <div className={stylesArticles.extra}>
          {/*<Avatar src={avatar} size="small" />*/}
          <Badge status={statusMap[exchangeStatus]} text={recharstatus[exchangeStatus]} />
          {/*<a >{digitUppercase(chargeValue)}</a>*/}
          <a className={styles.money}>{exchangeValue}</a>
          <span className={styles.uppercase}>（{digitUppercase(exchangeValue)}）</span>
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
          <List.Item key={item.exchangeNo}>
            <ListContent data={item} />
          </List.Item>
        )}
      />
    );
  }
}
