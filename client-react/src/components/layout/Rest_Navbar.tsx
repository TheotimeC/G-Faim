import React, { useState } from 'react';
import Icon from '@mdi/react';
import { mdiHomeVariantOutline, mdiSilverware, mdiChartBoxOutline, mdiCartOutline, mdiCog } from '@mdi/js';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import { MenuInfo } from 'rc-menu/lib/interface';
import RestHome from '../pages/Rest_Home';

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
        return <div>Contenu pour Nav 2</div>;
      case '3':
        // return <VotreComposantPourNav3 />;
        return <div>Contenu pour Nav 3</div>;
        case '4':
        // return <VotreComposantPourNav3 />;
        return <div>Contenu pour Nav 4</div>;
        case '5':
        // return <VotreComposantPourNav3 />;
        return <div>Contenu pour Nav 5</div>;
      default:
        return <RestHome />;
    }
  };

    return(
        <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            { key: '1', icon: <Icon path={mdiHomeVariantOutline} size={1} />, label: 'nav 1' },
            { key: '2', icon: <Icon path={mdiSilverware} size={1} />, label: 'nav 2' },
            { key: '3', icon: <Icon path={mdiChartBoxOutline} size={1} />, label: 'nav 3' },
            { key: '4', icon: <Icon path={mdiCartOutline} size={1} />, label: 'nav 3' },
            { key: '5', icon: <Icon path={mdiCog} size={1} />, label: 'nav 3' },
          ]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, fontFamily:'Poppins', fontSize:'24px', fontWeight:'bold', paddingLeft:'2%'}}>
          Bienvenue nom
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: '100vh',
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