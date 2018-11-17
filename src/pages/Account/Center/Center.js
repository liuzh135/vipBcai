import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import router from 'umi/router';
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input, Button } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Center.less';

@connect(({ loading, user, project }) => ({
  listLoading: loading.effects['list/fetch'],
  currentUser: user.currentUser,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  project,
  projectLoading: loading.effects['project/fetchNotice'],
}))
export default class Center extends PureComponent {
  state = {
    newTags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {}

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'chargeHistory':
        router.push(`${match.url}/chargeHistory`);
        break;
      case 'exchargeHistory':
        router.push(`${match.url}/exchargeHistory`);
        break;
      case 'accountList':
        router.push(`${match.url}/accountList`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { state } = this;
    const { inputValue } = state;
    let { newTags } = state;
    if (inputValue && newTags.filter(tag => tag.label === inputValue).length === 0) {
      newTags = [...newTags, { key: `new-${newTags.length}`, label: inputValue }];
    }
    this.setState({
      newTags,
      inputVisible: false,
      inputValue: '',
    });
  };

  onRecharge = () => {};

  onPutForward = () => {};

  render() {
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      project: { notice },
      projectLoading,
      match,
      location,
      children,
    } = this.props;

    const operationTabList = [
      {
        key: 'chargeHistory',
        tab: <span>充值记录</span>,
      },
      {
        key: 'exchargeHistory',
        tab: <span>提现记录</span>,
      },
      {
        key: 'accountList',
        tab: <span>提现卡片</span>,
      },
    ];

    return (
      <PageHeaderWrapper title="个人中心">
        <GridContent className={styles.userCenter}>
          <Row gutter={24}>
            <Col lg={7} md={24}>
              <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
                {currentUser && Object.keys(currentUser).length ? (
                  <div>
                    <div className={styles.logouser} key="logouser" id="logouser">
                      <div className={styles.avatarHolder}>
                        <img
                          alt=""
                          src={
                            currentUser.avatar
                              ? currentUser.avatar
                              : 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
                          }
                        />
                        <div className={styles.name}>{currentUser.realname}</div>
                        <div className={styles.name}>{'当前积分:' + currentUser.integralValue}</div>
                        <div className={styles.name}>{'邀请码:' + currentUser.inviteCode}</div>
                      </div>
                      {/*<div className={styles.detail} style={{textAlign:'center'}}>*/}
                      {/*<Button type="primary" onClick={this.onRecharge} style={{ backgroundColor: '#ff6162' }}>*/}
                      {/*充值*/}
                      {/*</Button>*/}
                      {/*<Button type="primary" onClick={this.onPutForward} style={{ marginLeft: '20px' }}>*/}
                      {/*提现*/}
                      {/*</Button>*/}
                      {/*</div>*/}
                    </div>
                    <Divider dashed />
                  </div>
                ) : (
                  'loading...'
                )}
              </Card>
            </Col>
            <Col lg={17} md={24}>
              <Card
                className={styles.tabsCard}
                bordered={false}
                tabList={operationTabList}
                activeTabKey={location.pathname.replace(`${match.path}/`, '')}
                onTabChange={this.onTabChange}
                loading={listLoading}
              >
                {children}
              </Card>
            </Col>
          </Row>
        </GridContent>
      </PageHeaderWrapper>
    );
  }
}
