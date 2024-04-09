import React, { useEffect, useState } from 'react';
import { Tabs, Table, Switch, Button, Modal, Row, Col, Checkbox, notification, Radio, Input, Select  } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../assets/api.ts';
import InputC from '../common/Input.tsx';
import '../assets/styles/restarticle.css'; 
import { log } from 'console';
import DefaultButton from '../common/DefaultButton.tsx';

const { Option } = Select;
const { TabPane } = Tabs;
const API_URL = 'http://localhost:3001/restaurant';

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

interface Categorie {
  key: string;
  name: string;
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

export const putArticleData = async (articleId: string, data: Partial<Article>) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.put(`${API_URL}/modify/article/${articleId}`, data, { // Correction ici
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    throw error;
  }
};

export const deleteMenuData = async (menuId:string) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.delete(`${API_URL}/delete/menu/${menuId}`, {
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression du menu:', error);
    throw error;
  }
};

export const deleteArticleData = async (articleId:string) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.delete(`${API_URL}/delete/article/${articleId}`, {
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    throw error;
  }
};

export const addMenuData = async (data: Partial<Menu>) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.post(`${API_URL}/create/menu`, data, { 
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de lajout du menu:', error);
    throw error;
  }
};

export const addArticleData = async (data: Partial<Article>) => {
  const token = localStorage.getItem('accessToken');
  const restid = localStorage.getItem('restaurantId');
  try {
    const response = await api.post(`${API_URL}/create/article`, data, { 
      params: {id: restid},
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de lajout de larticle:', error);
    throw error;
  }
};





const RestArticles = () => {
  const [Articles, setSelectedArticleIds] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("1");
  const [restData, setRestData] = useState<{ Menus: Menu[]; Articles: Article[] }>({ Menus: [], Articles: [] });
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [Titre, setNomMenu] = useState('');
  const [Description, setdescri] = useState('');
  const [Prix, setPrix] = useState<number | undefined>(undefined);
  const [Img, setImg] = useState('');

  const disableMenusWithArticle = async (articleId, menus) => {
    const affectedMenus = menus.filter(menu => menu.Articles.includes(articleId) && menu.activ);
  
    if (affectedMenus.length > 0) {
      for (const menu of affectedMenus) {
        // Ici, assurez-vous d'inclure toutes les données nécessaires pour la mise à jour
        const updatedMenuData = { ...menu, activ: false };
        await putMenuData(menu._id, updatedMenuData);
  
        // Mettre à jour l'état local pour refléter le changement
        setRestData(prev => ({
          ...prev,
          Menus: prev.Menus.map(m => m._id === menu._id ? updatedMenuData : m)
        }));
      }
  
      notification.info({
        message: 'Des menus ont été désactivés',
        description: `La désactivation de l'article a entraîné la désactivation de certains menus.`,
      });
    }
  };
  
  

  const handleSwitchChange = async (checked, record) => {
    // Détermine si nous travaillons avec un article ou un menu basé sur le TabPane actif
    const isArticle = activeTab === "2"; // Adaptez selon les valeurs de vos clés TabPane
  
    try {
      if (isArticle) {
        // Mise à jour d'un article
        await putArticleData(record._id, { activ: checked });
        
        // Mettre à jour l'état local pour refléter le changement d'article immédiatement
        setRestData(prev => ({
          ...prev, 
          Articles: prev.Articles.map(item => item._id === record._id ? { ...item, activ: checked } : item)
        }));
  
        // Désactivation des menus si l'article est désactivé
        if (!checked) {
          disableMenusWithArticle(record._id, restData.Menus);
        }
      } else {
        // Mise à jour d'un menu nécessitant toutes les données existantes plus le changement d'état 'activ'
        const updatedMenuData = { ...record, activ: checked }; // Ici, vous pouvez inclure toutes les données du menu
  
        await putMenuData(record._id, updatedMenuData);
  
        // Mettre à jour l'état local pour refléter le changement de menu immédiatement
        setRestData(prev => ({
          ...prev, 
          Menus: prev.Menus.map(menu => menu._id === record._id ? updatedMenuData : menu)
        }));
      }
  
      notification.success({
        message: `${isArticle ? 'L\'article' : 'Le menu'} a été ${checked ? 'activé' : 'désactivé'} avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      notification.error({
        message: 'Erreur lors de la mise à jour',
        description: 'Une erreur est survenue lors de la mise à jour.',
      });
    }
  };
  
  
  

  const onSelectChange = (selectedRowKeys:any) => {
    setSelectedArticleIds(selectedRowKeys);
  };

  const handleCreateNew = () => {
    setIsEditMode(false);
    setSelectedRecordId(null);
    resetFormFields(); // Cette fonction réinitialise tous les champs
    setIsModalVisible(true);
    console.log("IsEditMode:",isEditMode)
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

  const categoryColumns = [
    {
      title: 'Catégorie',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record: Categorie) => (
        <Radio.Group value={categories} onChange={e => setCategories(e.target.value)}>
          <Radio value={record.name}>{record.name}</Radio>
        </Radio.Group>
      ),
    },
  ];
  const handleDelete = async (menuId:string)=>{
    try {
      if (activeTab === "1" && menuId) { 
        await deleteMenuData(menuId);
        notification.success({
          message: 'Mise à jour réussie',
          description: 'Le menu à été supprimé avec succès.',
          placement: 'topRight',
          duration: 4.5,
        });
      } else if (activeTab === "2" && menuId) { 
        await deleteArticleData(menuId);
        notification.success({
          message: 'Mise à jour réussie',
          description: 'L\'article à été supprimé avec succès.',
          placement: 'topRight',
          duration: 4.5,
        });
      }

      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Erreur lors de la mise à jour',
        description: 'Une erreur est survenue lors de la mise à jour.',
        placement: 'topRight', // Optionnel: position de la notification
        duration: 4.5, // Optionnel: durée d'affichage (en secondes)
      });
      setIsModalVisible(false);
      console.error("Erreur lors de la mise à jour du menu", error);
    }
  }
  const handleUpdateMenu = async () => {
    // Créez un objet de mise à jour basé uniquement sur les champs modifiés
    const updatedFields: { [key: string]: any } = {};
    if (Titre !== '') updatedFields.Titre = Titre;
    if (Description !== '') updatedFields.Description = Description;
    if (Prix !== undefined) updatedFields.Prix = Prix;
    updatedFields.img = Img;
    updatedFields.Articles = Articles;
    updatedFields.Catégorie = selectedCategory 
    Object.keys(updatedFields).forEach(key => updatedFields[key] === undefined && delete updatedFields[key]);

    
    try {
      if (!isEditMode) {
        if (activeTab === "1") { // Création d'un nouveau menu
          
          updatedFields.Articles = Articles;
          console.log("updatedFields avant l'ajout :", updatedFields);
          await addMenuData(updatedFields);
        } else if (activeTab === "2") { // Création d'un nouvel article
          await addArticleData(updatedFields);
        }
        notification.success({
          message: 'Création réussie',
          description: `Le ${activeTab === "1" ? 'menu' : 'article'} a été créé avec succès.`,
          placement: 'topRight',
          duration: 4.5,
        });
      }
      else{
      if (activeTab === "1" && selectedRecordId) { // Supposons que "1" est l'ID de l'onglet pour les menus
        updatedFields.Articles = Articles;
        await putMenuData(selectedRecordId, updatedFields);
        notification.success({
          message: 'Mise à jour réussie',
          description: 'Le menu a été mis à jour avec succès.',
          placement: 'topRight',
          duration: 4.5,
        });
      } else if (activeTab === "2" && selectedRecordId) { // Supposons que "2" est l'ID de l'onglet pour les articles
        // Note: assurez-vous que la logique de sélection et de mise à jour des articles est adaptée à vos besoins
        await putArticleData(selectedRecordId, updatedFields);
        notification.success({
          message: 'Mise à jour réussie',
          description: 'L\'article a été mis à jour avec succès.',
          placement: 'topRight',
          duration: 4.5,
        });
      }
    }
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Erreur lors de la mise à jour',
        description: 'Une erreur est survenue lors de la mise à jour.',
        placement: 'topRight', // Optionnel: position de la notification
        duration: 4.5, // Optionnel: durée d'affichage (en secondes)
      });
      setIsModalVisible(false);
      console.error("Erreur lors de la mise à jour du menu", error);
    }
  };
  

  const handleOpenModal = async (id?: any) => {
    setIsModalVisible(true);
    if (isEditMode) {
        try {
            const data = await getRestData();
            console.log("data:",data)
            let item;
            if (activeTab === "1") {
                item = data.Menus.find(m => m._id === id);
            } else if (activeTab === "2") {
                item = data.Articles.find(a => a._id === id);
            }
            if (item) {
                setNomMenu(item.Titre);
                setdescri(item.Description);
                setPrix(item.Prix);
                setSelectedArticleIds(item.Articles || []);
                setImg(item.img);
            }
        } catch (error) {
            console.error('Erreur:', error);
        }
    } else if (!isEditMode){
        // Mode création: Réinitialisation des champs
        resetFormFields();
    }
    setSelectedRecordId(id);
};


const resetFormFields = () => {
  setNomMenu('');
  setdescri('');
  setPrix(undefined);
  setSelectedArticleIds([]);
  setImg('');
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

useEffect(() => {
  const uniqueCategories = new Set(restData.Articles.map(article => article.Catégorie));
  setCategories([...uniqueCategories]);
  console.log("uniqueCategories",restData.Articles)
}, [restData.Articles]);

const handleAddCategory = (newCat: string) => {
  if (newCat && !categories.includes(newCat)) {
    setCategories(prev => [...prev, newCat]);
    setSelectedCategory(newCat);
    // Ajoutez ici la logique pour persister la nouvelle catégorie dans votre backend si nécessaire
  }
};

const handleModalContent = () => {
  // Rendre conditionnellement les Inputs en fonction du mode d'édition ou de création.
  const item = selectedRecordId
    ? activeTab === "1"
      ? restData.Menus.find(menu => menu._id === selectedRecordId)
      : restData.Articles.find(article => article._id === selectedRecordId)
    : null;

  return (
    <div className="container">
      <div className="left-content">
        <img src={item?.img || Img} alt="Aperçu" style={{ maxWidth: '100px' }} />
        <InputC titre='Nom' text={item?.Titre ?? ''} placeholder='Nom' size='90' margintop='3' onChange={(e) => setNomMenu(e)} />
        <InputC titre='Description' text={item?.Description ?? ''} placeholder='Description' size='90' margintop='3' onChange={(e) => setdescri(e)} />
        <InputC titre='Prix' text={item?.Prix ? item.Prix.toString() : ''} placeholder='Prix' size='90' margintop='3' onChange={(e) => setPrix(Number(e))} />

        </div>
        {activeTab === "1" && (
          <div className="right-content">
            <Table rowSelection={rowSelection} columns={articleColumns} dataSource={articleData} pagination={false} size='middle' scroll={{ y: 500 }}/>
          </div>
        )}

        {activeTab === "2" && (
          <div className="right-content">
            <Select
          style={{ width: 400 }}
          placeholder="Sélectionner une catégorie"
          value={selectedCategory}
          onChange={value => setSelectedCategory(value)}
          dropdownRender={menu => (
            <>
              {menu}
              <div style={{ display: 'flex', padding: 8 }}>
                <Input
                  style={{ flex: 'auto' }}
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                />
                <Button
                  type="link"
                  onClick={() => handleAddCategory(newCategoryName)}
                >
                  Ajouter
                </Button>
              </div>
            </>
          )}
        >
          {categories.map(cat => (
            <Option key={cat}>{cat}</Option>
          ))}
        </Select>
          </div>
        )}
      
    </div>
  );
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
              <Switch
                  checkedChildren="Activé"
                  unCheckedChildren="Désactivé"
                  checked={record.activ}
                  onChange={(checked) => handleSwitchChange(checked, record)}
                />
              <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record._id)} style={{ margin: '0 8px' }} />
              <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <DefaultButton 
              text="+" 
              textColor="FFFFFF" 
              textSize="1rem" 
              bgColor="298029" 
              width="40px" 
              marginLeft="10px" 
              marginRight="10px"
              onClick={handleCreateNew} 
            />
          </div>
            <Table columns={columns} dataSource={restData.Menus} rowKey="Titre" />
        </TabPane>
        <TabPane tab="Articles" key="2">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
            <DefaultButton 
              text="+" 
              textColor="FFFFFF" 
              textSize="1rem" 
              bgColor="298029" 
              width="40px" 
              marginLeft="10px" 
              marginRight="10px"
              onClick={handleCreateNew} 
            />
          </div>
            <Table columns={columns} dataSource={restData.Articles} rowKey="Titre"/>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default RestArticles;