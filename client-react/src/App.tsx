import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home'
import Parcourir from './components/pages/Parcourir'
import Commandes from './components/pages/Commandes'
import Profil from './components/pages/Profil'
import Navbar from "./components/layout/Navbar"
import Restaurant from './components/pages/Restaurant';

function App() {
  const userId = '6609c286c8c28a325095f8d1';
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/profil" element={<Profil userId={userId}/>} />
          <Route path="/Restaurants" element={<Parcourir/>} />
          <Route path="/Restaurants/:id" element={<Restaurant />} />  
          <Route path="/commandes" element={<Commandes/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
