import restdata from '../assets/FakeData/Restaurant.json'
import React from 'react';
import { Tabs, Table, Switch, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import '../assets/styles/restarticle.css'; 

const { TabPane } = Tabs;

const RestArticles = () => {
    const columns = [
        {
          title: 'Titre',
          dataIndex: 'Titre',
          key: 'Titre',
        },
        {
          title: 'Description',
          dataIndex: 'Description',
          key: 'Description',
        },
        {
          title: 'Prix',
          dataIndex: 'Prix',
          key: 'Prix',
          render: (text) => `${text}€`,
        },
        {
          title: 'Actions',
          key: 'actions',
          render: (_, record) => (
            <>
              <Switch defaultChecked />
              <Button icon={<EditOutlined />} onClick={() => console.log('Modifier', record)} style={{ margin: '0 8px' }} />
              <Button icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)} />
            </>
          ),
        },
      ];

  return (
    <div>
        <h1>Menus & Articles</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Menus" key="1">
            <Table columns={columns} dataSource={restdata.Menus} rowKey="Titre" />
        </TabPane>
        <TabPane tab="Articles" key="2">
            <Table columns={columns} dataSource={restdata.Articles} rowKey="Titre"/>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default RestArticles;