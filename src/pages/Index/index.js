import React, { PureComponent } from 'react';

import BannerAnim from 'rc-banner-anim';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import { connect } from 'dva';
import { Card, Form, Layout, List } from 'antd';
import styles from '../List/Projects.less';

const { Element } = BannerAnim;
const BgElement = Element.BgElement;

/* eslint react/no-multi-comp:0 */
@connect(({ list, login, loading }) => ({
  list,
  token: login.userToken,
  loading: loading.models.recharlist,
}))
export default class UserCenterInfo extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      list: { list = [] },
      loading,
    } = this.props;

    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.title} src={item.cover} />}
            />
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Layout>
        <BannerAnim>
          <Element key="aaa" prefixCls="banner-user-elem">
            <BgElement
              key="bg"
              className="bg"
              style={{
                backgroundImage:
                  'url(https://static-v3.swcqlz.com/cms/cms_pic/2018051046ac6cb3ca4949339c6c2281e5a03888.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <QueueAnim name="QueueAnim">
              <p key="h1">Ant Motion Demo</p>
              <p key="p">Ant Motion Demo.Ant Motion Demo.Ant Motion Demo.Ant Motion Demo</p>
            </QueueAnim>
            <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
              Ant Motion Demo.Ant Motion Demo
            </TweenOne>
          </Element>
          <Element key="bbb" prefixCls="banner-user-elem">
            <BgElement
              key="bg"
              className="bg"
              style={{
                backgroundImage:
                  'url(https://static-v3.swcqlz.com/cms/cms_pic/2018052583d3f4d6c34e49c18c88bbabebd0c4f6.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <QueueAnim name="QueueAnim">
              <p key="h1">Ant Motion Demo</p>
              <p key="p">Ant Motion Demo.Ant Motion Demo.Ant Motion Demo.Ant Motion Demo</p>
            </QueueAnim>
            <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
              Ant Motion Demo.Ant Motion Demo
            </TweenOne>
          </Element>
          <Element key="ccc" prefixCls="banner-user-elem">
            <BgElement
              key="bg"
              className="bg"
              style={{
                backgroundImage:
                  'url(https://static-v3.swcqlz.com/cms/cms_pic/20180525cd594cd44dfc450cae4203f83e872543.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <QueueAnim name="QueueAnim">
              <p key="h1">Ant Motion Demo</p>
              <p key="p">Ant Motion Demo.Ant Motion Demo.Ant Motion Demo.Ant Motion Demo</p>
            </QueueAnim>
            <TweenOne animation={{ y: 50, opacity: 0, type: 'from', delay: 200 }} name="TweenOne">
              Ant Motion Demo.Ant Motion Demo
            </TweenOne>
          </Element>
        </BannerAnim>
        <div className={styles.cardItme}>{cardList}</div>
      </Layout>
    );
  }
}
