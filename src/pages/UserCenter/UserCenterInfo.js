import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Badge, Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../List/TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['银行', '支付宝', '微信'];
const recharstatus = ['待充值', '已充值', '作废', '驳回'];

/***
 * 充值审核列表
 */
/* eslint react/no-multi-comp:0 */
@connect(({ recharlist, login, loading }) => ({
  recharlist,
  token: login,
  loading: loading.models.recharlist,
}))
@Form.create()
export default class UserCenterInfo extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '用户账号',
      dataIndex: 'username',
    },
    {
      title: '充值金额',
      dataIndex: 'chargeValue',
      // sorter: true,
      align: 'right',
      render: val => `${val} 元`,
      // mark to display a total number
      needTotal: true,
    },
    {
      title: '转账类型',
      dataIndex: 'chargeType',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '备注码',
      dataIndex: 'remarkCode',
    },
    {
      title: '充值状态',
      dataIndex: 'chargeStatus',
      filters: [
        {
          text: recharstatus[0],
          value: 0,
        },
        {
          text: recharstatus[1],
          value: 1,
        },
        {
          text: recharstatus[2],
          value: 2,
        },
        {
          text: recharstatus[3],
          value: 3,
        },
      ],
      filterMultiple: false,
      render(val) {
        return <Badge status={statusMap[val]} text={recharstatus[val]} />;
      },
    },

    {
      title: '管理员支付账号银行',
      align: 'center',
      dataIndex: 'managerPayAccountBank',
    },
    {
      title: '管理员支付账号名称',
      align: 'center',
      dataIndex: 'managerPayAccountName',
    },
    {
      title: '账号类型',
      dataIndex: 'managerPayAccountType',
      render(val) {
        return <Badge status={statusMap[val - 1]} text={status[val - 1]} />;
      },
    },
    {
      title: '管理员账号',
      dataIndex: 'managerPayAccount',
    },
    {
      title: '充值时间',
      dataIndex: 'createTime',
      // sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.passAndDelete('pass', record)}>通过</a>
          <Divider type="vertical" />
          <a onClick={() => this.passAndDelete('bohui', record)}>驳回</a>
        </Fragment>
      ),
    },
  ];

  /**
   * 页面加载完成之后获取 充值列表
   */
  componentDidMount() {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'recharlist/fetch',
      payload: {
        token: token.userToken.token,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      rows: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    const token = this.props.token.userToken.token;
    dispatch({
      type: 'recharlist/fetch',
      payload: { ...params, token },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const token = this.props.token.userToken.token;
    dispatch({
      type: 'recharlist/fetch',
      payload: { token },
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'recharlist/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      const token = this.props.token.userToken.token;
      // console.log('----values-->' + JSON.stringify(values));
      dispatch({
        type: 'recharlist/fetch',
        payload: { ...values, token },
      });
    });
  };

  handleUpdate = (fields, id) => {
    const { dispatch } = this.props;
    const token = this.props.token.userToken.token;
    const updateRecharge = {
      type: 'recharlist/update',
      callback: response => {
        if (response && response.code === 0) {
          message.success('审核通过');
        } else {
          message.error(response && response.msg ? response.msg : '审核失败');
        }
      },
    };

    const rejectRecharge = {
      type: 'recharlist/reject',
      callback: response => {
        if (response && response.code === 0) {
          message.success('驳回成功');
        } else {
          message.error(response && response.msg ? response.msg : '驳回失败');
        }
      },
    };

    const params = id === 1 ? updateRecharge : rejectRecharge;

    dispatch({
      payload: {
        chargeStatus: id,
        chargeId: fields.chargeId,
        token,
      },
      ...params,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const menuOption = [];
    recharstatus.map((data, index) => {
      menuOption.push(
        <Option key={index} value={index}>
          {data}
        </Option>
      );
    });

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="充值帐号">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="充值状态">
              {getFieldDecorator('chargeStatus')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {menuOption}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  passAndDelete = (key, currentItem) => {
    if (currentItem.chargeStatus === 1) {
      message.error('充值申请已处理，如有疑问，请联系系统管理员。');
      return;
    }
    if (currentItem.chargeStatus === 0) {
      if (key === 'pass') {
        Modal.confirm({
          title: '充值申请通过',
          content: '确定充值申请审核通过吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.handleUpdate(currentItem, 1),
        });
      } else if (key === 'bohui') {
        Modal.confirm({
          title: '充值申请驳回',
          content: '确定充值申请审核驳回吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.handleUpdate(currentItem, 3),
        });
      }
    } else {
      message.warn('该申请已过期，如有疑问，请联系系统管理员。');
    }
  };

  //表格行 key 的取值，可以是字符串或一个函数
  handleReKey = record => {
    return record.chargeId;
  };

  render() {
    const {
      recharlist: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper title="充值列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {/*<div className={styles.tableListOperator}>*/}
            {/*{selectedRows.length > 0 && (*/}
            {/*<span>*/}
            {/*<Button>批量操作</Button>*/}
            {/*<Dropdown overlay={menu}>*/}
            {/*<Button>*/}
            {/*更多操作 <Icon type="down"/>*/}
            {/*</Button>*/}
            {/*</Dropdown>*/}
            {/*</span>*/}
            {/*)}*/}
            {/*</div>*/}
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey={this.handleReKey}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
