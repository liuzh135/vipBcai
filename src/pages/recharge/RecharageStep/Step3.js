import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ rechargesteps }) => ({
  data: rechargesteps.step,
}))
export default class Step3 extends React.PureComponent {
  render() {
    const { data } = this.props;
    const onFinish = () => {
      router.push('/recharge/rechargePage/info');
    };

    const onList = () => {
      router.push('/usercenter');
    };

    const information = (
      <div className={styles.information}>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            收款账户：
          </Col>
          <Col xs={24} sm={16}>
            {data.receiverAccount}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            收款人姓名：
          </Col>
          <Col xs={24} sm={16}>
            {data.receiverName}
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={8} className={styles.label}>
            转账金额：
          </Col>
          <Col xs={24} sm={16}>
            <span className={styles.money}>{data.amount}</span> 元
          </Col>
        </Row>
      </div>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={onFinish}>
          再转一笔
        </Button>
        <Button onClick={onList}>查看账单</Button>
      </Fragment>
    );
    return (
      <Result
        type="success"
        title="充值申请成功"
        description="系统管理员会在2个工作日内审核完成"
        extra={information}
        actions={actions}
        className={styles.result}
      />
    );
  }
}
