import '../assets/styles/reststats.css'; 
import { Row, Col } from "antd";
import { useState, useEffect } from 'react';
import orderApi from '../assets/order-api';
import { AreaChart,Area,BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';

interface Article {
    itemId: string;
    name: string;
    imgSrc: string;
    quantity: number;
    price: number;
    description: string;
  }
  
  interface Commande {
    _id: string;
    userId: string;
    userName:string;
    restaurantId: string;
    items: Article[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    orderDate: string;
    restaurantStatus: "to accept" | "in preparation" | "ready";
    deliveryStatus: "awaiting pickup" | "in transit" | "delivered";
    status: "cart" | "paid" | "fulfilled";
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }

  interface SalesData {
    period: string;
    revenue: number;
  }

  interface AverageBasketData {
    day: string;
    averageBasket: number;
  }

  interface PopularItemData {
    name: string;
    count: number;
  }

  interface OrdersPerHourData {
    hour: string;
    count: number;
  }

const Stats = () =>{
    const [orders, setOrders] = useState<Commande[]>([]);


    const extractSalesTotalData = (orders: Commande[]): SalesData[] => {
        // Exemple : Grouper et sommer les revenus par date
        const revenueByDate: { [key: string]: number } = {};
        orders.forEach(order => {
          const date = new Date(order.orderDate).toLocaleDateString();
          if (!revenueByDate[date]) {
            revenueByDate[date] = 0;
          }
          revenueByDate[date] += order.total;
          revenueByDate[date] = Math.round((revenueByDate[date] + order.total) * 100) / 100;
        });
        
        
        return Object.keys(revenueByDate).map(date => ({
          period: date,
          revenue: revenueByDate[date]
        }));
      };
    
      const extractOrdersPerHourData = (orders: Commande[]): OrdersPerHourData[] => {
        const countsByHour: { [hour: string]: number } = {};
      
        orders.forEach(order => {
          const hour = new Date(order.orderDate).getHours().toString();
          countsByHour[hour] = (countsByHour[hour] || 0) + 1;
        });
      
        return Object.keys(countsByHour).map(hour => ({
          hour: `${hour}:00`,
          count: countsByHour[hour],
        })).sort((a, b) => parseInt(a.hour) - parseInt(b.hour)); // Assurez-vous que les heures sont triées
      };

      const extractAverageBasketData = (orders: Commande[]): AverageBasketData[] => {
        // Grouper les commandes par jour en accumulant la somme totale et le compteur de commandes pour chaque jour
        const daySummary = orders.reduce((acc: {[key: string]: {total: number, count: number}}, order) => {
          const day = order.orderDate.split('T')[0]; // Assumer que orderDate est en format ISO et extraire la partie date
          if (!acc[day]) {
            acc[day] = { total: 0, count: 0 };
          }
          acc[day].total += order.total; // Utiliser 'total' pour calculer le panier moyen
          acc[day].count += 1;
          return acc;
        }, {});
      
        // Transformer l'objet 'daySummary' en tableau d'objets 'AverageBasketData'
        return Object.entries(daySummary).map(([day, summary]) => ({
          day,
          averageBasket: Math.round((summary.total / summary.count) * 100) / 100 // Arrondir le résultat pour avoir deux chiffres après la virgule
        }));
      };

      const extractPopularItemsData = (orders: Commande[]): PopularItemData[] => {
        const itemCounts: { [key: string]: number } = {};
      
        orders.forEach(order => {
          order.items.forEach(item => {
            if (itemCounts[item.name]) {
              itemCounts[item.name] += item.quantity;
            } else {
              itemCounts[item.name] = item.quantity;
            }
          });
        });
      
        const popularItems: PopularItemData[] = Object.entries(itemCounts).map(([name, count]) => ({
          name,
          count,
        }));
      
        // Trier par count décroissant et sélectionner les top N, par exemple 5
        return popularItems.sort((a, b) => b.count - a.count).slice(0, 5);
      };
    useEffect(() => {
        const restId = localStorage.getItem('restaurantId');
        if (!restId) {
          console.log("ID du restaurant non trouvé");
          return;
        }
        const fetchOrders = async () => {
          try {
            const response = await orderApi.getOrdersByRestaurantId(restId);
            // Utiliser Promise.all pour récupérer les noms d'utilisateurs pour chaque commande
            setOrders(response.data);
          } catch (error) {
            console.error("Erreur lors de la récupération des commandes:", error);
          }
        };
      
        fetchOrders();
      }, []);

    return(
        <div>
            <h1>Statistiques</h1>
            <Row>
                <Col span={12} className='stats-col'><div className='stats-card-background'>
                <h3>Panier Moyen</h3>

                <LineChart width={400} height={200} data={extractAverageBasketData(orders)} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Line type="monotone" dataKey="averageBasket" stroke="#298029" activeDot={{ r: 8 }} strokeWidth={3}>
                        <LabelList dataKey="averageBasket" position="top" />
                    </Line>
                </LineChart>

                    </div></Col>
                <Col span={12} className='stats-col'><div className='stats-card-background'>
                <h3>Commande par Heure</h3>
                <BarChart width={400} height={200} data={extractOrdersPerHourData(orders)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Bar dataKey="count" fill="#298029" />
                </BarChart>
                    </div></Col>
            
            </Row>
            <Row>
                <Col span={24} className='stats-col'><div className='stats-card-background'>
                <h3>Les populaires</h3>
                <BarChart width={600} height={300} data={extractPopularItemsData(orders)} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-30} textAnchor="end" height={100}/>
                    <YAxis />
                    <Bar dataKey="count" fill="#298029" />
                </BarChart>
                    </div></Col>
                
            </Row>
            <Row>
                <Col span={12} className='stats-col' push={5}><div className='stats-card-background'>
                    <h3>Ventes Total</h3>
                        <LineChart width={400} height={200} data={extractSalesTotalData(orders)} margin={{ top: 20, right: 30, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Line type="monotone" dataKey="revenue"  stroke="#298029" activeDot={{ r: 8 }} strokeWidth={3}>
                            <LabelList dataKey="revenue" position="top" />
                        </Line>
                        </LineChart>

                    </div></Col>
                    
            </Row>
            
        </div>
    );
}

export default Stats