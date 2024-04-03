import {NavLink} from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import '../assets/styles/navbar.css'; 
import Icon from '@mdi/react';
import { mdiCartOutline  } from '@mdi/js';
import { mdiAccountOutline } from '@mdi/js';
import { mdiMapMarkerRadius } from '@mdi/js';
import { mdiChevronDown } from '@mdi/js';

const Navbar = () =>{
    
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
                        <NavLink to="/Restaurants" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Parcourir</NavLink>
                    </li>

                    <li>
                        <NavLink to="/Commandes" className={({ isActive }) => isActive ? "a activeLink" : "a"}> Commandes</NavLink>
                    </li>
                     
                    <li>
                        <NavLink to="/Restaurants" className="icon-link"> 
                            <div className="icon-background">
                            <Icon path={mdiCartOutline} size={1} color={"white"}/>
                            </div>
                        </NavLink>
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
        </div>
    )
}

export default Navbar