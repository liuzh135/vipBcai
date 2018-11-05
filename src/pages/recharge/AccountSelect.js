import React, { PureComponent } from 'react';
import { Input, Select, Form } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

export default class AccountSelect extends PureComponent {
  state = {
    accountType: '1',
    listType: [],
  };
  //选择帐号
  handleSelectChange = value => {};

  //选择帐号类型
  handleTypeChange = value => {
    console.log(value);
    this.setState({
      accountType: value,
    });

    const typeList1 = [];
    const typeList2 = [];
    const typeList3 = [];
    const list = this.props.list;
    list &&
      list.map((item, index) => {
        if (item.userPayAccountType === '1') {
          typeList1.push(item);
        } else if (item.userPayAccountType === '2') {
          typeList2.push(item);
        } else if (item.userPayAccountType === '3') {
          typeList3.push(item);
        }
      });

    let payaccount;
    let typelist = {};
    if (value === 1) {
      typelist = typeList1[0];
    } else if (value === 2) {
      typelist = typeList2[0];
    } else if (value === 3) {
      typelist = typeList3[0];
    }

    payaccount = typelist && typelist.userPayAccount ? typelist.userPayAccount : '';

    payaccount != null &&
      this.props.form.setFieldsValue({
        receiverAccount: payaccount,
      });
  };

  getAccountList = value => {
    const { list } = this.props;
    const accountList = [];
    if (!list) return accountList;
    let i = 0;
    list &&
      list.map((item, index) => {
        if (item.userPayAccountType === value + '') {
          accountList.push(
            <Option key={i} value={item.userPayAccountId}>
              {item.userPayAccount}
            </Option>
          );
        }
      });

    return accountList;
  };

  render() {
    const { list, formItemLayout, getFieldDecorator, name } = this.props;
    const { accountType } = this.state;

    const accountlist = this.getAccountList(accountType) || [];

    return (
      <FormItem {...formItemLayout} label="收款帐号">
        <Input.Group compact>
          <Select defaultValue={1} style={{ width: '25%' }} onChange={this.handleTypeChange}>
            <Option value={1}>银行账户</Option>
            <Option value={2}>支付宝</Option>
            <Option value={3}>微信</Option>
          </Select>
          {getFieldDecorator(name, {
            rules: [{ required: true, message: '请选择提现帐号' }],
          })(
            <Select
              style={{ width: '75%' }}
              placeholder="请选择提现帐号"
              onChange={this.handleSelectChange}
            >
              {accountlist}
            </Select>
          )}
        </Input.Group>
      </FormItem>
    );
  }
}
