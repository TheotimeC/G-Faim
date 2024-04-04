import { Col, Row, Divider, Input, Checkbox } from 'antd';
import Button from "../common/Button.tsx";
import { useState} from 'react'
import styles from "../assets/styles/Connection.module.css"
import api from '../common/Api';
import { useAuth } from '../common/Auth.tsx'; // Importez le hook d'authentification

// Dans votre fonction de connexion :
// Après une connexion réussie :

export default function Connection(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
          const response = await api.post('http://localhost:3000/auth/login', {
            email: username,
            mot_de_passe: password,
          });
    
          console.log('Login réussi:', response.data);
          const token = response.data
          login(token);
          
          // Optionnel : gérer "Se souvenir de moi"
          if (rememberMe) {
            // Stockez des informations pertinentes localement
          }
        } catch (error) {
            console.error('Erreur lors de la connexion de l\'utilisateur:', error);
          // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
        }
      };

    return (
        <>
            <div className={styles.loginContainer}>
            <Row className={styles.antRow}>
                <Col span={12} className={styles.columnFlex}>
                    <h1>Se Connecter</h1>
                    <Input className={styles.antInput} placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                    <Input  type="password" className={styles.antInput} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>Se souvenir de moi</Checkbox>
                    <div className={styles.buttonContainer}> 
                    <Button text="Connexion" color="FFA500" size="28" onClick={handleLogin}/>
                    </div>
                </Col>
                <Col span={1}  className={styles.columnFlex}> <Divider type="vertical" className={styles.dividerVertical} /></Col>
                <Col span={11} className={styles.columnFlex} >
                    <img src="/connexion_nourriture.png" alt="food"/>
                </Col>
            </Row>
            </div>

        </>
    )
}
