import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import { formatMessage } from 'umi/locale';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import DocumentTitle from 'react-document-title';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright"/> 2018 微云智控
  </Fragment>
);

class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = 'Ant Design Pro';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - Ant Design Pro`;
  //   }
  //   return title;
  // }


  getPageTitle = pathname => {
    let currRouterData = null;
    // match params path
    // Object.keys(this.breadcrumbNameMap).forEach(key => {
    //   if (pathToRegexp(key).test(pathname)) {
    //     currRouterData = this.breadcrumbNameMap[key];
    //   }
    // });
    if (!currRouterData) {
      return 'vipBocai';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - vipBocai`;
  };

  render() {
    const { children } = this.props;
    const {
      location: { pathname },
    } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.top}>
                <div className={styles.header}>
                  <Link to="/">
                    <img alt="logo" className={styles.logo} src={logo}/>
                    <span className={styles.title}>vipBocai</span>
                  </Link>
                </div>
                <div className={styles.desc}>会员管理系统</div>
              </div>
              {children}
            </div>
            <GlobalFooter copyright={copyright}/>
          </div>
        </DocumentTitle>
      </React.Fragment>

    );
  }
}

export default UserLayout;
