import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Select, Divider } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ rechargesteps, user, login }) => {
  return {
    data: rechargesteps.step,
    bank: user.bank,
    token: login.userToken,
  };
})
@Form.create()
export default class Step1 extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    const { bank } = this.props;
    const banknew = nextProps.bank || {};
    if (!bank && !banknew) return;
    if (
      (banknew.data && !bank.data) ||
      (banknew.data && bank.data && banknew.data.managerPayAccount !== bank.data.managerPayAccount)
    ) {
      banknew &&
        banknew.data &&
        this.props.form.setFields({
          receiverAccount: {
            value: banknew.data.managerPayAccount,
          },
          receiverName: {
            value: banknew.data.managerPayAccountName,
          },
        });
    }
  }

  componentDidMount() {
    const { bank } = this.props;
    bank &&
      bank.data &&
      bank.data.managerPayAccount &&
      this.props.form.setFields({
        receiverAccount: {
          value: bank.data.managerPayAccount,
        },
        receiverName: {
          value: bank.data.managerPayAccountName,
        },
      });
  }

  selectChange = value => {
    const { bank } = this.props;
    bank && bank.data && this.fetchBank(value);
  };

  /**
   * 获取管理员卡号
   * */
  fetchBank = type => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'user/fetchbank',
      payload: {
        token: token.token,
        type: type, //默认网银转账
      },
    });
  };

  render() {
    const { form, dispatch, data, bank } = this.props;

    const { getFieldDecorator, validateFields } = form;
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'rechargesteps/getStepData',
            payload: {
              ...values,
              managerPayAccountBank: bank.data ? bank.data.managerPayAccountBank : '',
            },
          });
          router.push('/recharge/rechargePage/confirm');
        }
      });
    };
    const type = bank && bank.data ? bank.data.managerPayAccountType : 1;
    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} style={{margin:'40px auto 0'}} hideRequiredMark>
          {/*<Form.Item {...formItemLayout} label="付款账户">*/}
          {/*{getFieldDecorator('payAccount', {*/}
          {/*initialValue: data.payAccount,*/}
          {/*rules: [{ required: true, message: '请选择付款账户' }],*/}
          {/*})(*/}
          {/*(<Input />)*/}
          {/*)}*/}
          {/*</Form.Item>*/}
          <Form.Item {...formItemLayout} label="收款账户">
            <Input.Group compact>
              <Select defaultValue={type + ''} style={{ width: 100 }} onChange={this.selectChange}>
                <Option value="1">银行账户</Option>
                <Option value="2">支付宝</Option>
                <Option value="3">微信</Option>
              </Select>
              {getFieldDecorator('receiverAccount', {
                // initialValue: data.receiverAccount,
                rules: [{ required: true, message: '请输入收款人账户' }],
              })(<Input disabled style={{ width: 'calc(100% - 100px)' }} />)}
            </Input.Group>
          </Form.Item>
          <Form.Item {...formItemLayout} label="收款人姓名">
            {getFieldDecorator('receiverName', {
              // initialValue: data.receiverName,
              rules: [{ required: true, message: '请输入收款人姓名' }],
            })(<Input disabled placeholder="请输入收款人姓名" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="转账金额">
            {getFieldDecorator('amount', {
              initialValue: data.amount,
              rules: [
                { required: true, message: '请输入转账金额' },
                {
                  pattern: /^(\d+)((?:\.\d+)?)$/,
                  message: '请输入合法金额数字',
                },
              ],
            })(<Input prefix="￥" placeholder="请输入金额" />)}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
            label=""
          >
            <Button type="primary" onClick={onValidateForm}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>说明</h3>
          <h4>转账账户</h4>
          <p>
            支持任意形式的转账，包括银行、支付宝、和微信转账。线下转账，本系统提交转账充值申请即可。工作人员会在2个工作日内审核完成。
          </p>
          <h4>转账信息</h4>
          <p>
            转账信息的收款账户是系统随机选取的管理员收款帐号，用户确认好线下打款的帐号是否正确，否则可能会导致审核不通过！
          </p>
        </div>
      </Fragment>
    );
  }
}
