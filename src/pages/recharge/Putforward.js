/**
 * 提现页面
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Modal,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Forms/style.less';
import moment from 'moment';
import Result from '@/components/Result';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading, form }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  data: form.step,
}))
@Form.create()
export default class Putforward extends PureComponent {
  state = { visible: false, done: false };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      this.setState({
        done: true,
      });
      dispatch({
        type: 'form/submitRegularForm',
        payload: values,
      });
    });
  };

  handleDone = () => {
    this.setState({
      done: false,
      visible: false,
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

  render() {
    const { submitting, data } = this.props;
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

    const { visible, done } = this.state;

    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: '保存', onOk: this.handleSubmit, onCancel: this.handleCancel };

    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="一系列的信息描述，很短同样也可以带标点。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="收款人" {...this.formLayout}>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: '请选择收款人' }],
            })(<Input placeholder="请输入收款人" />)}
          </FormItem>

          <FormItem label="收款方式" {...this.formLayout}>
            {getFieldDecorator('fangshi', {
              rules: [{ required: true, message: '选择收款方式' }],
            })(
              <RadioGroup>
                <Radio value="weixin">微信</Radio>
                <Radio value="zhifubao">支付宝</Radio>
                <Radio value="wbank">网上银行</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem label="收款帐号" {...this.formLayout}>
            {getFieldDecorator('owner', {
              rules: [{ required: true, message: '请输入收款帐号' }],
            })(<Input placeholder="请输入收款帐号" />)}
          </FormItem>

          <FormItem {...this.formLayout} label="帐号备注">
            {getFieldDecorator('subDescription', {
              rules: [{ message: '请输入至少五个字符的备注！', min: 5 }],
            })(<TextArea rows={4} placeholder="请输入至少五个字符" />)}
          </FormItem>
        </Form>
      );
    };

    return (
      <PageHeaderWrapper
        title="提现"
        content="提现申请提交之后，系统管理员会在2个工作日内将钱款打到提现账户，请用户耐心等待。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="可提现金额">
              <span className="ant-form-text">200</span>
            </FormItem>

            <FormItem {...formItemLayout} label="收款帐号">
              <Input.Group compact>
                <Select defaultValue="alipay" style={{ width: 100 }}>
                  <Option value="alipay">支付宝</Option>
                  <Option value="weixin">微信</Option>
                  <Option value="bank">银行账户</Option>
                </Select>
                {getFieldDecorator('receiverAccount', {
                  initialValue: data.receiverAccount,
                  rules: [
                    { required: true, message: '请输入收款人账户' },
                    { type: 'email', message: '账户名应为邮箱格式' },
                  ],
                })(
                  <Input style={{ width: 'calc(100% - 100px)' }} placeholder="test@example.com" />
                )}
              </Input.Group>
            </FormItem>

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
              {getFieldDecorator('jinr', {
                rules: [{ required: true, message: '选择提现金额' }],
              })(
                <RadioGroup>
                  <Radio value="a">100</Radio>
                  <Radio value="b">200</Radio>
                  <Radio value="c">500</Radio>
                  <Radio value="d">1000</Radio>
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

            <Form.Item
              {...formItemLayout}
              label={
                <span>
                  支付密码
                  <em className={styles.optional}>
                    （安全保护）
                    <Tooltip title="用户登录密码">
                      <Icon type="info-circle-o" style={{ marginRight: 4, marginLeft: 4 }} />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '需要支付密码才能进行支付',
                  },
                ],
              })(<Input type="password" autoComplete="off" style={{ width: '100%' }} />)}
            </Form.Item>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" block htmlType="submit" loading={submitting}>
                提交申请
              </Button>
            </FormItem>
          </Form>

          <Modal
            title={done ? null : '添加收款帐号'}
            className={styles.standardListForm}
            width={640}
            bodyStyle={done ? { padding: '72px 0' } : { padding: '28px 28px' }}
            destroyOnClose
            visible={visible}
            {...modalFooter}
          >
            {getModalContent()}
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
