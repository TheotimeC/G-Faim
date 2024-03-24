import React from 'react';
import {NavLink} from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import Loc from '../assets/images/marker.svg'
import User from '../assets/images/user.svg'
import Cart from '../assets/images/shopping-cart.svg'
import Arrow from '../assets/images/angle-small-down.svg'
import '../assets/styles/navbar.css'; 

const Navbar = () =>{
    
    return(
        <div className="bar">
            <div className="navbar-top-rectangle">
                <div className='icon'><img src={Loc}/></div>
                <button className="navbar-button">2 rue Doigby, Strasbourg</button>
                <div className='icon'><img src={Arrow}/></div>
            </div>
            <div className="navbar-menu">
            <img src={Logo} className="logo"></img>
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
                        <NavLink to="/Restaurants" className="icon-link"> 
                            <div className="icon-background">
                                <img src={Cart} alt="Icone 2" className="navbar-icon" />
                            </div>
                        </NavLink>
                    </li>   

                    <li>
                        <NavLink to="/Restaurants" className="icon-link">
                            <div className="icon-background">
                                <img src={User} alt="Icone 2" className="navbar-icon" />
                            </div>
                        </NavLink>
                    </li>
                </ul>
            </div>  
        </div>
    )
}

export default Navbar