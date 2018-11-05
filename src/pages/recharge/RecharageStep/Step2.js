import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Alert, Divider } from 'antd';
import router from 'umi/router';
import { digitUppercase } from '@/utils/utils';
import styles from './style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class Step2 extends React.PureComponent {
  // componentDidMount() {
  //   const { data } = this.props;
  //   if (!data || !data.receiverAccount) {//帐号信息确认有问题
  //     router.push('/recharge/rechargePage/info');
  //   }
  // }

  render() {
    const { form, data, dispatch, submitting, token, bank } = this.props;
    const type = data.managerPayAccountBank ? data.managerPayAccountBank : 'null';
    const { getFieldDecorator, validateFields } = form;

    const onPrev = () => {
      router.push('/recharge/rechargePage/info');
    };

    const onValidateForm = e => {
      e.preventDefault();
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'rechargesteps/submitRechargeStepForm',
            payload: {
              chargeValue: data.amount,
              token: token.token,
              userManagerPayAccountId: bank.data.userManagerPayAccountId,
              chargeType: bank.data.managerPayAccountType,
              remarkCode: bank.data.remarkCode,
            },
          });
        }
      });
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message="确认转账后，资金将直接打入对方账户，无法退回。"
          style={{ marginBottom: 24 }}
        />
        {/*<Form.Item {...formItemLayout} className={styles.stepFormText} label="付款账户">*/}
        {/*{data.payAccount}*/}
        {/*</Form.Item>*/}
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款账户类型">
          {type}
        </Form.Item>

        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款账户">
          {data.receiverAccount}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="收款人姓名">
          {data.receiverName}
        </Form.Item>
        <Form.Item {...formItemLayout} className={styles.stepFormText} label="转账金额">
          <span className={styles.money}>{data.amount}</span>
          <span className={styles.uppercase}>（{digitUppercase(data.amount)}）</span>
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        {/*<Form.Item {...formItemLayout} label="支付密码">*/}
        {/*{getFieldDecorator('password', {*/}
        {/*initialValue: '123456',*/}
        {/*rules: [*/}
        {/*{*/}
        {/*required: true,*/}
        {/*message: '需要支付密码才能进行支付',*/}
        {/*},*/}
        {/*],*/}
        {/*})(<Input type="password" autoComplete="off" style={{ width: '80%' }} />)}*/}
        {/*</Form.Item>*/}
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
          label=""
        >
          <Button type="primary" onClick={onValidateForm} loading={submitting}>
            提交
          </Button>
          <Button onClick={onPrev} style={{ marginLeft: 8 }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default connect(({ rechargesteps, user, loading, login }) => ({
  submitting: loading.effects['rechargesteps/submitRechargeStepForm'],
  data: rechargesteps.step,
  bank: user.bank,
  token: login.userToken,
}))(Step2);
