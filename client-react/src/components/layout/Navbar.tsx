import {NavLink} from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import '../assets/styles/navbar.css'; 
import Icon from '@mdi/react';
import { mdiCartOutline  } from '@mdi/js';
import { mdiAccountOutline } from '@mdi/js';
import { mdiMapMarkerRadius } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';
import Panier from "../pages/Panier.tsx";
import {useState} from "react";
import {Button} from "antd";


const Navbar = () =>{
    const [drawerState, setDrawerState] = useState(false);
    const handleButtonClick = () => {
        setDrawerState(true); // This calls the setter without returning a value
    };

    return(
        <div className="bar">
            <div className="navbar-top-rectangle">
                <Icon path={mdiMapMarkerRadius} size={1} color={"white"}/>
                <button className="navbar-button">2 rue Doigby, Strasbourg</button>
                <Icon path={mdiChevronDown} size={1} color={"white"}/>
            </div>
            <div className="navbar-menu">
            <img src={Logo} className="logo" alt='logo'></img>
                <ul className="navbar-nav">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Accueil</NavLink>
                    </li>

                    <li>
                        <NavLink to="/Restaurants" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Restaurants</NavLink>
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