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

const API_URL_REST = 'http://localhost:3001/restaurant';
export const getRestName = async (id:any) => {

  try {
    const response = await api.get(`${API_URL_REST}/get/`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error);
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
  restName:string;
  items: Article[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: string;
  status: "Panier" | "A accepter" | "En préparation" |"En attente de retrait" |"En cours de livraison"|"Livrée" | "Annulée";
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
export interface User {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    mot_de_passe: string;
    adresses_de_livraison: Adresse[];
    code_parrain?: string;
    total_personnes_parrainees?: number;
  }

  export interface Adresse {
    adresse: string;
    code_postal: string;
    ville: string;
    pays: string;
  }

  interface Article {
    _id: string;
    Titre: string;
    Description: string;
    Prix: number;
    Catégorie: string;
    img: string;
    activ:boolean;
  }
  
  interface Menu {
    _id: string;
    Titre: string;
    Description: string;
    Prix: number;
    Articles: string[]; 
    img: string;
    activ:boolean;
  }
  
  interface Restaurant {
    _id: string;
    Nom: string;
    Telephone: string;
    Email: string;
    Categorie: string;
    img: string;
    Menus: Menu[];
    Articles: Article[];
  }

const AdminHome = () =>{
    const [orders, setOrders] = useState<Commande[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await orderApi.getAllOrders();
            
            // Enrichissement des commandes avec le nom de l'utilisateur et du restaurant
            const enrichedOrders = await Promise.all(response.data.map(async (order) => {
              // Initialisation des noms
              let userName = '';
              let restName = '';
      
              try {
                // Récupération du nom de l'utilisateur
                const userResponse = await getUserId(order.userId);
                setUser(userResponse[0]);
                
                userName = userResponse[0].prenom; // Ajustez selon la structure réelle de votre réponse
      
                // Récupération du nom du restaurant
                const Restreponse = await getRestName(order.restaurantId);
                restName = Restreponse.Nom
                setRestaurant(Restreponse)
              } catch (error) {
                console.error("Erreur lors de l'enrichissement des commandes:", error);
              }
      
              return { ...order, userName, restName };
            }));
      
            setOrders(enrichedOrders);
          } catch (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
          }
        };
        console.log("user:",user)
        console.log("restaurant:",restaurant)
        fetchOrders();
      }, []);
      

    const columns = [
        {
            title: 'Client',
            dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'userName',
        },
        {
            title: 'Restaurant',
            dataIndex: 'restName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'restName',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: '_id',
          },
        {
          title: 'Statut',
          dataIndex: 'status',
          key: '_id',
        },
        
      ];

      const columns2 = [
        {
            title: 'Client',
            dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'userName',
        },
        {
            title: 'Restaurant',
            dataIndex: 'restName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'restName',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: '_id',
          },
        {
          title: 'Statut',
          dataIndex: 'status',
          key: '_id',
        },
        
      ];
    
      //"Panier" | "A accepter" | "En préparation" |"En attente de retrait" |"En cours de livraison"|"Livrée";
      const getOrdersRest = (orders: Commande[]) => {
        return orders.filter(order => order.status == "A accepter" || order.status == "En préparation" || order.status == "En attente de retrait" );
      };
      const getOrdersLivr = (orders: Commande[]) => {
        return orders.filter(order => order.status == "En cours de livraison");
      };
    

      const calculateTodaysOrdersTotal = (orders: Commande[]): number => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
      
        return orders.reduce((total, order) => {
          const orderDateStr = new Date(order.orderDate).toISOString().split('T')[0];
          if (orderDateStr === todayStr) {
            total += order.subtotal;
          }
          return total;
        }, 0);
      };

    return(
        <div>
            <h1>Dashboard</h1>
            <Row>
            <Col span={12} push={5} className='cajour'>
            <div className='titre12'>CA journalier</div>
            <div className='statsnumber'>{calculateTodaysOrdersTotal(orders)}€</div>
            </Col></Row>
            <Row gutter={[16, 16]}>
                

                <Col xs={24} sm={12} >
                
      <div className='titre1111'>Commandes en Restaurant</div>
      <Table columns={columns} dataSource={getOrdersRest(orders)} rowKey="userId" pagination={false} size='middle'
      expandable={{
        expandedRowRender: (record) => (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3>Articles commandés :</h3>
                <div>
                    {record.items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>€{item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Sous-total :</b> <b>€{record.subtotal.toFixed(2)}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Frais de livraison :</b> €{record.deliveryFee.toFixed(2)}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Total :</b> <b>€{record.total.toFixed(2)}</b></div>
                </div>
            </div>
        
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <h3>Client :</h3>
                    <p><b>Nom :</b> {user?.nom}</p>
                    <p><b>Prénom :</b> {user?.prenom}</p>
                    <p><b>Email :</b> {user?.email}</p>
                    <p><b>Téléphone :</b> {user?.telephone}</p>
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Restaurant :</h3>
                    <p><b>Nom :</b> {restaurant?.Nom}</p>
                    <p><b>Email :</b> {restaurant?.Email}</p>
                    <p><b>Téléphone :</b> {restaurant?.Telephone}</p>
                </div>
            </div>
        </div>
        

        ),
    }}
      />
      
            </Col>
            <Col xs={24} sm={12} >
    <div className='titre1111'>Commandes en Livraisons</div>
      <Table columns={columns2} dataSource={getOrdersLivr(orders)} rowKey="userId" pagination={false} size='middle'
      expandable={{
        expandedRowRender: (record) => (
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3>Articles commandés :</h3>
                <div>
                    {record.items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>€{item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Sous-total :</b> <b>€{record.subtotal.toFixed(2)}</b></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Frais de livraison :</b> €{record.deliveryFee.toFixed(2)}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><b>Total :</b> <b>€{record.total.toFixed(2)}</b></div>
                </div>
            </div>
        
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, marginRight: '20px' }}>
                    <h3>Client :</h3>
                    <p><b>Nom :</b> {user?.nom}</p>
                    <p><b>Prénom :</b> {user?.prenom}</p>
                    <p><b>Email :</b> {user?.email}</p>
                    <p><b>Téléphone :</b> {user?.telephone}</p>
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Restaurant :</h3>
                    <p><b>Nom :</b> {restaurant?.Nom}</p>
                    <p><b>Email :</b> {restaurant?.Email}</p>
                    <p><b>Téléphone :</b> {restaurant?.Telephone}</p>
                </div>
            </div>
        </div>
        

        ),
    }}
      />
      
    </Col>
    </Row>
    </div>
  );
};

export default AdminHome