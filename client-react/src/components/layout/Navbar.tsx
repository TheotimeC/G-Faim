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
import {Button, Dropdown, message, Space, Tooltip, Menu} from "antd";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const Navbar = () =>{
    const [drawerState, setDrawerState] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [firstAddress, setFirstAddress] = useState('Adresses');


    useEffect(() => {
        // Récupération des données utilisateur depuis le localStorage
        const userDataString = localStorage.getItem('userCache');
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData.adresses_de_livraison && userData.adresses_de_livraison.length > 0) {
                setFirstAddress(userData.adresses_de_livraison[0].adresse);
            }
            // Construction des items de menu à partir des adresses de livraison
            const items = userData.adresses_de_livraison.map(adresse => ({
                label: adresse.adresse,
                key: adresse._id,
    
            }));

            setMenuItems(items);
        }
    }, []);

    const handleButtonClick = () => {
        setDrawerState(true); // This calls the setter without returning a value
    };
    const handleMenuClick = (e) => {
        message.info(`Nouvelles adresse sélectionnée`);
        console.log('Adresse sélectionnée', e);
    };

    const menu = (
        <Menu
            items={menuItems}
            onClick={handleMenuClick}
        />
    );
      
      
    return(
        <div className="bar">
            <div className="navbar-top-rectangle">
                <Dropdown overlay={menu} className='dropnav'>
                    
                    <Button className="navbar-button">
                        <Space>
                        <Icon path={mdiMapMarkerRadius} size={1} color={"white"}/>
                        {firstAddress}
                        <DownOutlined />
                        </Space>
                    </Button>
                    </Dropdown>
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