import '../assets/styles/navbar.css';
import '../assets/styles/home.css'
import { Col, Row } from 'antd';
import {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import Card from '../common/Card'
import RestoData from '../assets/FakeData/Resto.json';
import CategoriesDisplay from '../layout/CardDisplay';
import CookieConsent from '../common/CookieConsent';
import api from '../assets/api';
import Restaurant from "../pages/Restaurant";
import Icon from '@mdi/react';
import { mdiFood, mdiBasketCheck } from '@mdi/js';
import { mdiShieldStar, mdiMessageStar, mdiStar } from '@mdi/js';
import foodImage from '../assets/images/food-explosion.png';

const API_URL = 'http://localhost:3001/restaurant';

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
    const cacheKey = 'restaurantsCache';
  // Essayez de récupérer les données mises en cache
  const cachedData = localStorage.getItem(cacheKey);
  

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
            <div className="home-banner">
              <div className="home-banner-text">
                <div className="home- logo">
                  <span className="home-logo-g">G</span>
                  <span className="home-logo-faim">FAIM</span>
                </div>
                <p className="slogan">Quand le ventre réclame, notre service enflamme !</p>
                <p className="catchphrase">À chaque petit creux, G FAIM apporte le feu !</p>
                <div className="home-banner-actions">
                  {/* Ajoutez ici les boutons ou actions que vous souhaitez proposer à l'utilisateur */}
                </div>
              </div>
              <div className="home-banner-image">
                <img src={foodImage} alt="Explosion of food" />
              </div>
            </div>


            <Row className='SearchBarRow'>
                <Col span={24} className='SearchBarCol'>SearchBar</Col>
            </Row>

            <div className='Cate-pop'>

            <CategoriesDisplay
                    title="Restaurants populaires ✨"
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

            <div className="how-it-works">
              <h2>Comment ça marche ?</h2>
              <h1>C'est très simple !</h1>

              <div className="how-it-works-steps">
                <div className="step">
                  <Icon path={mdiFood} size={2} className="icon" />
                  <h3>Trouvez ce dont vous avez envie</h3>
                  <p>Cherchez par article ou repas, par partenaire ou type de cuisine.</p>
                </div>
                
                <div className="step">
                  <Icon path={mdiBasketCheck} size={2} className="icon" />
                  <h3>Commandez à livrer</h3>
                  <p>Nous vous tiendrons au courant du déroulement de votre commande.</p>
                </div>
              </div>
            </div>

            <div className="benefits">
              <h2>G FAIM</h2>
              <h1>Le meilleur endroit pour commander !</h1>

              <div className="benefits-cards">
                <div className="card">
                  <div className="icon-container">
                    <Icon path={mdiShieldStar} size={2} className="icon" />
                  </div>
                  <div className="content-container">
                    <h3>Programmes de fidélité</h3>
                    <p>Cumulez des points à chaque commande et obtenez des récompenses.</p>
                    <p>Offres exclusives pour les membres.</p>
                  </div>
                </div>

                <div className="card">
                  <div className="icon-container">
                    <Icon path={mdiMessageStar} size={2} className="icon" />
                  </div>
                  <div className="content-container">
                    <h3>Notre garantie</h3>
                    <p>Un service d'exception à chaque commande.</p>
                    <p>Satisfaction garantie.</p>
                  </div>
                </div>

                <div className="card">
                  <div className="icon-container">
                    <Icon path={mdiStar} size={2} className="icon" />
                  </div>
                  <div className="content-container">
                    <h3>Vos avantages</h3>
                    <p>Commandez quand vous voulez et où vous voulez.</p>
                    <p>Large choix de cuisines et de restaurants.</p>
                  </div>
                </div>
              </div>
            </div>

        </div>
        </>
        
            
    );
}

export default Home;