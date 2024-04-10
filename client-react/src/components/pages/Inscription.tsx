import { Col, Row, Divider, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import Button from "../common/Button.tsx";
import { useState } from 'react';
import styles from "../assets/styles/Connection.module.css";
import api from '../assets/api.ts';

export default function Inscription() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const navigate = useNavigate();

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            // Gérer l'erreur: les mots de passe ne correspondent pas
            console.error("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await api.post('http://localhost:3000/auth/signup', {
                email: email,
                mot_de_passe: password,
                // Vous pouvez ajouter plus de champs ici selon vos besoins, comme le nom, téléphone, etc.
            });
            console.log('Inscription réussie:', response.data);
            // Redirection ou traitement post-inscription
            navigate('/login'); // Redirige l'utilisateur vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
            // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
        }
    };

    return (
        <>
            <div className={styles.loginContainer}>
                <Row className={styles.antRow}>
                    <Col span={12} className={styles.columnFlex}>
                        <h1>S'inscrire</h1>
                        <Input className={styles.antInput} placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <Input type="password" className={styles.antInput} placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <Input type="password" className={styles.antInput} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                        <Checkbox checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}>J'accepte les termes et conditions</Checkbox>
                        <div className={styles.buttonContainer}>
                            <Button text="S'inscrire" color="FFA500" size="28" onClick={handleSignUp}/>
                        </div>
                    </Col>
                    <Col span={1}  className={styles.columnFlex}> <Divider type="vertical" className={styles.dividerVertical} /></Col>
                    <Col span={11} className={styles.columnFlex} >
                        <img src="/connexion_nourriture.png" alt="food"/>
                    </Col>
                </Row>
            </div>
        </>
    );
}
