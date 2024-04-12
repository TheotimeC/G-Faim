import {NavLink} from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import '../assets/styles/navbar.css'; 
import Icon from '@mdi/react';
import { mdiCartOutline  } from '@mdi/js';
import { mdiAccountOutline } from '@mdi/js';
import { mdiMapMarkerRadius } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import Panier from "../pages/Panier.tsx";
import {useState, useEffect} from "react";
import {Button, message, Menu, Modal, Radio, Input, Form} from "antd";
import api from '../assets/api.ts';

const API_URL = 'http://localhost:3000/user';
export interface Adresse {
    adresse: string;
    code_postal: string;
    ville: string;
    pays: string;
  }

export const putUser = async (id: string, data: Partial<Adresse>) => {
    const cacheKey = 'userCache';
    try {
      const token = localStorage.getItem('accessToken')
      console.log("data",data)
      const response = await api.put(`${API_URL}/modify/addr/?id=${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
      throw error;
    }
  };

const Navbar = () =>{
    const [drawerState, setDrawerState] = useState(false);
    const [addresses, setAddresses] = useState<Adresse[]>([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [selectedAddressName, setSelectedAddressName] = useState('Sélectionner une adresse');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
      const fetchUserData = async () => {
          const userDataString = localStorage.getItem('userCache');
          if (userDataString) {
              const userData = JSON.parse(userDataString);
              setAddresses(userData.adresses_de_livraison || []);
  
              // Déterminez quelle adresse est actuellement active
              let activeAddress = localStorage.getItem('activeAddressId');
              if (!activeAddress && userData.adresses_de_livraison && userData.adresses_de_livraison.length > 0) {
                  activeAddress = userData.adresses_de_livraison[0]._id;
                  localStorage.setItem('activeAddressId', activeAddress);
              }
  
              // Mettre à jour l'état avec l'adresse active
              setSelectedAddressId(activeAddress);
              const activeAddrObj = userData.adresses_de_livraison.find(addr => addr._id === activeAddress);
              if (activeAddrObj) {
                  setSelectedAddressName(`${activeAddrObj.adresse}, ${activeAddrObj.ville}`);
              }
          }
      };
  
      fetchUserData();
  }, []);
  

  const handleAddressSelectionChange = (e) => {
    const addressId = e.target.value;
    const selected = addresses.find(address => address._id === addressId);
    if (selected) {
        setSelectedAddress(addressId);
        setSelectedAddressName(`${selected.adresse}, ${selected.code_postal}, ${selected.ville}, ${selected.pays}`);
        localStorage.setItem('activeAddressId', addressId); // Sauvegarder l'adresse active dans le localStorage
    }
};


    

    const handleButtonClick = () => {
        setDrawerState(true); // This calls the setter without returning a value
    };
    const handleMenuClick = (e) => {
        message.info(`Nouvelles adresse sélectionnée`);
        console.log('Adresse sélectionnée', e);
    };

    const handleSubmit = () => {
        form
          .validateFields()
          .then(async (values) => {
            // Récupération de l'ID utilisateur et des données depuis le cache local
            const userDataString = localStorage.getItem('userCache');
            const userData = userDataString ? JSON.parse(userDataString) : null;
    
            if (userData && userData._id) {
              try {
                // Construction de l'objet avec les nouvelles données, y compris la nouvelle adresse
                const updatedUser = { ...userData, adresses_de_livraison: [...userData.adresses_de_livraison, values] };
    
                // Mise à jour de l'utilisateur avec la nouvelle adresse et toutes les autres informations
                const updatedUserData = await putUser(userData._id, updatedUser);
    
                // Mise à jour du cache local avec les nouvelles données utilisateur
                localStorage.setItem('userCache', JSON.stringify(updatedUserData));
                setAddresses(updatedUserData.adresses_de_livraison); // Met à jour les adresses dans l'état local
                message.success("Adresse ajoutée avec succès.");
    
                form.resetFields(); // Réinitialise les champs du formulaire
                setIsModalVisible(false); // Ferme le modal
              } catch (error) {
                console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
                message.error("Erreur lors de l'ajout de l'adresse.");
              }
            }
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
    };
    
    
      
    return(
        <div className="bar">
            <div className="navbar-top-rectangle">
            <Button type="primary" onClick={() => setIsModalVisible(true)} className='bouton-addrr'>
            <Icon path={mdiMapMarkerRadius} title="User Profile" size={1} color="white" />
            {selectedAddressName || "Sélectionner une adresse"}
            </Button>
            <Modal
  title="Gérer les adresses de livraison"
  visible={isModalVisible}
  onOk={() => {
    form
      .validateFields()
      .then(() => {
        // Ici, vous pouvez traiter l'ajout de l'adresse si besoin avant de fermer le modal
        form.resetFields(); // Réinitialiser le formulaire
        setIsModalVisible(false); // Fermer le modal
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }}
  onCancel={() => setIsModalVisible(false)}
  okText="Ajouter"
  cancelText="Annuler"
>
  {/* Liste des adresses avec sélection radio */}
  <Radio.Group onChange={handleAddressSelectionChange} value={selectedAddressId} style={{ marginBottom: '20px' }}>
  {addresses.map((address, index) => (
    <Radio key={address._id} value={address._id} style={{ display: 'block', marginBottom: '10px' }}>
      {`${address.adresse}, ${address.code_postal}, ${address.ville}, ${address.pays}`}
    </Radio>
  ))}
</Radio.Group>

  {/* Formulaire pour ajouter une nouvelle adresse */}
  <Form form={form} layout="vertical" name="address_form" onFinish={handleSubmit}>
    <Form.Item
      name="adresse"
      label="Nouvelle adresse"
      rules={[{ required: true, message: 'Veuillez saisir l\'adresse!' }]}
    >
      <Input />
    </Form.Item>
    {/* Répétez pour code_postal, ville, pays */}
    {/* Le bouton pour ajouter une nouvelle adresse n'est plus nécessaire ici, car le bouton "OK" du modal gère l'action */}
  </Form>
</Modal>

    
            </div>
            <div className="navbar-menu">
            <img src={Logo} className="logo" alt='logo'></img>
                <ul className="navbar-nav">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Accueil</NavLink>
                    </li>

                    <li>
                        <NavLink to="/Restaurants" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Parcourir</NavLink>
                    </li>

                    <li>
                        <NavLink to="/Commandes" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Commandes</NavLink>
                    </li>
                     
                    <li>
                            <div className="icon-background">
                                <Button onClick={handleButtonClick} style={{backgroundColor: "green", border:"green"}} icon={<Icon path={mdiCartOutline} size={1} color="white"/>}/>
                            </div>
                    </li>
                    <li>
                        <NavLink to="/profil" className="icon-link">
                            <div className="icon-background">
                                <Icon path={mdiAccountOutline} size={1} color={"white"}/>
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </div>
            <Panier drawerState={drawerState} setDrawerState={setDrawerState} />
        </div>
    )
}

export default Navbar