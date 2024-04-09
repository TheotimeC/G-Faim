import '../assets/styles/navbar.css'; 
import orderApi from '../assets/order-api';
import React, {useState, useEffect} from 'react';
import { Col, Row, Table, Button, Modal, Divider    } from 'antd';
import { DatePicker, Space, Input, Menu, Dropdown } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { CheckCircleOutlined , DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../assets/api';
import moment from 'moment';

const API_URL_USER = 'http://localhost:3000/user';

export const getUserId = async (id:any) => {
  try {

    const response = await api.get(`${API_URL_USER}/getuserId/`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de luser:', error);
    throw error;
  }
};
interface Article {
    itemId: string;
    name: string;
    imgSrc: string;
    quantity: number;
    price: number;
    description: string;
  }
  
  interface Commande {
    _id: string;
    userId: string;
    userName:string;
    restaurantId: string;
    items: Article[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    orderDate: string;
    restaurantStatus: "to accept" | "in preparation" | "ready";
    deliveryStatus: "awaiting pickup" | "in transit" | "delivered";
    status: "cart" | "paid" | "fulfilled";
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();
    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  };

const Historique = () =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Commande | null>(null);
    const [orders, setOrders] = useState<Commande[]>([]);

    useEffect(() => {
        const restId = localStorage.getItem('restaurantId');
        if (!restId) {
          console.log("ID du restaurant non trouvé");
          return;
        }

        const fetchOrders = async () => {
          try {
            const response = await orderApi.getOrdersByRestaurantId(restId);
            const ordersWithUserNames = await Promise.all(response.data.map(async (order) => {
              // Récupérer les informations de l'utilisateur pour chaque commande
              const userResponse = await getUserId(order.userId);
              // Ajoutez le nom de l'utilisateur à l'objet de la commande
              return { ...order, userName: userResponse[0].prenom }; // Assurez-vous que cette propriété correspond à votre réponse API
            }));
            setOrders(ordersWithUserNames);
          } catch (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
          }
        };
      
        fetchOrders();
    }, []);

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              autoFocus
              placeholder={`Recherche ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => confirm()}
              style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => confirm()}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Recherche
              </Button>
              <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
                Réinitialiser
              </Button>
            </Space>
          </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      });

      const columns = [
        {
          title: 'Client',
          dataIndex: 'userName',
          key: 'userName',
          ...getColumnSearchProps('userName'),
        },
        {
          title: 'Livreur',
          dataIndex: 'deliveryManName', // Assurez-vous que cela correspond à votre modèle de données
          key: 'deliveryManName',
          ...getColumnSearchProps('deliveryManName'),
        },
        {
          title: 'Statut',
          dataIndex: 'restaurantStatus',
          key: 'restaurantStatus',
          filters: [
            { text: 'To accept', value: 'to accept' },
            { text: 'In preparation', value: 'in preparation' },
            { text: 'Ready', value: 'ready' },
          ],
          onFilter: (value, record) => record.restaurantStatus.indexOf(value) === 0,
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
          render: createdAt => formatDate(createdAt),
          filterDropdown: ({ setSelectedKeys, confirm }) => (
            <div style={{ padding: 8 }}>
              <DatePicker
                onChange={value => {
                  setSelectedKeys(value ? [moment(value).format('YYYY-MM-DD')] : []);
                  confirm();
                }}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            </div>
          ),
        },
        {
          title: 'Total (€)',
          dataIndex: 'subtotal',
          key: 'subtotal',
          sorter: (a, b) => a.subtotal - b.subtotal,
        },
        {
          title: 'Voir +',
          key: 'actions',
          render: (_, record) => (
            <>
              <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
            </>
          ),
        },
      ];
      const showModal = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
      };
      
      const handleOk = () => {
        setIsModalVisible(false);
      };
      
      const handleCancel = () => {
        setIsModalVisible(false);
      };
    return(
        <div>
            <h1>Historique</h1>
            <Table columns={columns} dataSource={orders} rowKey="userId" pagination={false} size='middle'/>
            <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        >
        {selectedRecord && (
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <div className="frame-wrapper19">
      {selectedRecord.items.map((article, index) => (
        <div key={index} className="frame-parent48">
          <div className="parent6">
            <b className="b21">{`${article.price} €`}</b>
            <div className="menu-maxi-best-of-parent">
              <b className="menu-maxi-best-of2">{article.name}</b>
              <b className="b22">{article.quantity}</b>
            </div>
          </div>
          {index < selectedRecord.items.length - 1 && (
            <div className="line-wrapper8">
              <div className="frame-child63" />
            </div>
          )}
        </div>
      ))}
      <div className="line-wrapper8">
              <div className="frame-child63" />
            </div>
      <div className="prix-total-parent">
        <b className="prix-total1">Prix Total : </b>
        <b className="b27">{`${selectedRecord.subtotal} €`}</b>
      </div>
    </div>
    
    <div className="frame-parent50">
      
      <div className="client-parent">
        <b className="client1">Client</b>
        <b className="barnab1">{selectedRecord.userName}</b>
      </div>
      <div className="livreur-parent">
        <b className="livreur1">Livreur</b>
        <b className="samy3"> {selectedRecord.userName}</b>
      </div>
      <div className="statut-parent">
        <b className="statut1">Statut</b>
        <b className="a-accepter1">{selectedRecord.restaurantStatus}</b>
      </div>
        <div className="frame-wrapper20">
          <div className="rectangle-parent23">
            <div className="frame-child65" />
            <b className="demande">Demande :</b>
            <div className="sans-tomates-chef">
              {selectedRecord.status}
            </div>
          </div>
        </div>
    </div>
  </div>
)}
    </Modal>
        </div>
    );
}

export default Historique