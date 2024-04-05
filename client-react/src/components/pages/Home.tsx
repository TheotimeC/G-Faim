import '../assets/styles/navbar.css';
import '../assets/styles/home.css'
import { Col, Row } from 'antd';
import {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import Card from '../common/Card'
import RestoData from '../assets/FakeData/Resto.json';
import CategoriesDisplay from '../layout/CardDisplay';
import CookieConsent from '../common/CookieConsent';
import api from '../common/api';
import Restaurant from "../pages/Restaurant";

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
const Home = () =>{
    const [selectedRestId, setSelectedRestId] = useState<string | null>(null);
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

    useEffect(() => {
        // Appel pour obtenir tous les restaurants sans vérifier `id_params`
        getAllRestaurants().then(data => setRestaurants(data)).catch(console.error);
      }, []);

      const handleCardClick = (id: string) => {
        setSelectedRestId(id); // Définir l'ID du restaurant sélectionné
    };

    return(
        <>
        <CookieConsent />
        <div>
            
            <Row className='SearchBarRow'>
                <Col span={24} className='SearchBarCol'>SearchBar</Col>
            </Row>

            <div className='Cate-pop'>

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
        
            </div>

            

        </div>
        </>
        
            
    );
}

export default Home;