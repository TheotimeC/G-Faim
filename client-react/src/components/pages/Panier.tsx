import {Drawer} from "antd";
import "../assets/styles/Panier.css"
import ItemPanier from "../common/ItemPanier";
import Button from "../common/Button.tsx";
import {useState} from "react";
type DrawerType ={
    drawerState: boolean;
    setDrawerState: any;
}
const cartData = [
    { id: 1, name: 'Menu Mcfirst', price: '5,99€', quantity: 1,  imageSrc: 'https://eu-images.contentstack.com/v3/assets/blt5004e64d3579c43f/blte345501c8bb2b551/649c47d5dfeeafb870a54af1/BO_MCFIRST.png?auto=webp' },
    { id: 2, name: 'Menu CBO', price: '10,99€', quantity: 1,  imageSrc: 'https://mltwiersgrjj.i.optimole.com/UjSS7Fo-GBF0YJuC/w:347/h:347/q:90/https://menumcdo.com/wp-content/uploads/2022/03/220307-MCDO-DOCSTORE-CBO-MBO.png' },
    { id: 3, name: 'Menu Tower', price: '16,99€', quantity: 1, imageSrc: 'https://static.kfc.fr/images/items/lg/TowerBox-S-2Tenders.jpg?v=3xRXv4' },
];
export default function Panier({drawerState, setDrawerState}: DrawerType){
    const [cartItems, setCartItems] = useState(cartData);
    const turnOff = () => {
        setDrawerState(false);
    }
    const removeItemFromCart = (itemId: number) => {
        setCartItems(currentItems => currentItems.filter(item => item.id !== itemId))
    }
    const updateItemQuantityFromCart = (itemId: number, quantity: number) => {
        setCartItems(cartItems.map(item => {
            if (item.id === itemId)
                item.quantity = quantity;
            return item
        }));
    }
    const subtotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(',', '.').replace('€', ''));
        const quantity = item.quantity;
        return acc + (price * quantity);
    }, 0).toFixed(2); // Fix to 2 decimal places at the end of calculation

// Calculate delivery fee as 10% of subtotal
    const deliveryFee = (parseFloat(subtotal) * 0.1).toFixed(2);

// Calculate total as sum of subtotal and delivery fee
    const total = (parseFloat(subtotal) + parseFloat(deliveryFee)).toFixed(2);

    return (
        <>
            <Drawer title="Panier" onClose={turnOff} open={drawerState}  className="cart-drawer">
                {cartItems.map(item => (
                    <ItemPanier
                        key={item.id}
                        name={item.name}
                        price={item.price}
                        imageSrc={item.imageSrc}
                        removeItem={() => removeItemFromCart(item.id)}
                        updateQuantity={(quantity: number) => updateItemQuantityFromCart(item.id, quantity)}
                    />
                ))}
                <div className="checkout-section">
                    <div className="subtotal">
                        <span>Sous total :</span>
                        <span>{subtotal}€</span>
                    </div>
                    <div className="delivery-fee">
                        <span>Livraison :</span>
                        <span>{deliveryFee}€</span>
                    </div>
                    <div className="total">
                        <span>Total :</span>
                        <span>{total}€</span>
                    </div>
                    <Button className="checkout-button" text="Paiement" color="FFA500" size="100"/>
                </div>
            </Drawer>
        </>
    )
}