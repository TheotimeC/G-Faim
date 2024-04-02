import React from 'react';
import Button from './Button';
import '../assets/styles/footer.css';
import { Col, Row } from 'antd';
import {FaInstagram, FaFacebook, FaTwitter} from "react-icons/fa";

interface FooterProps {
  backgroundColor: string;
  //onSubscribe: () => void; // Une fonction callback pour gérer les événements d'abonnement
  // Vous pouvez ajouter plus de props selon vos besoins, par exemple pour gérer les textes et les liens
}

const Footer: React.FC<FooterProps> = ({ backgroundColor, /*onSubscribe*/ }) => {
  const style = {
    backgroundColor: `#${backgroundColor}`,
  };

  return (
    <footer className="footer" style={style}>
        <div className="footer-section">
          <h1 className="logo">
              <span className="logo-g">G</span>
              <span className="logo-faim">FAIM</span>
          </h1>
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
          </div>
        </div>
        <div className="subscription">
          <h3>Recevez des offres exclusives !</h3>
          <div className="subscription-section">
              <input type="email" placeholder="votremail@gmail.com" />
              <Button text="S'abonner" color="298029" size="50" onClick={function (): void {
              throw new Error('Function not implemented.');
            } } />
          </div>
        </div>
        <div className="legal-section">
          <table>
              <tbody>
              <tr>
                  <td>
                  <h3>Pages Légales</h3>
                  <a href="/terms">Termes et conditions</a><br />
                  <a href="/privacy">Politique de confidentialité</a><br />
                  <a href="/cookies">Cookies</a>
                  </td>
                  <td>
                  <h3>Liens Importants</h3>
                  <a href="/help">Aide</a><br />
                  <a href="/add-restaurant">Ajouter votre restaurant</a><br />
                  <a href="/become-deliverer">Devenez Livreur</a><br />
                  <a href="/create-business-account">Créer un compte business</a>
                  </td>
              </tr>
              </tbody>
          </table>
        </div>

          <div className="footer-bottom">
            <p>© G FAIM Copyright 2024, All Rights Reserved.</p>
          </div>

    </footer>
  );
};

export default Footer;