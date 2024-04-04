import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home'
import Parcourir from './components/pages/Parcourir.tsx'
import Commandes from './components/pages/Commandes'
import Profil from './components/pages/Profil'
import Navbar from "./components/layout/Navbar"
import Connection from "./components/pages/Connection.tsx";
import Footer from "./components/common/Footer.tsx";
import Restaurant from './components/pages/Restaurant';
import { useAuth } from '../src/components/common/Auth.tsx';


function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/*<Route path="/profil" element={<Profil userId={userId}/>} />*/}
          <Route path="/profil" element={isAuthenticated ? <Profil/> : <Connection />} />
          <Route path="/restaurants" element={<Parcourir/>} />
          <Route path="/Restaurants/:id" element={<Restaurant />} />
          <Route path="/commandes" element={<Commandes/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
        <footer>
            <Footer />
        </footer>

    </>
  );
}

export default App;
