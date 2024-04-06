import React, { useEffect, useState } from 'react';
import { Tabs, Table, Switch, Button, Modal, Row, Col, Checkbox, notification  } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../common/api.ts';
import Input from '../common/Input.tsx';
import '../assets/styles/restarticle.css'; 

const { TabPane } = Tabs;
const API_URL = 'http://localhost:3001/restaurant';

interface Article {
  _id: string;
  Titre: string;
  Description: string;
  Prix: number;
  Catégorie: string;
  img: string;
}

interface Menu {
  _id: string;
  Titre: string;
  Description: string;
  Prix: number;
  Articles: string[]; 
  img: string;
}

export const getRestData = async () => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.get(`${API_URL}/get/`, {
      params:{id:restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des informations:', error);
    throw error;
  }
};

export const putMenuData = async (menuId: any, data: Partial<Menu>) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    console.log("menuId",menuId);
    const response = await api.put(`${API_URL}/modify/menu/${menuId}`, data, { // Correction ici
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du menu:', error);
    throw error;
  }
};

const RestArticles = () => {
  const [Articles, setSelectedArticleIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [restData, setRestData] = useState<{ Menus: Menu[]; Articles: Article[] }>({ Menus: [], Articles: [] });
  const [Titre, setNomMenu] = useState('');
  const [Description, setdescri] = useState('');
  const [Prix, setPrix] = useState<number | undefined>(undefined);
  const [Img, setImg] = useState('');

  const onSelectChange = (selectedRowKeys:any) => {
    setSelectedArticleIds(selectedRowKeys);
  };



  // Préparation des données du tableau pour tous les articles
  const articleData = restData.Articles.map(article => ({
    key: article._id,
    titre: article.Titre,
    description: article.Description,
    prix: article.Prix,
    // Autres champs nécessaires...
  }));

  const rowSelection = {
    selectedRowKeys: Articles,
    onChange: onSelectChange, 
  };

  const articleColumns = [
    {
      title: 'Article',
      dataIndex: 'titre',
    },
    {
      title: 'Prix',
      dataIndex: 'prix',
      render: prix => `${prix}€`,
    },
    // Ajoutez d'autres colonnes si nécessaire
  ];

  const handleUpdateMenu = async () => {
    // Créez un objet de mise à jour basé uniquement sur les champs modifiés
    const updatedFields: { [key: string]: any } = {};
    if (Titre !== '') updatedFields.Titre = Titre;
    if (Description !== '') updatedFields.Description = Description;
    if (Prix !== undefined) updatedFields.Prix = Prix;
    updatedFields.img = Img;
    updatedFields.Articles = Articles;
  
    try {
      if (Object.keys(updatedFields).length > 0) {
        await putMenuData(selectedRecordId, updatedFields); // Utilisez 'selectedRecordId' pour l'ID du menu
        notification.success({
          message: 'Mise à jour réussie',
          description: 'Le menu a été mis à jour avec succès.',
          placement: 'topRight', // Optionnel: position de la notification
          duration: 4.5, // Optionnel: durée d'affichage (en secondes)
        });
        setIsModalVisible(false);
      } else {
        console.log("Aucune modification à mettre à jour.");
      }
    } catch (error) {
      notification.error({
        message: 'Erreur lors de la mise à jour',
        description: 'Une erreur est survenue lors de la mise à jour du menu.',
        placement: 'topRight', // Optionnel: position de la notification
        duration: 4.5, // Optionnel: durée d'affichage (en secondes)
      });
      setIsModalVisible(false);
      console.error("Erreur lors de la mise à jour du menu", error);
    }
  };
  

  const handleOpenModal = async (menuId: string) => {
    setIsModalVisible(true);
    
    try {
        const data = await getRestData();
        const menu = data.Menus.find(m => m._id === menuId);
        if (menu) {
            setNomMenu(menu.Titre || '');
            setdescri(menu.Description || '');
            setPrix(menu.Prix || undefined);
            setSelectedArticleIds(menu.Articles || []); // S'assurer de mettre à jour avec les IDs existants
            setImg(menu.img || '');
        }
        setSelectedRecordId(menuId);
    } catch (error) {
        console.error('Erreur:', error);
    }
};
  
  // Fonction pour fermer le Modal
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    // Fonction pour charger les données
    const loadData = async () => {
        try {
            const data = await getRestData();
            setRestData(data); // Mettre à jour l'état avec les données reçues

        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            // Vous pouvez choisir de gérer les erreurs différemment ici
        }
    };
    
    loadData(); // Appeler la fonction au chargement du composant
}, []);

const handleModalContent = () => {
  if (!selectedRecordId) return null;

  const item = activeTab === "1"
    ? restData.Menus.find(menu => menu._id === selectedRecordId)
    : restData.Articles.find(article => article._id === selectedRecordId);

  if (!item) return <p>Élément introuvable.</p>;

  if ('Articles' in item) {
    // Pour un menu, affichez les articles en recherchant chaque titre dans le tableau des Articles
    return (
      <div className="container">
        <div className="left-content">
          {item.img && <img src={item.img} alt="Image" style={{ maxWidth: '100px' }} />}
          <Input titre='Nom' text={item.Titre} placeholder='' size='90' margintop='3'onChange={setNomMenu}/>
          <Input titre='Description' text={item.Description} placeholder='' size='90' margintop='3' onChange={setdescri}/>
          <Input titre='Prix' text={`${item.Prix}`} placeholder='' size='90' margintop='3' onChange={setPrix}/>

        </div>
        <div className="right-content">
          <Table rowSelection={rowSelection} columns={articleColumns} dataSource={articleData} pagination={false} size='middle' scroll={{ y: 500 }}/>
        </div>
      </div>
    );
  } else {
    // Affichage pour un Article
    return (
      <div>
        {item.img && <img src={item.img} alt={item.Titre} style={{ maxWidth: '100px' }} />}
        <Input titre='Nom' text={item.Titre} placeholder='' size='90' margintop='3'onChange={setNomMenu}/>
        <Input titre='Description' text={item.Description} placeholder='' size='90' margintop='3'onChange={setNomMenu}/>
        <Input titre='Prix' text={`${item.Prix}`} placeholder='' size='90' margintop='3'onChange={setNomMenu}/>
      </div>
    );
  }
};

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
              <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record._id)} style={{ margin: '0 8px' }} />
              <Button icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)} />
            </>
          ),
        },
      ];

  return (
    <div>
        <h1>Menus & Articles</h1>
        <Modal
        title="Détails"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Annuler
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleUpdateMenu()} >
            Enregistrer les modifications
          </Button>,
        ]}
      >
        {handleModalContent()}
      </Modal>

      <Tabs defaultActiveKey="1" onChange={setActiveTab}>
        <TabPane tab="Menus" key="1">
            <Table columns={columns} dataSource={restData.Menus} rowKey="Titre" />
        </TabPane>
        <TabPane tab="Articles" key="2">
            <Table columns={columns} dataSource={restData.Articles} rowKey="Titre"/>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default RestArticles;