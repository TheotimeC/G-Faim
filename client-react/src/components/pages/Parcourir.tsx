import React, { useEffect, useState } from "react";
import {NavLink} from 'react-router-dom';
import Card from "../common/Card";
import CategoriesDisplay from "../layout/CardDisplay";
import Restaurant from "../pages/Restaurant";
import api from '../assets/api.ts';

const API_URL = 'http://localhost:3001/restaurant';

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
    const cacheKey = 'restaurantsCache';
  // Essayez de récupérer les données mises en cache
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Parse et retourne les données mises en cache si disponibles
  }

  try {
    const response = await api.get<Restaurant[]>(`${API_URL}/getAll`);
    // Assurez-vous que ceci est bien un tableau de `Restaurant[]`
    localStorage.setItem(cacheKey, JSON.stringify(response.data)); // Mettre en cache les nouvelles données
    return response.data;
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
    const Francerestaurants = restaurants.filter(restaurant => restaurant.Categorie === "Cuisine Française");
    const brassrestaurants = restaurants.filter(restaurant => restaurant.Categorie === "Brasserie");
    const Pizzarestaurants = restaurants.filter(restaurant => restaurant.Categorie === "Pizzeria");
    const Mexicrestaurants = restaurants.filter(restaurant => restaurant.Categorie === "Cuisine Mexicaine");
    const Sushirestaurants = restaurants.filter(restaurant => restaurant.Categorie === "Sushi");
    // Si un restaurant est sélectionné, affichez le composant Restaurant, sinon le contenu par défaut
    if (selectedRestId) {
        return <Restaurant/>;
    } else {
        return (
            <div>
                <CategoriesDisplay
                    title="Restaurants Français 🥐"
                    data={Francerestaurants}
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
                    title="Brasseries 🍻"
                    data={brassrestaurants}
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
                    title="Cuisine Mexicaine 🌮"
                    data={Mexicrestaurants}
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
                    title="Pizzeria 🍕"
                    data={Pizzarestaurants}
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
                    title="Sushi 🍣"
                    data={Sushirestaurants}
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
