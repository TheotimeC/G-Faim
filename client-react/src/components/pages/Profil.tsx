import '../assets/styles/profil.css'
import { Col, Row, Modal, Upload, UploadFile, UploadProps, Spin } from 'antd';
import  { useState, useEffect } from 'react';
import DefaultButton from '../common/DefaultButton';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';
import Input from '../common/Input';
import api from '../common/Api';


//Appel API
const API_URL = 'http://localhost:3000/user';

export interface User {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  mot_de_passe: string;
  adresses_de_livraison: Adresse[];
  code_parrain?: string;
  total_personnes_parrainees?: number;
}

export interface Adresse {
  adresse: string;
  code_postal: string;
  ville: string;
  pays: string;
}

export const getUser = async (id: string) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await api.get<User>(`${API_URL}/get/`, {
      params: { id },
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

export const putUser = async (id: string, data: Partial<User>) => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await api.put(`${API_URL}/modify/?id=${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    throw error;
  }
};

export const getUserId = async () => {
  try {
    const token = localStorage.getItem('accessToken')
    const response = await api.get(`${API_URL}/getId/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération de luser:', error);
    throw error;
  }
};



//[TODO] Photo de profil
type FileType = File | Blob;

const getBase64 = (file: Blob): Promise<string> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const Profil: React.FC = () => {
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState<User | null>(null);
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setMdp] = useState('');
  const [adresse, setAdresse] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id.userId);
      } catch (error) {
        console.error("Impossible de récupérer l'identifiant de l'utilisateur", error);
      }
    };

    fetchUserId();
  }, []);
  

  const handleUpdate = async () => {
    if(!userId) return;

    const adresseDeLivraison: Adresse = {
      adresse: adresse,
      code_postal: '', 
      ville: '',       
      pays: '',        
    };

    const updatedUser: Partial<User> = { 
      nom, 
      telephone, 
      email, 
      mot_de_passe: mdp,
      adresses_de_livraison: [adresseDeLivraison] 
    };

    try {
      await putUser(userId, updatedUser);
      console.log('Informations mises à jour avec succès');
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    }
  };

  const cancelChange = async()=>{
    if (user) {
      setUser(user); 
    }
  }
  
  //récuprétaion API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(!userId) return;
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur", error);
      }
    };

    fetchUser();
  }, [userId]);

  
  //preview pp
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    // Pas besoin de modal pour prévisualiser puisque l'image agit comme un bouton d'upload
  };
  //changement de pp
  const handleChange: UploadProps['onChange'] = async ({ file, fileList: newFileList }) => {
    if (file.originFileObj) {
        const base64 = await getBase64(file.originFileObj);
        file.thumbUrl = base64; // Ajouter ou mettre à jour thumbUrl avec la version base64
      }
  
      // Mettre à jour l'état avec le dernier fichier, ce qui devrait rafraîchir l'affichage
      setFileList([file]);
  };

  // L'affichage de l'image ou du bouton d'upload si aucune image n'est présente
  const uploadButton = (
    <div>
      {fileList.length === 0 ? (
        <PlusOutlined style={{ fontSize: '24px' }} />
      ) : (
        <img src={fileList[0].thumbUrl || fileList[0].url} alt="uploaded" style={{ width: '100%' }} />
      )}
    </div>
  );
  
  // si la requet get trouve pas d'user
  if (!user) return <div className='loading'><Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /></div>;
  const userAdresse = user.adresses_de_livraison[0];  
  
  return(
        <div>
            <div className='Entete'>
            <Row className='Row1'>
                <Col span={8} className='Col1'><p className='Titre'>Profil</p></Col>
                <Col span={8} className='Col2'></Col>
                <Col span={8} className='Col3'></Col>
            </Row>
            </div>
            <Row className='ProfRow1'>
                <Col span={24} className='ProfCol1'>
                    <div className="prof-card" >
                    <div className="prof-content">
                        <div className="prof-text">
                        <Row className='profrow2'>
                            <Col span={12} className='ProfCol1'>
                            <h3 className="prof-title">Informations essentielles</h3>
                            <div className='input-container1'>
                            <>
                            <Upload
                                className='profil-picture'
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                showUploadList={false} // Cache la liste par défaut d'Upload
                            >
                                {uploadButton}
                            </Upload>
                            <Modal className='pfp' open={Boolean(previewImage)} footer={null} onCancel={() => setPreviewImage('')}>
                                <img alt="profil picture" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            </>
                                <Input titre='Nom' text={user.nom} placeholder='' size='90' margintop='3' onChange={setNom}/>
                                <Input titre='Téléphone' text={user.telephone} placeholder='' size='90' margintop='3' onChange={setTelephone}/>
                                <Input titre='Email' text={user.email} placeholder='' size='90' margintop='3' onChange={setEmail}/>
                                <Input titre='Mot de passe' text={user.mot_de_passe} placeholder='' size='90' margintop='3' onChange={setMdp}/>

                            </div>
                            </Col>

                            <Col span={12} className='ProfCol2'>
                            <h3 className="prof-title2">Informations de Livraison</h3>
                                
                              <Input titre='Adresse de Livraison' text={userAdresse.adresse} placeholder='' size='90' margintop='3' onChange={setAdresse}/>
                            
                            <h3 className="prof-title3">Parrainage</h3>
                            <div className='parrain-container'>
                                <p className='parr-soustitre'>Parrainez et obtenez un bon de 10%</p>
                                <Row className='Row-parrain'>
                                <Col span={8} className='parr-col1'><p className='titreparr'>Code</p><p>{user.code_parrain}</p></Col>
                                <Col span={8} className='parr-col2'><p className='titreparr'>Personnes parrainées</p><p>{user.total_personnes_parrainees}</p></Col>
                                <Col span={8} className='parr-col3'><p className='titreparr'>Code parrain</p><div className='codeparrain'><input className='codeparrain2' placeholder='Code'></input><button className='valider'><Icon path={mdiCheck} color={"white"} size={0.5} /></button></div></Col>
                                </Row>
                            </div>
                            
                            </Col>
                            
                        </Row> 
                        <div className='button-container'>
                      
                            <DefaultButton text="Mettre à jour" textColor="FFFFFF" bgColor="298029" textSize="1rem" width="15%" marginLeft="0" marginRight="0" onClick={() => handleUpdate()}/>
                        </div>
                           

                        </div>
                    </div>
                    </div>
                </Col>
            </Row>
            
        </div>
    );
}

export default Profil