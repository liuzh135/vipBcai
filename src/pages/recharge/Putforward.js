/**
 * 提现页面
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { digitUppercase } from '@/utils/utils';
import { Button, Card, Form, Icon, Input, message, Modal, Radio } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';
import AccountSelect from './AccountSelect';
import router from 'umi/router';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const { TextArea } = Input;

const CreateForm = Form.create()(props => {
  const { visible, handleCancel } = props;

  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  const handleSubmit = e => {
    const { handleAdd, form } = props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      // console.log('---->' + JSON.stringify(values));
      if (err) return;
      const userPayAccountBankString =
        values.accountType === 2 ? '支付宝' : values.accountType === 3 ? '微信' : '网上银行';
      const parms = {
        userPayAccountName: values.accountName,
        userPayAccount: values.owner,
        userPayAccountType: values.accountType,
        userPayAccountBank: userPayAccountBankString,
      };
      handleAdd(parms);
    });
  };

  const modalFooter = { okText: '保存', onOk: handleSubmit, onCancel: handleCancel };

  const getModalContent = () => {
    const {
      form: { getFieldDecorator },
    } = props;

    return (
      <Form onSubmit={handleSubmit}>
        <FormItem label="收款人" {...formLayout}>
          {getFieldDecorator('accountName', {
            rules: [{ required: true, message: '请选择收款人' }],
          })(<Input placeholder="请输入收款人" />)}
        </FormItem>

        <FormItem label="收款方式" {...formLayout}>
          {getFieldDecorator('accountType', {
            rules: [{ required: true, message: '选择收款方式' }],
          })(
            <RadioGroup>
              <Radio value={1}>网上银行</Radio>
              <Radio value={2}>支付宝</Radio>
              <Radio value={3}>微信</Radio>
            </RadioGroup>
          )}
        </FormItem>

        <FormItem label="收款帐号" {...formLayout}>
          {getFieldDecorator('owner', {
            rules: [{ required: true, message: '请输入收款帐号' }],
          })(<Input placeholder="请输入收款帐号" />)}
        </FormItem>

        <FormItem {...formLayout} label="帐号备注">
          {getFieldDecorator('subDescription', {
            rules: [{ message: '请输入至少五个字符的备注！', min: 5 }],
          })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
        </FormItem>
      </Form>
    );
  };

  return (
    <Modal
      title={'添加收款帐号'}
      className={styles.standardListForm}
      width={640}
      bodyStyle={{ padding: '28px 28px' }}
      destroyOnClose
      visible={visible}
      {...modalFooter}
    >
      {getModalContent()}
    </Modal>
  );
});

@connect(({ loading, login, user }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  token: login.userToken,
  currentUser: user.currentUser,
  exchargeList: user.exchargeList,
}))
@Form.create()
export default class Putforward extends PureComponent {
  state = { visible: false };

  handleSubAdd = parms => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'user/addexchargeAccount',
      payload: {
        ...parms,
        token: token.token,
      },
      callback: response => {
        if (response.code !== 0) {
          message.error(response.msg ? response.msg : '添加失败');
        } else {
          dispatch({
            type: 'user/fetchexchargeList',
            payload: {
              token: token.token,
            },
          });
        }
        this.setState({
          visible: false,
        });
      },
    });
  };

  handleSubmitAccount = e => {
    const { dispatch, token, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'user/addExcharge',
        payload: {
          token: token.token,
          userPayAccountId: values.receiverAccount,
          exchangeValue: values.exchangeValue,
        },
        callback: response => {
          if (response.code !== 0) {
            message.error(response.msg ? response.msg : '提交失败');
          } else {
            //提现成功获取最新的积分
            dispatch({
              type: 'user/fetchCurrent',
              payload: {
                token: token.token,
              },
            });
            router.push('/excharge'); //跳转到提现审核列表
          }
        },
      });
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  //添加收款帐号
  add = () => {
    this.setState({
      visible: true,
    });
  };

  /**
   * 获取提现帐号
   * */
  componentDidMount() {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'user/fetchexchargeList',
      payload: {
        token: token.token,
      },
    });
  }

  onExchargeChange = excharge => {
    console.log('--excharge-->' + JSON.stringify(excharge));
  };

  render() {
    const { submitting, currentUser, exchargeList, form } = this.props;

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

    const accountJf = currentUser.integralValue || null;

    const { done, visible } = this.state;
    return (
      <PageHeaderWrapper
        title="提现"
        content="提现申请提交之后，系统管理员会在2个工作日内将钱款打到提现账户，请用户耐心等待。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmitAccount} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="可提现金额">
              <span className={styles.money}>{accountJf}</span>
              <span className={styles.uppercase}>（{digitUppercase(accountJf)}）</span>
            </FormItem>

            <AccountSelect
              form={form}
              formItemLayout={formItemLayout}
              getFieldDecorator={getFieldDecorator}
              list={exchargeList}
              name={'receiverAccount'}
              onChange={this.onExchargeChange}
            />

            {/*<FormItem {...formItemLayout} label="收款帐号">*/}
            {/*<Input.Group compact>*/}
            {/*<AccountSelect list={exchargeList} onChange={this.onExchargeChange}/>*/}
            {/*{getFieldDecorator('receiverAccount', {*/}
            {/*rules: [*/}
            {/*{ required: true},*/}
            {/*],*/}
            {/*})(*/}
            {/*<Input style={{ width: 'calc(100% - 100px)' }}/>*/}
            {/*)}*/}
            {/*</Input.Group>*/}
            {/*</FormItem>*/}

            <FormItem {...formItemLayout} label="添加收款帐号">
              <Button
                type="dashed"
                onClick={this.add}
                style={{ width: '100%', textAlign: 'center' }}
              >
                <Icon type="plus" /> Add
              </Button>
            </FormItem>

            <FormItem {...formItemLayout} label="提现金额">
              {getFieldDecorator('exchangeValue', {
                rules: [{ required: true, message: '选择提现金额' }],
              })(
                <RadioGroup>
                  <Radio value={100}>100</Radio>
                  <Radio value={200}>200</Radio>
                  <Radio value={500}>500</Radio>
                  <Radio value={1000}>1000</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: false,
                    message: '请输入提现详情',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入提现详情" rows={4} />)}
            </FormItem>

            {/*<Form.Item*/}
            {/*{...formItemLayout}*/}
            {/*label={*/}
            {/*<span>*/}
            {/*支付密码*/}
            {/*<em className={styles.optional}>*/}
            {/*（安全保护）*/}
            {/*<Tooltip title="用户登录密码">*/}
            {/*<Icon type="info-circle-o" style={{ marginRight: 4, marginLeft: 4 }} />*/}
            {/*</Tooltip>*/}
            {/*</em>*/}
            {/*</span>*/}
            {/*}*/}
            {/*>*/}
            {/*{getFieldDecorator('password', {*/}
            {/*rules: [*/}
            {/*{*/}
            {/*required: true,*/}
            {/*message: '需要支付密码才能进行支付',*/}
            {/*},*/}
            {/*],*/}
            {/*})(<Input type="password" autoComplete="off" style={{ width: '100%' }} />)}*/}
            {/*</Form.Item>*/}

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" block htmlType="submit" loading={submitting}>
                提交申请
              </Button>
            </FormItem>
          </Form>

          <CreateForm
            visible={visible}
            handleCancel={this.handleCancel}
            handleAdd={this.handleSubAdd}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
