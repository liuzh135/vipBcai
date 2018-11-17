import React, { Component } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import { getPageQuery } from '@/utils/utils';
import { Button, Card, Form, Icon, Input, message, Radio } from 'antd';
import styles from '../Forms/style.less';
import AccountSelect from '../recharge/AccountSelect';
import router from 'umi/router';
import * as routerRedux from 'react-router-redux';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

@Form.create()
class AddUserOrAgent extends Component {
  state = {
    type: '1',
  };

  // handleSubmit = (err, values) => {
  //   const { type } = this.state;
  //   if (!err) {
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'login/login',
  //       payload: {
  //         ...values,
  //         type,
  //       },
  //     });
  //   }
  // };

  componentDidMount() {
    const params = getPageQuery();
    this.setState({
      type: params.type,
    });
  }

  handleSubmitAccount = e => {
    const { dispatch, token, form, currentUser } = this.props;
    const { type: isAgent } = this.state;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'vip/add',
        payload: {
          username: values.username,
          realname: values.realname,
          password: values.password,
          isAgent: isAgent,
          invitedCode: currentUser.invitedCode,
          token: token.token,
        },
        callback: response => {
          if (response.code !== 0) {
            message.error(response.msg ? response.msg : '提交失败');
          } else {
            message.success('提交成功');
            this.props.dispatch(
              routerRedux.push({
                pathname: isAgent === '1' ? '/manager/agent' : '/manager/viplist',
              })
            );
          }
        },
      });
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('密码不一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const { submitting } = this.props;
    const { type } = this.state;

    return (
      <PageHeaderWrapper title={type === '1' ? '添加代理' : '添加会员'}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmitAccount} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="帐号">
              {getFieldDecorator('username', {
                rules: [
                  {
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator('realname', {
                rules: [
                  {
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: '请输入用户昵称',
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label="密码">
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="确认密码">
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认密码!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" block htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ login, loading, user }) => ({
  currentUser: user.currentUser,
  token: login.userToken,
  submitting: loading.effects['vip/add'],
}))(AddUserOrAgent);
