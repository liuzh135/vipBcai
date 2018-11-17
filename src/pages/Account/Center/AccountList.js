import React, { PureComponent } from 'react';
import { List, Icon, Modal, message, Card, Button, Form, Input, Radio } from 'antd';
import { connect } from 'dva';
import stylesArticles from '../../List/Articles.less';
import { digitUppercase } from '@/utils/utils';
import stylesProjects from '../../List/Projects.less';
import styles from '../../List/CardList.less';
import Ellipsis from '@/components/Ellipsis';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import weixin from '../../../assets/weixin.jpg';
import zhifubao from '../../../assets/zhifubao.png';
import bank from '../../../assets/bank1.png';

const confirm = Modal.confirm;

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

@connect(({ accounthistory, login, loading }) => ({
  accounthistory,
  token: login,
  loading: loading.models.accounthistory,
}))
export default class AccountList extends PureComponent {
  state = { visible: false };

  /**
   * 确认添加提现帐号
   * @param parms
   */
  handleSubAdd = parms => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'user/addexchargeAccount',
      payload: {
        ...parms,
        token: token.userToken.token,
      },
      callback: response => {
        if (response.code !== 0) {
          message.error(response.msg ? response.msg : '添加失败');
        } else {
          dispatch({
            type: 'accounthistory/fetchCardList',
            payload: {
              token: token.userToken.token,
            },
          });
        }
        this.setState({
          visible: false,
        });
      },
    });
  };

  /**
   * 页面加载完成之后获取 卡片列表
   */
  componentDidMount() {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'accounthistory/fetchCardList',
      payload: {
        token: token.userToken.token,
      },
    });
  }

  /**
   * 获取提现帐号
   * @param page
   */
  getChargeList = page => {
    const { dispatch, token } = this.props;
    dispatch({
      type: 'accounthistory/fetchCardList',
      payload: {
        token: token.userToken.token,
        page: page,
        rows: 8,
      },
    });
  };

  /**
   * 删除提现帐号
   * @param userPayAccountId
   */
  deleteCard = userPayAccountId => {
    const { dispatch, token } = this.props;
    let _this = this;
    dispatch({
      type: 'accounthistory/deleteCard',
      payload: {
        token: token.userToken.token,
        userPayAccountId: userPayAccountId,
      },
      callback: response => {
        //删除成功
        if (response && response.code === 0) {
          _this.getChargeList(1);
        } else {
          message.error(response && response.msg ? response.msg : '删除失败');
        }
      },
    });
  };

  /**
   * 确认删除提现帐号
   * @param userPayAccountId
   * @param userPayAccountBank
   * @param userPayAccount
   */
  showPropsConfirm(userPayAccountId, userPayAccountBank, userPayAccount) {
    let _this = this;
    confirm({
      title: '温馨提示',
      content: <span>{'确认删除  ' + userPayAccountBank + ':' + userPayAccount + '  帐号'}</span>,
      okText: 'Yes',
      okType: 'danger',
      okButtonProps: {},
      cancelText: 'No',
      onOk() {
        _this.deleteCard(userPayAccountId);
      },
      onCancel() {},
    });
  }

  //取消
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
    const { accounthistory, loading } = this.props;

    const { visible } = this.state;

    const accountType = [bank, zhifubao, weixin];

    const list = accounthistory.data ? accounthistory.data.datas || [] : [];
    const ListContent = ({
      data: {
        userPayAccountId,
        userPayAccountBank,
        userPayAccount,
        userPayAccountName,
        userPayAccountType,
      },
    }) => (
      <Card
        hoverable
        className={styles.card}
        extra={
          <a
            onClick={() => {
              this.showPropsConfirm(userPayAccountId, userPayAccountBank, userPayAccount);
            }}
          >
            <Icon type="close" theme="outlined" />
          </a>
        }
      >
        <Card.Meta
          avatar={
            <img alt="" className={styles.cardAvatar} src={accountType[userPayAccountType - 1]} />
          }
          title={<a>{userPayAccountBank}</a>}
          description={
            <div>
              <div className={stylesArticles.userpayName}>{userPayAccountName}</div>
              <Ellipsis className={styles.item + ' ' + stylesArticles.userPayAccount} lines={3}>
                {userPayAccount}
              </Ellipsis>
            </div>
          }
        />
      </Card>
    );
    return (
      <GridContent>
        <List
          size="large"
          rowKey="id"
          className={stylesProjects.coverCardList}
          grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={['', ...list]}
          renderItem={item =>
            item ? (
              <List.Item key={item.userPayAccountId}>
                <ListContent data={item} />
              </List.Item>
            ) : (
              <List.Item>
                <Button type="dashed" className={styles.newButton} onClick={this.add}>
                  <Icon type="plus" /> 新增提现帐号
                </Button>
              </List.Item>
            )
          }
        />

        <CreateForm
          visible={visible}
          handleCancel={this.handleCancel}
          handleAdd={this.handleSubAdd}
        />
      </GridContent>
    );
  }
}
