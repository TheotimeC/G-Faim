import api from '../assets/api';
import {useState} from 'react';
import commandeData from '../assets/FakeData/commande.json'
import '../assets/styles/resthome.css'
import { Col, Row, Table, Button, Modal, Divider    } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CheckCircleOutlined , DeleteOutlined, EyeOutlined } from '@ant-design/icons';

interface Commande {
  _id:string;
    userId: string;
    userName: string;
    restaurantId: string;
    articles: Array<{
      articleId: string;
      Titre: string;
      Prix: number;
      quantite: number;
      img: string;
    }>;
    status: string;
    deliveryAddress: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
    LivreurId: string;
    LivreurName:string;
    isPickedUp: boolean;
    totalPrice: number;
    demande:string;
  }
  

const data = [
    { name: 'Lundi', nb: 55 },
    { name: 'Mardi', nb: 43 },
    { name: 'Mercredi', nb: 22 },
    { name: 'Jeudi', nb: 36 },
    { name: 'Vendredi', nb: 68 },
    { name: 'Samedi', nb: 41 },
  ];

const RestHome = () =>{
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<Commande | null>(null);
    const columns = [
        {
            title: 'Client',
            dataIndex: 'userName', // Assurez-vous que cela correspond à ce que vous voulez montrer comme ID de commande
            key: 'userId',
        },
        {
            title: 'Livreur',
            dataIndex: 'LivreurName',
            key: 'userId',
          },
        {
          title: 'Statut',
          dataIndex: 'status',
          key: 'userId',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <>
                <Button icon={<EyeOutlined />} onClick={() => showModal(record)} />
                <Button icon={<CheckCircleOutlined />} onClick={() => console.log('Valider', record)} />
                <Button icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)} />
              </>
            ),
          },
      ];
    const showModal = (record) => {
        setSelectedRecord(record);
        setIsModalVisible(true);
      };
      
      const handleOk = () => {
        setIsModalVisible(false);
      };
      
      const handleCancel = () => {
        setIsModalVisible(false);
      };

    return(
        <div>
            <h1>Dashboard</h1>
            <Row>
                <Col span={12} className='colonne1'>
                    <Row>

                    <Col span={12} className='Rectangle2'>
                        <div className='titre1'>Commandes en cours</div>
                        <div className='statsnumber'>8</div>
                    
                    </Col>

                    <Col span={12} className='Rectangle3'>
                        <div className='titre1'>Commandes livrées</div>
                        <div className='statsnumber'>17</div>
                    </Col>

                    </Row>

                    <Row className='Rectangle'>
                        <div className='titre1'>Total commandes</div>
                        <LineChart width={600} height={300} data={data} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Line type="monotone" dataKey="nb"  stroke="#298029" activeDot={{ r: 8 }} strokeWidth={3}/>
                        </LineChart>
                    </Row>
                    
                </Col>

                <Col span={12} className='Rectangle1'>
                <div>
      <div className='titre1'>Commandes en cours</div>
      <Table columns={columns} dataSource={commandeData} rowKey="userId" pagination={false} size='middle'/>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        >
        {selectedRecord && (
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <div className="frame-wrapper19">
      {selectedRecord.articles.map((article, index) => (
        <div key={index} className="frame-parent48">
          <div className="parent6">
            <b className="b21">{`${article.Prix} €`}</b>
            <div className="menu-maxi-best-of-parent">
              <b className="menu-maxi-best-of2">{article.Titre}</b>
              <b className="b22">{article.quantite}</b>
            </div>
          </div>
          {index < selectedRecord.articles.length - 1 && (
            <div className="line-wrapper8">
              <div className="frame-child63" />
            </div>
          )}
        </div>
      ))}
      <div className="line-wrapper8">
              <div className="frame-child63" />
            </div>
      <div className="prix-total-parent">
        <b className="prix-total1">Prix Total : </b>
        <b className="b27">{`${selectedRecord.totalPrice} €`}</b>
      </div>
    </div>
    
    <div className="frame-parent50">
      
      <div className="client-parent">
        <b className="client1">Client</b>
        <b className="barnab1">{selectedRecord.userName}</b>
      </div>
      <div className="livreur-parent">
        <b className="livreur1">Livreur</b>
        <b className="samy3"> {selectedRecord.LivreurName}</b>
      </div>
      <div className="statut-parent">
        <b className="statut1">Statut</b>
        <b className="a-accepter1">{selectedRecord.status}</b>
      </div>
        <div className="frame-wrapper20">
          <div className="rectangle-parent23">
            <div className="frame-child65" />
            <b className="demande">Demande :</b>
            <div className="sans-tomates-chef">
              {selectedRecord.demande}
            </div>
          </div>
        </div>
    </div>
  </div>
)}
    </Modal>
    </div>
                </Col>
            </Row>
        </div>
    );
}

export default RestHome