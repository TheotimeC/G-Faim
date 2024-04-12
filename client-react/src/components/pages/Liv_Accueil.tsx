import React, { useState, useEffect } from 'react';
import { Button, Modal, Table } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import '../assets/styles/livaccueil.css';
import Logo from '../assets/images/logo.png';
import LivTableau from '../common/LivTableau';
import LivDetailCommande from '../common/LivDetailCommande';
import orderApi from '../assets/order-api';
import { CheckCircleOutlined , DeleteOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import api from '../assets/api';
import { recordExpression } from '@babel/types';

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
  userAddr:string;
  restaurantId: string;
  restName:string;
  restAddr:string;
  items: Article[];
  subtotal: number;
  deliveryFee: number;
  deliveryAddress:string;
  total: number;
  orderDate: string;
  status: "Panier" | "A accepter" | "En préparation" |"En attente de retrait" |"En cours de livraison"|"Livrée";
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

interface Articles {
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
  Adresse:string;
  Email: string;
  Categorie: string;
  img: string;
  Menus: Menu[];
  Articles: Articles[];
}


const Liv_Accueil: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [orders, setOrders] = useState<Commande[]>([])
  const [currentOrder, setCurrentOrder] = useState<Commande | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<Commande | null>(null);;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isOrderAccepted, setIsOrderAccepted] = useState<boolean>(false);
  const [isOrderPickedUp, setIsOrderPickedUp] = useState<boolean>(false);

  useEffect(() => {
    console.log("currentOrder:",currentOrder)
    if (!currentOrder) { // Seulement récupérer les commandes si aucune commande n'est en cours
      const fetchOrders = async () => {
        try {
          const response = await orderApi.getAllOrdersWithoutDeliveryMan();
          const enrichedOrders = await Promise.all(response.data.map(async (order) => {
            let userName = '';
            let restName = '';
            try {
              const userResponse = await getUserId(order.userId);
                setUser(userResponse[0]);
                
                userName = userResponse[0].prenom; // Ajustez selon la structure réelle de votre réponse
      
                // Récupération du nom du restaurant
                const Restreponse = await getRestName(order.restaurantId);
                restName = Restreponse.Nom
                setRestaurant(Restreponse)
            } catch (error) {
              console.error("Erreur lors de la récupération du nom de l'utilisateur:", error);
              return order;
            }
            return { ...order, userName, restName };
          }));
          setOrders(enrichedOrders);
        } catch (error) {
          console.error("Erreur lors de la récupération des commandes:", error);
        }
      };
  
      fetchOrders();
    }
  }, [currentOrder]);
  

  const columns = [
    {
        title: 'Client',
        dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
        key: 'userName',
    },
    {
        title: 'Restaurant',
        dataIndex: 'restName',
        key: '_id',
      },
    {
      title: 'Prix',
      dataIndex: 'deliveryFee',
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
          </>
        ),
      },
  ];

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const toggleActiveStatus = () => {
    setIsActive(!isActive);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };



  const handleAcceptOrder = async (orderId: string, order: Commande) => {
  const userCacheString = localStorage.getItem('userCache');
  if (!userCacheString) {
    console.error("Aucun utilisateur connecté trouvé");
    return;
  }

  const userCache = JSON.parse(userCacheString);
  const deliveryId = userCache._id;

  if (!deliveryId) {
    console.error("ID du livreur non trouvé");
    return;
  }

  try {
    // Assurez-vous que votre API prend en charge la mise à jour de la commande avec deliveryManId
    await orderApi.updateOrderById(orderId, { deliveryManId: deliveryId });
    setCurrentOrder(order); // Mise à jour de la commande actuelle pour affichage
    setIsOrderAccepted(true);
    setIsModalVisible(false); // Fermeture du modal
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la commande:", error);
  }
};

  const handlePickupOrder = async(record:any) => {

      try{
        const response = await orderApi.setRestaurantStatus(record._id, "En cours de livraison");
        setIsOrderPickedUp(true);

      }catch(error){
        console.error('Erreur lors du changement de statut:', error);
      }
    

};
const cancelCurrentOrder = () => {
  setCurrentOrder(null); // Réinitialiser la commande actuelle
};

// Fonction pour marquer la commande comme livrée
const deliverOrder = async () => {
  if (!currentOrder) return;

  try {
    // Mise à jour du statut de la commande sur l'API
    await orderApi.setRestaurantStatus(currentOrder._id, "Livrée");
    setCurrentOrder(null); // Réinitialiser la commande actuelle après la livraison
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de livraison de la commande:", error);
  }
};

const modalFooter = (
  <>
    <Button key="refuse" onClick={() => setIsModalVisible(false)}>Refuser</Button>
    <Button key="accept" onClick={() => handleAcceptOrder(selectedRecord?._id, selectedRecord)}>Accepter</Button>
  </>
);

  return (
    <div className='liv-accueil'>
      <div className="liv-accueil-container">
        <div className="logo-section">
          <img src={Logo} className="logo" alt='logo' />
        </div>
        <div className="livreur-info-section">
          <div className="livreur-name">
            <h2>Aycan</h2>
          </div>
          <div className='liv-btn'>
            <Button
              type={isActive ? 'primary' : 'default'}
              icon={<PoweroffOutlined />}
              onClick={toggleActiveStatus}
              className='liv-accueil-button'>
              {isActive ? 'Actif' : 'Inactif'}
            </Button>
          </div>
        </div>
      </div>
    

    <div>
      {currentOrder ? (
        <div>
        <div className="delivery-title-container">
          <h3>Commande en cours</h3>
        </div>
        <div className="order-details">
          <p>Nom du client: {currentOrder.userName}</p>
          {/* Affichez d'autres détails de la commande ici */}
          <p>Total: {currentOrder.total} €</p>
        </div>
        <div className="order-actions">
          {isOrderPickedUp ? (
            // Boutons après que la commande a été récupérée
            <>
              <Button key="cancel" onClick={cancelCurrentOrder}>Annuler</Button>
              <Button key="message">Message</Button>
              <Button key="delivered" onClick={deliverOrder}>Livrée</Button>
            </>
          ) : (
            // Boutons avant que la commande soit récupérée
            <>
              <Button key="cancel" onClick={cancelCurrentOrder}>Annuler</Button>
              <Button key="message">Message</Button>
              <Button key="pickedUp" onClick={() => handlePickupOrder(currentOrder)}>Commande récupérée</Button>
            </>
          )}
        </div>
      </div>
      ) : (
        <>
        <h3>Livraisons autour de moi</h3>
          <Table columns={columns} dataSource={orders} rowKey="_id" pagination={false} size='small'/>
          {isModalVisible && (
            <Modal
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={800}
            footer={modalFooter}
            >
            {selectedRecord && (
      <div className="delivery-container">
      <div className="delivery-section">
        <h3>Commande</h3>
        <p>Nombre d'articles : {selectedRecord.items.length}</p>
        <p>Statut : {selectedRecord.status}</p>
        <p>Prix Livraison : {selectedRecord.deliveryFee}€</p>
      </div>
      
      <div className="delivery-section">
        <h3>Restaurant</h3>
        <p>{restaurant?.Nom}</p>
        <p>{restaurant?.Telephone}</p>
        <p>{restaurant?.Adresse}</p>
      </div>
      
      <div className="delivery-section">
        <h3>Client</h3>
        <p>{user?.prenom} {user?.nom}</p>
        <p>{user?.telephone}</p>
        <p>{user?.adresse}</p>
      </div>
    </div>
    
    )}
    
            </Modal>
          )}
        </>
      )}
    </div>
  </div>
);
};

export default Liv_Accueil;