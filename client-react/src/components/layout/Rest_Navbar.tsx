import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiHomeVariantOutline, mdiSilverware, mdiChartBoxOutline, mdiCartOutline, mdiCog } from '@mdi/js';
import '../assets/styles/restnavbar.css'
import { Layout, Menu, Button, theme } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import RestHome from '../pages/Rest_Home';
import RestArticles from '../pages/Rest_article';
import RestParam from '../pages/Rest_param';
import Historique from '../pages/Rest_historique';

const { Header, Sider, Content } = Layout;


const RestNav = () =>{
    const [collapsed, setCollapsed] = useState(true);
    const [selectedMenu, setSelectedMenu] = useState('1');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  
  const handleMenuClick = (e: MenuInfo) => {
    setSelectedMenu(e.key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case '1':
        return <RestHome />;
      case '2':
        // return <VotreComposantPourNav2 />;
        return <RestArticles/>;
      case '3':
        // return <VotreComposantPourNav3 />;
        return <div><h1>Statistiques</h1></div>;
        case '4':
        // return <VotreComposantPourNav3 />;
        return <Historique/>;
        case '5':
        // return <VotreComposantPourNav3 />;
        return <div><RestParam/></div>;
      default:
        return <div></div>;
    }
  };
  const menuItems = [
    { key: '1', icon: mdiHomeVariantOutline },
    { key: '2', icon: mdiSilverware },
    { key: '3', icon: mdiChartBoxOutline },
    { key: '4', icon: mdiCartOutline },
    { key: '5', icon: mdiCog },
];
    return(
        <Layout >
      <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menuItems.map(item => ({
                        key: item.key,
                        icon: <Icon path={item.icon} size={1} color={selectedMenu === item.key ? '#298029' : '#03081F'} />,
                        // Vous pouvez ajouter un label si nécessaire
                    }))}
                    onClick={handleMenuClick}
                    className='menu'
                />
            </Sider>
      <Layout>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            height:'auto',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
    );
}

export default RestNav