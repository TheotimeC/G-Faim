import api from '../common/Api';
import '../assets/styles/resthome.css'
import { Col, Row  } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
                <Col span={12}>
                    <Row>

                    <Col span={12} className='Rectangle'>
                        <div className='titre1'>Commandes en cours</div>
                        <div className='statsnumber'>8</div>
                    
                    </Col>

                    <Col span={12} className='Rectangle'>
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

                    <Row className='Rectangle'>
                    <div className='titre1'>Dernières commandes</div>
                    </Row>
                    
                </Col>

                <Col span={12} className='Rectangle1'>
                    <div className='titre1'>Commandes en cours</div>
                </Col>
            </Row>
        </div>
    );
}

export default RestHome