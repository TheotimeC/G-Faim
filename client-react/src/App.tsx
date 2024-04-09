import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../src/components/common/Auth.tsx';

// Composants Client
import Home from './components/pages/Home';
import Parcourir from './components/pages/Parcourir';
import Commandes from './components/pages/Commandes';
import Profil from './components/pages/Profil';
import Connection from "./components/pages/Connection";
import Restaurant from './components/pages/Restaurant';
// Composants Restaurateur
import RestHome from './components/pages/Rest_Home';
import RestNav from './components/layout/Rest_Navbar.tsx';
// Composants Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/common/Footer";
//Composants livreur
import LivNav from './components/layout/Liv_NavBar.tsx';
import Liv_Accueil from './components/pages/Liv_Accueil';
//import Liv_Livraison from './components/pages/Liv_Livraison';
//import Liv_Profil from './components/pages/Liv_Profil';

function App() {
  const { isAuthenticated, role } = useAuth();
  const isRestaurateur = isAuthenticated && role === 'restaurateur';
  const isLivreur = isAuthenticated && role === 'livreur';

  return (
    <>
      <Router>
        {/* Affichez la Navbar appropriée en fonction du rôle */}
        { !isRestaurateur && !isLivreur && <Navbar />}
        {isAuthenticated && isRestaurateur && <RestNav />}

        
        {isAuthenticated && isLivreur && <LivNav />}
        
        <Routes>
          {/* Routes accessibles à tous */}
          <Route path="/connexion" element={<Connection />} />
          
          {/* Routes pour les clients */}
          {!isRestaurateur && !isLivreur && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/restaurants" element={<Parcourir />} />
              <Route path="/Restaurants/:id" element={<Restaurant />} />
              <Route path="/commandes" element={<Commandes />} />
              <Route path="/profil" element={isAuthenticated ? <Profil /> : <Navigate replace to="/connexion" />} />
            </>
          )}
          
          {/* Routes spécifiques pour les restaurateurs */}
          {isRestaurateur && (
            <>
              {/* Ajoutez ici d'autres routes spécifiques aux restaurateurs */}
              <Route path="*" element={<Navigate replace to="/dashboard/" />} />
            </>
          )}

          {isLivreur && (
            <>
              {/* Ajoutez ici d'autres routes spécifiques aux livreurs */}
              <Route path="*" element={<Navigate replace to="/livraison/" />} />
              {/*<Route path="/livreur" element={<Liv_Accueil />} />*/}
              {/*<Route path="/livreur/livraisons" element={<Liv_Livraison />} />*/}
              {/*<Route path="/livreur/profil" element={<Liv_Profil />} />*/}
              {/*<Route path="/livraison/*" element={<Navigate replace to="/livraison/accueil" />} />*/}
            </>
          )}

          {/* Redirections basées sur l'authentification et le rôle */}
          <Route path="*" element={!isAuthenticated ? <Navigate replace to="/connexion" /> : <Navigate replace to="/" />} />
        </Routes>
      </Router>
      
      <footer>
        {!isAuthenticated || !isRestaurateur && !isLivreur &&  <Footer />}
      </footer>
    </>
  );
}

export default App;
