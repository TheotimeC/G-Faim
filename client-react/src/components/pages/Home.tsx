import '../assets/styles/navbar.css';
import '../assets/styles/home.css'
import { Col, Row } from 'antd';
import Card from '../common/Card'
import CateData from '../assets/FakeData/Categories.json';
import RestoData from '../assets/FakeData/Resto.json';
import CategoriesDisplay from '../layout/CardDisplay'

const Home = () =>{
    
    return(
        <div>
            
            <Row className='SearchBarRow'>
                <Col span={24} className='SearchBarCol'>SearchBar</Col>
            </Row>

            <div className='Cate-pop'>

            <CategoriesDisplay
                title="Catégories populaires"
                data={CateData}
                renderItem={(item) => <Card title={item.title} subtitle={item.subtitle} img={item.img} />}
            />
        
            </div>

            <div className='Cate-pop'>

            <CategoriesDisplay 
            title="Restaurants populaires" 
            data={RestoData} 
            renderItem={(item) => <Card title={item.Nom} subtitle={item.Catégorie} img={item.img} />}
            />
        
            </div>

        </div>
            
    );
}

export default Home;