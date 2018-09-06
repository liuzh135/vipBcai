import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

/**
 * @fileName: Footer.js
 * Created on 2018-09-06
 *
 * 底部的文件
 */
const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: '首页',
          href: '/#',
          blankTarget: false,
        },
        {
          key: 'vipBocai',
          title: 'vipBocai',
          href: '/#',
          blankTarget: false,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright"/> 2018 微云智控
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
