import { useEffect, useState, FunctionComponent } from "react";
import { useParams } from 'react-router-dom';
import { Col, Row, Spin } from 'antd';
import Restoheader from "../common/RestoHeader";
import "../assets/styles/restaurant.css";
import FilterBar from "../layout/FilterBar";
import RestoCard from "../common/RestoCard";
import { LoadingOutlined } from '@ant-design/icons';
import api from '../common/Api';

interface HorairesOuverture {
  Lundi: string;
  Mardi: string;
  Mercredi: string;
  Jeudi: string;
  Vendredi: string;
  Samedi: string;
  Dimanche: string;
}

interface Article {
  _id: string;
  Titre: string;
  Description: string;
  Prix: number;
  Catégorie: string;
  img: string;
}

interface Menu {
  _id: string;
  Titre: string;
  Description: string;
  Prix: number;
  Articles: string[]; 
  img: string;
}

interface Restaurant {
  _id: string;
  Nom: string;
  Telephone: string;
  Email: string;
  Categorie: string;
  img: string;
  HorairesOuverture: HorairesOuverture;
  Menus: Menu[];
  Articles: Article[];
}


const API_URL = 'http://localhost:3001/restaurant';

export const getRestaurant = async (id: string) => {
  try {
    const response = await api.get<Restaurant>(`${API_URL}/get/`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

const Restaurant: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>(); // Assurez-vous que les types correspondent
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tout");
  console.log(id);
  useEffect(() => {
    if (id) {
      getRestaurant(id).then(setRestaurant).catch(console.error);
    }
  }, [id]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  if (!restaurant) return <div className='loading'><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></div>;
  const categories = Array.from(new Set(restaurant.Articles.map((article) => article.Catégorie)));
  const displayAll = selectedCategory === "Tout";


  const displayItems = () => {
    if (displayAll) {
      // Si "Tout" est sélectionné, retourne les Menus suivis des Articles
      return (
        <>
        <div className="resto-cards-container">
          {restaurant.Menus.map((menu) => (
            <div key={menu._id}>
              <h1>Menus</h1>
              <RestoCard
              Titre={menu.Titre}
              Description={menu.Description}
              img={menu.img}
              propPadding="1.5rem 1.5rem 1.375rem 1.813rem"
              propGap="0.25rem"
              propGap1="0.938rem"
              propWidth="unset"
              propLineHeight="unset"
              propHeight="5.625re"
              propBackgroundImage={menu.img}
            />
              
              </div>
          ))}
          {restaurant.Articles.map((article) => (
            <div key={article._id}>
              <h1>{article.Catégorie}</h1>
              <RestoCard
              Titre={article.Titre}
              Description={article.Description}
              img={article.img}
              propPadding="1.5rem 1.5rem 1.375rem 1.813rem"
              propGap="0.25rem"
              propGap1="0.938rem"
              propWidth="unset"
              propLineHeight="unset"
              propHeight="5.625re"
              propBackgroundImage={article.img}
            />
              
              </div>
          ))}
          </div>
        </>
      );
    } else if (selectedCategory === "Menu") {
      // Affiche uniquement les menus si "Menu" est sélectionné
      return (
        <>
        <div className="resto-cards-container">
        {restaurant.Menus.map((menu) => (
        <div key={menu._id}>
          
          <h1>Menus</h1>
          <RestoCard
              Titre={menu.Titre}
              Description={menu.Description}
              img={menu.img}
              propPadding="1.5rem 1.5rem 1.375rem 1.813rem"
              propGap="0.25rem"
              propGap1="0.938rem"
              propWidth="unset"
              propLineHeight="unset"
              propHeight="5.625re"
              propBackgroundImage={menu.img}
            />
        
        </div>
        
      ))}</div></>
      )
    } else {
      // Sinon, filtre et affiche les articles en fonction de la catégorie sélectionnée
      return (
        <>
        <div className="resto-cards-container">
        {restaurant.Articles.filter((article) => article.Catégorie === selectedCategory).map((article) => (
        <div key={article._id}>
          
          <h1>{article.Catégorie}</h1>
          <RestoCard
              Titre={article.Titre}
              Description={article.Description}
              img={article.img}
              propPadding="1.5rem 1.5rem 1.375rem 1.813rem"
              propGap="0.25rem"
              propGap1="0.938rem"
              propWidth="unset"
              propLineHeight="unset"
              propHeight="5.625re"
              propBackgroundImage={article.img}
            />
          
          </div>
      ))}</div></>
      )
    }
  };
  //const filteredMenu = restodata.Menus;

  return (
    <div className="restaurant">
      <main className="restaurant1">
        <div className="fond-de-page" />
        <section className="frame-parent">
          <Restoheader categorie={restaurant.Categorie} restaurantName={restaurant.Nom} img={restaurant.img}/>

              <Row className="rowresto">
                <Col span={8} className="colresto">Carte de {restaurant.Nom}</Col>
                <Col span={8} className="colresto"></Col>
                <Col span={8} className="colresto">SearchBar</Col>
              </Row>

              <Row className="rowresto">
                <Col span={24} className="colfiltre">
                <FilterBar categories={categories} onCategoryChange={handleCategoryChange} />
                {displayItems()}
                </Col>
              </Row>
            

        </section>


      </main>
    </div>
  );
};

export default Restaurant;
