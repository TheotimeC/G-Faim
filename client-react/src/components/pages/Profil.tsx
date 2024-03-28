import '../assets/styles/profil.css'
import { Col, Row, Typography, Modal, Upload, UploadFile, UploadProps } from 'antd';
import  { useState } from 'react';
import UserData from '../assets/FakeData/User.json';
import DefaultButton from '../common/DefaultButton';
import { PlusOutlined } from '@ant-design/icons';
import Icon from '@mdi/react';
import { mdiCheck } from '@mdi/js';


const { Paragraph } = Typography;

type FileType = File | Blob;

const getBase64 = (file: Blob): Promise<string> =>
new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const Profil = () =>{
    const [editableStrNom, setEditableStrNom] = useState(UserData.Nom);
    const [editableStrTel, setEditableStrTel] = useState(UserData.Telephone);
    const [editableStrMail, setEditableStrMail] = useState(UserData.email);
    const [editableStrMdp, setEditableStrMdp] = useState(UserData.mdp);
    const [editableStrAdresse,  setEditableStrAdresse] = useState(UserData.Adresse);
    

    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    // Pas besoin de modal pour prévisualiser puisque l'image agit comme un bouton d'upload
  };

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
                                <span className='titreinput'>Nom</span>
                                <Paragraph className="input-data" editable={{ onChange: setEditableStrNom }}>{editableStrNom}</Paragraph>
                                <span className='titreinput'>Téléphone</span>
                                <Paragraph className="input-data" editable={{ onChange: setEditableStrTel }}>{editableStrTel}</Paragraph>
                                <span className='titreinput'>Email</span>
                                <Paragraph className="input-data" editable={{ onChange: setEditableStrMail }}>{editableStrMail}</Paragraph>
                                <span className='titreinput'>Mot de passe</span>
                                <Paragraph className="input-data" editable={{ onChange: setEditableStrMdp }}>{editableStrMdp}</Paragraph>

                            </div>
                            </Col>

                            <Col span={12} className='ProfCol2'>
                            <h3 className="prof-title2">Informations de Livraison</h3>
                            <span className='titreinput'>Adresse de livraison</span>
                            <div className='input-container2'>
                                
                                <Paragraph className="input-data" editable={{ onChange: setEditableStrAdresse }}>{editableStrAdresse}</Paragraph>
                            </div>
                            
                            <h3 className="prof-title3">Parrainage</h3>
                            <div className='parrain-container'>
                                <p className='parr-soustitre'>Parrainez et obtenez un bon de 10%</p>
                                <Row className='Row-parrain'>
                                <Col span={8} className='parr-col1'><p className='titreparr'>Code</p><p>ALP87</p></Col>
                                <Col span={8} className='parr-col2'><p className='titreparr'>Personnes parrainées</p><p>50</p></Col>
                                <Col span={8} className='parr-col3'><p className='titreparr'>Code parrain</p><div className='codeparrain'><input className='codeparrain2' placeholder='Code'></input><button className='valider'><Icon path={mdiCheck} color={"white"} size={0.5} /></button></div></Col>
                                </Row>
                            </div>
                            
                            </Col>
                            
                        </Row> 
                        <div className='button-container'>
                            <DefaultButton text="Refuser" textColor="FFFFFF" bgColor="FF3A44" textSize="1rem" width="15%"/>
                            <DefaultButton text="Accepter" textColor="FFFFFF" bgColor="298029" textSize="1rem" width="15%"/>
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