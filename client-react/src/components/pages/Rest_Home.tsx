import api from '../common/api';
import commandeData from '../assets/FakeData/commande.json'
import '../assets/styles/resthome.css'
import { Col, Row, Table, Button   } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CheckCircleOutlined , DeleteOutlined, EyeOutlined } from '@ant-design/icons';


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
            <Button icon={<EyeOutlined />} onClick={() => console.log('Visualiser', record)} />
            <Button icon={<CheckCircleOutlined />} onClick={() => console.log('Valider', record)} />
            <Button icon={<DeleteOutlined />} onClick={() => console.log('Supprimer', record)} />
          </>
        ),
      },
  ];

const data = [
    { name: 'Lundi', nb: 55 },
    { name: 'Mardi', nb: 43 },
    { name: 'Mercredi', nb: 22 },
    { name: 'Jeudi', nb: 36 },
    { name: 'Vendredi', nb: 68 },
    { name: 'Samedi', nb: 41 },
  ];

const RestHome = () =>{
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
    </div>
                </Col>
            </Row>
        </div>
    );
}

export default RestHome