import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home'
import Restaurants from './components/pages/Restaurants'
import Commandes from './components/pages/Commandes'
import Profil from './components/pages/Profil'
import Navbar from "./components/layout/Navbar"
import Connection from "./components/pages/Connection.tsx";

function App() {
  const userId = '6609c286c8c28a325095f8d1';
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {/*<Route path="/profil" element={<Profil userId={userId}/>} />*/}
          <Route path="/profil" element={<Connection />} />
          <Route path="/restaurants" element={<Restaurants/>} />
          <Route path="/commandes" element={<Commandes/>} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
