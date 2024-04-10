import api from '../assets/api';
import orderApi from '../assets/order-api';
import React, { useEffect, useState } from 'react';
import '../assets/styles/resthome.css'
import { Col, Row, Table, Button, Modal, Divider    } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CheckCircleOutlined , DeleteOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';

const API_URL_USER = 'http://localhost:3000/user';
const API_URL_ORDER = 'http://localhost:3000/api';

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
  status: "Panier" | "A accepter" | "En préparation" |"En attente de retrait" |"En cours de livraison"|"Livrée";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const RestHome = () =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Commande | null>(null);
    const [orders, setOrders] = useState<Commande[]>([]);
    const [messages, setMessages] = useState<string[]>([]);
    /*
    useEffect(() => {
      // Connexion au serveur WebSocket
      const ws = new WebSocket('ws://localhost:14101');
  
      ws.onmessage = (event) => {
        // Lors de la réception d'un message, mettez à jour l'état avec le nouveau message
        
        const message = event.data;
        console.log("Nouveau message WebSocket reçu:", message);
        setMessages(prevMessages => [...prevMessages, message]);
      };
      
  
      return () => {
        if (ws.readyState === 1) { // <-- This is important
          ws.close();
        }
    }
    }, []);*/
    
    // Transformer les données
    const transformOrdersToChartData = (orders: Commande[]) => {
      // Étape 1: Récupérer les dates des commandes et les comptabiliser
      const countsByDate = orders.reduce((acc, { orderDate }) => {
        const date = new Date(orderDate).toISOString().split('T')[0]; // Convertit en format YYYY-MM-DD
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Étape 2: Transformer l'objet des comptages en tableau pour le graphique
      const chartData = Object.entries(countsByDate).map(([date, count]) => ({
        date,
        count
      }));

      return chartData;
    };

    // Utiliser cette fonction pour obtenir le nombre de commandes par date
    const chartData = transformOrdersToChartData(orders);
    
    const handleStatusUpdate = async(record)=>{
      const originalStatus = record.status;
      var updatedStatus;
      switch(originalStatus){
        case 'A accepter':
           updatedStatus = 'En préparation'
          break;

        case 'En préparation':
           updatedStatus = 'En attente de retrait'
          break;
      }

      try{
        const response = await orderApi.setRestaurantStatus(record._id, updatedStatus);
        const updatedOrder = response.data; // Supposons que cela soit l'objet de commande mis à jour
        const updatedOrders = orders.map(order =>
          order._id === record._id
            ? { ...response.data, userName: order.userName } // Conserve le userName de l'état précédent
            : order
        );
        setOrders(updatedOrders);

      }catch(error){
        console.error('Erreur lors du changement de statut:', error);
      }
    }

    const countNonReadyOrders = (orders: Commande[]): number => {
      return orders.reduce((count, order) => {
        if (order.status !== 'En attente de retrait') {
          count += 1;
        }
        return count;
      }, 0);
    };

    const calculateTodaysOrdersTotal = (orders: Commande[]): number => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
    
      return orders.reduce((total, order) => {
        const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0];
        if (orderDateStr === todayStr) {
          total += order.total;
        }
        return total;
      }, 0);
    };

    useEffect(() => {
      const restId = localStorage.getItem('restaurantId');
      if (!restId) {
        console.log("ID du restaurant non trouvé");
        return;
      }
      const fetchOrders = async () => {
        try {
          const response = await orderApi.getOrdersByRestaurantId(restId);
          // Utiliser Promise.all pour récupérer les noms d'utilisateurs pour chaque commande
          const enrichedOrders = await Promise.all(response.data.map(async (order) => {
            try {
              // Supposons que getUserId retourne directement le nom de l'utilisateur
              const userResponse = await getUserId(order.userId);
              return { ...order, userName: userResponse[0].prenom }; // Ajustez selon la structure réelle de la réponse
            } catch (error) {
              console.error("Erreur lors de la récupération du nom de l'utilisateur:", error);
              return order; // Retourne la commande sans modification si l'utilisateur ne peut pas être récupéré
            }
          }));
          setOrders(enrichedOrders);
        } catch (error) {
          console.error("Erreur lors de la récupération des commandes:", error);
        }
      };
    
      fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Client',
            dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'userName',
        },
        {
            title: 'Livreur',
            dataIndex: 'status',
            key: '_id',
          },
        {
          title: 'Statut',
          dataIndex: 'status',
          key: '_id',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <>
                <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
                <Button className="ok" icon={<CheckCircleOutlined />}  onClick={() => handleStatusUpdate(record)}>Accepter </Button>
                <Button className="no" icon={<StopOutlined />} onClick={() => console.log('Supprimer', record)} >Refuser </Button>
              </>
            ),
          },
      ];

      const columns2 = [
        {
            title: 'Client',
            dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'userName',
        },
        {
            title: 'Livreur',
            dataIndex: 'status',
            key: '_id',
          },
        {
          title: 'Statut',
          dataIndex: 'status',
          key: '_id',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <>
                <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
                <Button className="ok" icon={<CheckCircleOutlined />}  onClick={() => handleStatusUpdate(record)}>Prête </Button>
                <Button className="no" icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)} >Annuler </Button>
              </>
            ),
          },
      ];
      const getPrepOrders = (orders: Commande[]) => {
        return orders.filter(order => order.status == "En préparation");
      };

      const getToAcceptOrders = (orders: Commande[]) => {
        return orders.filter(order => order.status == "A accepter");
      };

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
            <h1>Dashboard</h1>
            <Row>
                <Col span={12} className='colonne1'>
                    <Row>

                    <Col span={12} className='Rectangle2'>
                        <div className='titre1'>Commandes en cours</div>
                        <div className='statsnumber'>{countNonReadyOrders(orders)}</div>
                    
                    </Col>

                    <Col span={12} className='Rectangle3'>
                        <div className='titre1'>CA journalier</div>
                        <div className='statsnumber'>{calculateTodaysOrdersTotal(orders)}€</div>
                    </Col>

                    </Row>

                    <Row className='Rectangle'>
                        <div className='titre1'>Total commandes</div>
                        <LineChart width={600} height={300} data={chartData} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Line type="monotone" dataKey="count"  stroke="#298029" activeDot={{ r: 8 }} strokeWidth={3}/>
                        </LineChart>
                    </Row>
                    
                </Col>

                <Col span={12} className='Rectangle1'>
                <div>
      <div className='titre1'>Commandes à accepter</div>
      <Table columns={columns} dataSource={getToAcceptOrders(orders)} rowKey="userId" pagination={false} size='middle'/>
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
        <b className="a-accepter1">{selectedRecord.status}</b>
      </div>
        <div className="frame-wrapper20">
          <div className="rectangle-parent233">
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

    <div className='titre11'>Commandes en cours</div>
      <Table columns={columns2} dataSource={getPrepOrders(orders)} rowKey="userId" pagination={false} size='middle'/>
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
        <b className="a-accepter1">{selectedRecord.status}</b>
      </div>
        <div className="frame-wrapper20">
          <div className="rectangle-parent233">
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
                </Col>
            </Row>
        </div>
    );
}

export default RestHome