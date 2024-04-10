import '../assets/styles/adminmanage.css'; 
import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../assets/api';
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

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await getUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

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
                    <Button icon={<EyeOutlined />} onClick={() => viewDetails(record)}></Button>
                    <Button icon={<EditOutlined />} onClick={() => editUser(record)}></Button>
                    <Button icon={<DeleteOutlined />} onClick={() => deleteUser(record)}></Button>
                </Space>
            ),
        },
    ];

    // Exemple de fonctions d'action
    const viewDetails = (record: User) => {
        setSelectedUser(record);
        setIsModalVisible(true);
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
                title="Détails de l'utilisateur"
                open={isModalVisible}
                onOk={() => setIsModalVisible(false)}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>
                        Retour
                    </Button>,
                ]}
            >
                {/* Afficher les détails de l'utilisateur ici */}
                {selectedUser && (
                    <div>
                        <p>Nom: {selectedUser.nom}</p>
                        <p>Email: {selectedUser.email}</p>
                        <p>Rôle: {selectedUser.role}</p>
                        {/* Affichez d'autres champs de l'utilisateur ici */}
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default AdminManage