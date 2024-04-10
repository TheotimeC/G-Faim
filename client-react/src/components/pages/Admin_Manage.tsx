import '../assets/styles/adminmanage.css'; 
import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined,StopOutlined } from '@ant-design/icons';
import api from '../assets/api';
import orderApi from '../assets/order-api';
const API_URL = 'http://localhost:3000/user';

interface User {
    id?: string;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    mot_de_passe: string;
    adresses_de_livraison: Adresse[];
    code_parrain?: string;
    total_personnes_parrainees?: number;
    role?:string;
  }
  
interface Adresse {
    adresse: string;
    code_postal: string;
    ville: string;
    pays: string;
  }

  interface Order {
    id: string;
    status: string;
    total: number;
}


export const getUsers = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await api.get(`${API_URL}/get`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des informations:', error);
      throw error;
    }
  };
const AdminManage = () =>{
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    // État pour stocker les données de l'utilisateur sélectionné
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userOrders, setUserOrders] = useState<Order[]>([]);


    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    const columns2= [
        {
            title: 'ID Commande',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Date de commande',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
    ];

    const columns = [
        {
            title: 'Rôle',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Nom',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Prénom',
            dataIndex: 'prenom',
            key: 'prenom',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EyeOutlined />} onClick={() => viewDetails(record)}>Voir +</Button>
                    <Button icon={<StopOutlined />} onClick={() => editUser(record)}>Suspendre</Button>
                    <Button icon={<DeleteOutlined />} onClick={() => deleteUser(record)}>Supprimer</Button>
                </Space>
            ),
        },
    ];

    // Exemple de fonctions d'action
    const viewDetails = async (record: User) => {
        setSelectedUser(record);
        setIsModalVisible(true);
        if (record._id) {
            try {
                
                const response = await orderApi.getOrdersByUserId(record._id);
                const orders = response.data; // Supposons que cela renvoie un tableau d'objets commande
                console.log("Commandes récupérées :", orders); // Vérifiez les données retournées
                setUserOrders(orders);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
                setUserOrders([]); // Gestion de l'erreur
            }
        }
    };
    
    

    const editUser = (user) => {
        console.log('Modifier', user);
        // Ici, implémentez la logique pour modifier l'utilisateur
    };

    const deleteUser = (user) => {
        console.log('Supprimer', user);
        // Ici, implémentez la logique pour supprimer l'utilisateur
    };
    
    return (
        <div>
            <h1>Gestion des Utilisateurs</h1>
            <Table columns={columns} dataSource={users} rowKey="email" />
            <Modal
                title=""
                width={1300}
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Retour
                    </Button>,
                ]}
            >
                
                {selectedUser && (
                    <div className="modal-content">
                    <div  className='user-infos'>
                        <h3>Détails de l'utilisateur</h3>
                        <p>Prenom: {selectedUser.prenom}</p>
                        <p>Nom: {selectedUser.nom}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Téléphone: {selectedUser.telephone}</p>
                        <p>Rôle: {selectedUser.role}</p>
                        <p>Total Parrainages: {selectedUser.total_personnes_parrainees}</p>
                    </div>
                    <div className='user-ordersinfos'>
                        <h3>Commandes de l'utilisateur :</h3>
                        <Table
                            columns={columns2}
                            dataSource={userOrders}
                            rowKey="_id"
                            expandable={{
                                expandedRowRender: (record) => (
                                    <div>
                                        <p><b>Restaurant : </b>{record.restaurantId}</p>
                                        <p><b>Articles commandés :</b></p>
                                        {record.items.map((item, index) => (
                            
                                            <div key={index}>
                                                <p>{item.name} x {item.quantity} - €{item.price.toFixed(2)}</p>
                                            </div>
                                        ))}
                                        <p><b>Sous-total :</b> €{record.subtotal.toFixed(2)}</p>
                                        <p><b>Frais de livraison :</b> €{record.deliveryFee.toFixed(2)}</p>
                                        <p><b>Total :</b> €{record.total.toFixed(2)}</p>
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminManage