import { Col, Row, Divider, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import Button from "../common/Button.tsx";
import { useState} from 'react'
import styles from "../assets/styles/Connection.module.css"
import api from '../assets/api.ts';
import { useAuth } from '../assets/Auth.tsx';

// Dans votre fonction de connexion :
// Après une connexion réussie :

export default function Connection(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
      try {
        const response = await api.post('http://localhost:3000/auth/login', {
          email: username,
          mot_de_passe: password,
        });
        console.log(response.data)
    
        
        const { accessToken, refreshToken, role, restaurantId  } = response.data; // Décomposez la réponse pour extraire le rôle
        login({ accessToken, refreshToken, role }); // Passez le rôle à la fonction login
        // Note: Pas besoin de localStorage.setItem('role', role); ici car cela sera géré dans `login`
        console.log('Login réussi:', response.data, restaurantId);
        if (restaurantId) {
          localStorage.setItem('restaurantId', restaurantId);
          navigate('/dashboard');
      } else if(role=='livreur'){
        navigate('/livraison');
      }else if(role=='admin'){
        navigate('/admin');
      }
      else {
          navigate('/profil');
      }

      } catch (error) {
        console.error('Erreur lors de la connexion de l\'utilisateur:', error);
        // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
      }
    };
    async function handleKeyPress(event: any) {
        if (event.key === "Enter")
            await handleLogin();
    }

    return (
        <>
            <div className={styles.loginContainer} onKeyUp={handleKeyPress}>
            <Row className={styles.antRow}>
                <Col span={12} className={styles.columnFlex}>
                    <h1>Se Connecter</h1>
                    <Input className={styles.antInput} placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                    <Input  type="password" className={styles.antInput} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                    <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>Se souvenir de moi</Checkbox>
                    <div className={styles.buttonContainer}> 
                    <Button text="Connexion" color="FFA500" size="28" onClick={handleLogin}/>
                    </div>
                    <a href="/inscription"> pas encore membre ? </a>
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
