import React, { useEffect, useState } from "react";
import {NavLink} from 'react-router-dom';
import Card from "../common/Card";
import CategoriesDisplay from "../layout/CardDisplay";
import Restaurant from "../pages/Restaurant";
import axios from 'axios';

const API_URL = 'http://localhost:3001/restaurant';

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
    try {
      const response = await axios.get<Restaurant[]>(`${API_URL}/getAll`);
      return response.data; // Assurez-vous que ceci est bien un tableau de `Restaurant[]`
    } catch (error) {
      console.error('Erreur lors de la récupération des restaurants:', error);
      throw error;
    }
  };

const Restaurants = () => {
    const [selectedRestId, setSelectedRestId] = useState<string | null>(null); // Initialise à null
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        // Appel pour obtenir tous les restaurants sans vérifier `id_params`
        getAllRestaurants().then(data => setRestaurants(data)).catch(console.error);
      }, []);
    // Fonction pour gérer le clic sur une carte
    const handleCardClick = (id: string) => {
        setSelectedRestId(id); // Définir l'ID du restaurant sélectionné
    };

    // Si un restaurant est sélectionné, affichez le composant Restaurant, sinon le contenu par défaut
    if (selectedRestId) {
        return <Restaurant/>;
    } else {
        return (
            <div>
                <CategoriesDisplay
                    title="Restaurants populaires"
                    data={restaurants}
                    renderItem={(item) => (
                        <NavLink 
                            key={item._id} 
                            to={`/Restaurants/${item._id}`} 
                            className={({ isActive }) => isActive ? "activeLink" : ""}
                            >
                            
                        <Card
                            title={item.Nom}
                            subtitle={item.Categorie}
                            img={item.img}
                            onClick={() => handleCardClick(item._id)}
                        />
                        </NavLink>
                    )}
                />
                <CategoriesDisplay
                    title="Restaurants Italiens"
                    data={restaurants}
                    renderItem={(item) => (
                        <NavLink 
                            key={item._id} 
                            to={`/Restaurants/${item._id}`} 
                            className={({ isActive }) => isActive ? "activeLink" : ""}
                            >
                            
                        <Card
                            title={item.Nom}
                            subtitle={item.Categorie}
                            img={item.img}
                            onClick={() => handleCardClick(item._id)}
                        />
                        </NavLink>
                    )}
                />
                <CategoriesDisplay
                    title="Restaurants Vegans"
                    data={restaurants}
                    renderItem={(item) => (
                        <NavLink 
                            key={item._id} 
                            to={`/Restaurants/${item._id}`} 
                            className={({ isActive }) => isActive ? "activeLink" : ""}
                            >
                            
                        <Card
                            title={item.Nom}
                            subtitle={item.Categorie}
                            img={item.img}
                            onClick={() => handleCardClick(item._id)}
                        />
                        </NavLink>
                    )}
                />
            </div>
        );
    }
};

export default Restaurants;