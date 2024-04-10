import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiHomeVariantOutline, mdiMapMarker, mdiAccount } from '@mdi/js';
import '../assets/styles/livnavbar.css'
import { Layout, Menu, Button, theme } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import LivAccueil from '../pages/Liv_Accueil';

const { Header, Sider, Content, Footer } = Layout;

const LivNav = () =>{
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
        return <LivAccueil />;
      //case '2':
        // return <VotreComposantPourNav2 />;
       // return <RestArticles/>;
      //case '3':
        // return <VotreComposantPourNav3 />;
        //return <div><h1>Statistiques</h1></div>;
      default:
        return <LivAccueil />;
    }
  };
  const menuItems = [
    { key: '1', icon: mdiHomeVariantOutline },
    { key: '2', icon: mdiMapMarker },
    { key: '3', icon: mdiAccount },
];
return(
    <Layout className="layout-fixed-bottom">
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 'calc(100vh - 70px)', 
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {renderContent()}
      </Content>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        items={menuItems.map(item => ({
          key: item.key,
          icon: <Icon path={item.icon} size={1} />,
        }))}
        onClick={handleMenuClick}
        className="menu-bottom"
      />
    </Layout>
  );
}

export default LivNav