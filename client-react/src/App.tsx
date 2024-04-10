import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './components/assets/Auth.tsx';

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
//composants admin
import Admin from './components/pages/Admin.tsx';
function App() {
  const { isAuthenticated, role } = useAuth();
  const isRestaurateur = isAuthenticated && role === 'restaurateur';
  const isLivreur = isAuthenticated && role === 'livreur';
  const isAdmin = isAuthenticated && role === 'admin';
  const isClient = isAuthenticated && role === 'client';

  return (
    <>
      <Router>
        {/* Affiche la Navbar appropriée en fonction du rôle */}
        { !isRestaurateur && !isLivreur && !isAdmin && !isAuthenticated&&<Navbar />}
        {isAuthenticated && isRestaurateur && <RestNav />}
        {isAuthenticated && isAdmin && <Admin />}
        {isAuthenticated && isLivreur && <LivNav />}

        <Routes>
          {/* Routes accessibles à tous les utilisateurs y compris les clients déconnectés */}
          {!isRestaurateur && !isLivreur && !isAdmin && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/restaurants" element={<Parcourir />} />
                <Route path="/restaurants/:id" element={<Restaurant />} />
                <Route path="/commandes" element={<Commandes />} />
                <Route path="/connexion" element={!isAuthenticated ? <Connection /> : <Navigate replace to="/" />} />
                <Route path="/profil" element={isAuthenticated ? <Profil /> : <Navigate replace to="/connexion" />} />
              </>
            )}
          {/* Routes spécifiques pour les restaurateurs */}
          {isRestaurateur && (
            <Route path="/dashboard" element={<Navigate replace to="/dashboard" />} />
          )}

          {/* Routes spécifiques pour les livreurs */}
          {isLivreur && (
            <Route path="/livraison" element={<Navigate replace to="/livraison" />} />
          )}

          {/* Routes spécifiques pour les admins */}
          {isAdmin && (
            <Route path="/admin" element={<Navigate replace to="/admin" />} />
          )}

          {/* Redirection par défaut pour sécuriser les routes non autorisées */}
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Router>
      {!isRestaurateur && !isLivreur && !isAdmin && (
               <Footer />
            )}
     
    </>
  );
}

export default App;