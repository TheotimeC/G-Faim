import {Drawer, message} from "antd";
import "../assets/styles/Panier.css";
import ItemPanier from "../common/ItemPanier";
import Button from "../common/Button";
import {useState, useEffect, useRef} from "react";
import orderApi, {OrderStatus} from "../assets/order-api.ts";
import {getUserId} from "../assets/user-api.ts";
import paymentApi from "../assets/payment-api.ts";
import {useLocation} from "react-router";

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
const getCart = async (): Promise<any> => {
    try {
        const response = await orderApi.getUserCart(userId);
        return response.data; // Assuming the response data structure includes an items array
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
    const location = useLocation();
    const hasCalledAPI = useRef(false); // Using useRef to persist the value without triggering re-renders
    const [messageApi, contextHolder] = message.useMessage()

    const success = async () => {
        await messageApi.open({
            type: 'success',
            content: 'Your payment has been successfully processed! Thank you for your purchase.',
            duration: 2.5
        });
    };
    useEffect(() => {
        (async () => {
            const queryParams = new URLSearchParams(location.search);
            const isSuccess = queryParams.get('success');
            const cart = await getCart();
            if (isSuccess === 'true' && !hasCalledAPI.current) {
                hasCalledAPI.current = true; // Set the flag to true after calling your API
                orderApi.setRestaurantStatus(cart._id, OrderStatus.TO_ACCEPT);
                paymentApi.recordPayment(cart.userId, cart._id, Number(cart.total.toFixed(2)));
                success();
            }
        })();
    }, [location.search]); // Depend on location.search
    const checkout = async () => {
        try {
            // Assuming createCheckout function expects a userId and the cart items, and it returns a URL
            const checkoutSession = await paymentApi.createCheckout(userId, cartItems);
            // Redirect to Stripe's hosted checkout page
            window.location.href = checkoutSession.data;
        } catch (error) {
            console.error('Error initiating checkout:', error);
            // Handle the error appropriately in your UI
        }
    };

    useEffect(() => {
        (async () => {
            const cart = await getCart();
            setCartItems(cart.items);
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
            {contextHolder}
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
                    <Button className="checkout-button" text="Paiement" color="FFA500" size="100" onClick={checkout} />
                </div>
            </Drawer>
        </>
    );
};

export default Panier;