import React, { PureComponent, Fragment } from 'react';
import { Card, Steps } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../../Forms/style.less';
import { connect } from 'dva';

// import { Route, Redirect, Switch } from 'dva/router';
// import { getRoutes } from '@/utils/utils';

const { Step } = Steps;

class RechargeStepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'result':
        return 2;
      default:
        return 0;
    }
  }

  componentDidMount() {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'user/fetchbank',
      payload: {
        token: token.token,
        type: 1, //默认网银转账
      },
    });
  }

  render() {
    const { location, children, currentUser, bank } = this.props;
    return (
      <PageHeaderWrapper
        title="转账充值"
        tabActiveKey={location.pathname}
        content="转账充值成功，系统管理人员会在2个工作日内审核。审核通过之后会把对应的积分充值到用户帐号内。"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="填写转账信息" />
              <Step title="确认转账信息" />
              <Step title="完成" />
            </Steps>
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, login }) => ({
  currentUser: user.currentUser,
  bank: user.bank,
  token: login.userToken,
}))(RechargeStepForm);
