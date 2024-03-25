import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home'
import Restaurants from './components/pages/Restaurants'
import Commandes from './components/pages/Commandes'
import Profil from './components/pages/Profil'
import Navbar from "./components/layout/Navbar"

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/profil" element={<Profil/>} />
          <Route path="/restaurants" element={<Restaurants/>} />
          <Route path="/commandes" element={<Commandes/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
