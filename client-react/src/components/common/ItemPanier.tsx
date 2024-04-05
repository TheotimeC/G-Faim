// CartItem.jsx
import React, {useState} from 'react';
import '../assets/styles/ItemPanier.css';
import {InputNumber} from "antd"; // Make sure to create a separate CSS file for the CartItem
interface CartItemProps {
    name: string;
    price: string;
    imageSrc: string;
    initialQuantity: number;
    removeItem: () => void;
    updateQuantity: (quantity: number) => void;
    // If you plan to manage quantity from this component, you should include quantity state here as well
}

function ItemPanier({ name, price, imageSrc, initialQuantity, removeItem, updateQuantity } : CartItemProps) {
    // This is a static quantity for display purposes
    // You might want to manage the quantity state here or in the parent component
    const [quantity, setQuantity] = useState(initialQuantity);
    const [tempQuantity, setTempQuantity] = useState(1);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const addQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        updateQuantity(newQuantity);

    }
    const substractQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            updateQuantity(newQuantity);
        }

        else
            removeItem();

    }
    const toggleEditable = () => {
        setIsEditable(!isEditable);
        if (isEditable)
            updateQuantity(tempQuantity);
    };
    const handleQuantityChange = (value: number) => {
        if (value > 0) {
            setQuantity(value);
            setTempQuantity(value);
        }
        else if (value  === 0) {
            removeItem();
        }
        else
            return;
    };
    return (
        <div className="cart-item">
            <img src={imageSrc} alt={name} className="cart-item-image" />
            <div className="cart-item-info">
                <div className="cart-item-name">{name}</div>
                <div className="cart-item-price">{price}€</div>
            </div>
            <div className="cart-item-quantity">
                <button className="cart-quantity-button" onClick={substractQuantity}>-</button>
                {isEditable ? (
                    <InputNumber
                        className="cart-quantity-input"
                        value={quantity}
                        onChange={handleQuantityChange}
                        onBlur={toggleEditable}
                        autoFocus
                        controls={false}
                    />
                ) : (
                    <div className="cart-quantity-value" onClick={toggleEditable}>{quantity}</div>
                )}
                <button className="cart-quantity-button" onClick={addQuantity}>+</button>
            </div>
        </div>
    );
}

export default ItemPanier;
