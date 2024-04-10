import { Drawer } from "antd";
import "../assets/styles/Panier.css";
import ItemPanier from "../common/ItemPanier";
import Button from "../common/Button";
import { useState, useEffect } from "react";
import orderApi from "../assets/order-api.ts";
import {getUserId} from "../assets/user-api.ts";

// Define types for your item and response from the API
type CartItem = {
    _id: string;
    name: string;
    price: string; // Consider converting this to number if your backend sends it as a number
    quantity: number;
    imgSrc: string;
};

type DrawerType = {
    drawerState: boolean;
    setDrawerState: (state: boolean) => void;
};

const userId = await getUserId();

// Function to fetch cart items
const getCart = async (): Promise<CartItem[]> => {
    try {
        const response = await orderApi.getUserCart(userId);
        return response.data.items; // Assuming the response data structure includes an items array
    } catch (error: any) {
        console.error('Error fetching cart:', error.response ? error.response.data : error.message);
        return []; // Return empty array on error
    }
};

// Function to update the cart
const updateCart = async (items: CartItem[]): Promise<CartItem[]> => {
    try {
        const payload = {
            items: items
        };
        const response = await orderApi.updateCart(userId, payload);
        return response.data.items;
    } catch (error: any) {
        console.error('Error updating cart:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const Panier: React.FC<DrawerType> = ({ drawerState, setDrawerState }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        (async () => {
            const items = await getCart();
            setCartItems(items);
        })();
    }, [drawerState]); // Fetch cart items when drawerState changes

    const turnOff = () => {
        setDrawerState(false);
    };

    const removeItemFromCart = async (itemId: string): Promise<void> => {
        await orderApi.deleteCartItem(userId, itemId);
        const updatedItems = cartItems.filter(item => item._id !== itemId);
        // const items = await updateCart(updatedItems);
        setCartItems(updatedItems);
    };

    const updateItemQuantityFromCart = async (itemId: string, quantity: number): Promise<void> => {
        const updatedItems = cartItems.map(item => {
            if (item._id === itemId) {
                return { ...item, quantity };
            }
            return item;
        });
        const items = await updateCart(updatedItems);
        setCartItems(items);
    };
    let subtotal = '0';
    let deliveryFee = '0';
    let total = '0';
    if (cartItems != null) {
         subtotal = cartItems.reduce((acc, item) => {
            // const price = parseFloat(item.price.replace(',', '.').replace('€', ''));
            const price = Number(item.price);
            return acc + (price * item.quantity);
        }, 0).toFixed(2);

         deliveryFee = (parseFloat(subtotal) * 0.1).toFixed(2);
         total = (parseFloat(subtotal) + parseFloat(deliveryFee)).toFixed(2);
    }


    return (
        <>
            <Drawer title="Panier" onClose={turnOff} open={drawerState} className="cart-drawer">
                {cartItems && cartItems.map(item => (
                    <ItemPanier
                        key={item._id}
                        name={item.name}
                        price={item.price}
                        imageSrc={item.imgSrc}
                        initialQuantity={item.quantity}
                        removeItem={() => removeItemFromCart(item._id)}
                        updateQuantity={(quantity: number) => updateItemQuantityFromCart(item._id, quantity)}
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
                    <Button className="checkout-button" text="Paiement" color="FFA500" size="100" />
                </div>
            </Drawer>
        </>
    );
};

export default Panier;
