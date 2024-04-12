import { Col, Row, Divider, Input, Checkbox, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Button from "../common/Button.tsx";
import { useState } from 'react';
import styles from "../assets/styles/Connection.module.css";
import api from '../assets/api.ts';

const { Option } = Select;

export default function Inscription() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [adresse, setAdresse] = useState('');
    const [codePostal, setCodePostal] = useState('');
    const [ville, setVille] = useState('');
    const [pays, setPays] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const navigate = useNavigate();

    const isValidPassword = (password) => {
        return /[A-Z]/.test(password) && /\d/.test(password) && password.length >= 8;
    };

    const handleSignUp = async () => {
        if (!isValidPassword(password)) {
            message.error("Le mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre.");
            return;
        }

        if (password !== confirmPassword) {
            message.error("Les mots de passe ne correspondent pas.");
            return;
        }

        const user = {
            email: email,
            mot_de_passe: password,
            role: role,
            nom: nom,
            prenom: prenom,
            telephone: telephone,
            adresses_de_livraison: [{
                adresse: adresse,
                code_postal: codePostal,
                ville: ville,
                pays: pays
            }]
        };

        try {
            const response = await api.post('http://localhost:3000/user/create', user);
            console.log('Inscription réussie:', response.data);
            navigate('/login'); // Redirige l'utilisateur vers la page de connexion
        } catch (error) {
            console.error('Erreur lors de l\'inscription de l\'utilisateur:', error);
            message.error("Une erreur s'est produite lors de l'inscription.");
        }
    };

    return (
        <>
            <div className={styles.loginContainer}>
                <Row className={styles.antRow}>
                    <Col span={12} className={styles.columnFlex}>
                        <h1>S'inscrire</h1>
                        <Input className={styles.antInput} placeholder="Nom" onChange={(e) => setNom(e.target.value)} value={nom}/>
                        <Input className={styles.antInput} placeholder="Prénom" onChange={(e) => setPrenom(e.target.value)} value={prenom}/>
                        <Input className={styles.antInput} placeholder="Téléphone" onChange={(e) => setTelephone(e.target.value)} value={telephone}/>
                        <Input className={styles.antInput} placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email}/>
                        <Input type="password" className={styles.antInput} placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} value={password}/>
                        <Input type="password" className={styles.antInput} placeholder="Confirmer le mot de passe" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                        <Select defaultValue="" style={{ marginBottom: 15}} onChange={setRole}>
                            <Option value="">Sélectionner un rôle</Option>
                            <Option value="livreur">Livreur</Option>
                            <Option value="restaurateur">Restaurateur</Option>
                            <Option value="client">Client</Option>
                        </Select>
                        <Input className={styles.antInput} placeholder="Adresse" onChange={(e) => setAdresse(e.target.value)} value={adresse}/>
                        <Input className={styles.antInput} placeholder="Code Postal" onChange={(e) => setCodePostal(e.target.value)} value={codePostal}/>
                        <Input className={styles.antInput} placeholder="Ville" onChange={(e) => setVille(e.target.value)} value={ville}/>
                        <Input className={styles.antInput} placeholder="Pays" onChange={(e) => setPays(e.target.value)} value={pays}/>
                        <Checkbox checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}>J'accepte les termes et conditions</Checkbox>
                        <div className={styles.buttonContainer}>
                            <Button text="S'inscrire" color="FFA500" size="28" onClick={handleSignUp}/>
                        </div>
                    </Col>
                    <Col span={1} className={styles.columnFlex}> <Divider type="vertical" className={styles.dividerVertical} /></Col>
                    <Col span={11} className={styles.columnFlex} >
                        <img src="/connexion_nourriture.png" alt="food"/>
                    </Col>
                </Row>
            </div>
        </>
    );
}
