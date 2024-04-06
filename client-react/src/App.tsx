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

function App() {
  const { isAuthenticated, role } = useAuth();
  const isRestaurateur = isAuthenticated && role === 'restaurateur';

  return (
    <>
      <Router>
        {/* Affichez la Navbar appropriée en fonction du rôle */}
        {!isAuthenticated && !isRestaurateur && <Navbar />}
        {isAuthenticated && isRestaurateur && <RestNav />}
        
        <Routes>
          {/* Routes accessibles à tous */}
          <Route path="/connexion" element={<Connection />} />
          
          {/* Routes pour les clients */}
          {!isRestaurateur && (
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

          {/* Redirections basées sur l'authentification et le rôle */}
          <Route path="*" element={!isAuthenticated ? <Navigate replace to="/connexion" /> : <Navigate replace to="/" />} />
        </Routes>
      </Router>
      
      <footer>
        {!isAuthenticated || !isRestaurateur && <Footer />}
      </footer>
    </>
  );
}

export default App;
