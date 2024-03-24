import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Accueil from './components/pages/Accueil'
import Restaurants from './components/pages/Restaurants'
import Commandes from './components/pages/Commandes'
import Navbar from "./components/layout/Navbar"

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/accueil" element={<Accueil/>} />
          <Route path="/restaurants" element={<Restaurants/>} />
          <Route path="/commandes" element={<Commandes/>} />
          <Route path="/" element={<Accueil/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
