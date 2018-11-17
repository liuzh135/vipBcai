import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Badge, Button, Card, Col, Form, Input, Row, Select } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from '../List/TableList.less';
import { routerRedux } from 'dva/router';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const lockStutas = ['正常', '锁定'];
const statusMap = ['success', 'error'];
/***
 * 会员帐号管理列表
 */
/* eslint react/no-multi-comp:0 */
@connect(({ vip, login, loading, user }) => ({
  vip,
  currentUser: user.currentUser,
  token: login.userToken,
  loading: loading.models.vip,
}))
@Form.create()
export default class VipList extends PureComponent {
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
      title: '用户昵称',
      dataIndex: 'realname',
    },
    {
      title: '帐号状态',
      dataIndex: 'locked',
      filters: [
        {
          text: lockStutas[0],
          value: 0,
        },
        {
          text: lockStutas[1],
          value: 1,
        },
      ],
      filterMultiple: false,
      render(val) {
        return <Badge status={statusMap[val]} text={lockStutas[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
  ];

  /**
   * 页面加载完成之后获取 充值列表
   */
  componentDidMount() {
    const { dispatch, token, currentUser } = this.props;
    dispatch({
      type: 'vip/fetch',
      payload: {
        token: token.token,
        username: currentUser.username,
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
    const token = this.props.token.token;
    dispatch({
      type: 'vip/fetch',
      payload: { ...params, token },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const token = this.props.token.token;
    dispatch({
      type: 'vip/fetch',
      payload: { token },
    });
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

      const token = this.props.token.token;
      dispatch({
        type: 'vip/fetch',
        payload: { ...values, token },
      });
    });
  };

  /**
   * 添加会员
   */
  handleAddUser = e => {
    e.preventDefault();
    this.props.dispatch(
      routerRedux.push({
        pathname: '/manager/adduseroragent',
        query: { type: 2 },
      })
    );
  };

  /**
   * 查询
   * @returns {*}
   */
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const menuOption = [];
    lockStutas.map((data, index) => {
      menuOption.push(
        <Option key={index} value={index}>
          {data}
        </Option>
      );
    });
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem label="会员帐号">*/}
              {/*{getFieldDecorator('username')(<Input placeholder="请输入" />)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          {/*<Col md={8} sm={24}>*/}
            {/*<FormItem label="帐号状态">*/}
              {/*{getFieldDecorator('locked')(*/}
                {/*<Select placeholder="请选择" style={{ width: '100%' }}>*/}
                  {/*{menuOption}*/}
                {/*</Select>*/}
              {/*)}*/}
            {/*</FormItem>*/}
          {/*</Col>*/}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              {/*<Button type="primary" htmlType="submit">*/}
                {/*查询*/}
              {/*</Button>*/}
              {/*<Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>*/}
                {/*重置*/}
              {/*</Button>*/}

              <Button type="primary"  style={{ marginLeft: 30 }} onClick={this.handleAddUser}>
                添加会员
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  //表格行 key 的取值，可以是字符串或一个函数
  handleReKey = record => {
    return record.username;
  };

  render() {
    const {
      vip: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;
    return (
      <PageHeaderWrapper title="会员管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
