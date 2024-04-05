// models.ts
import mongoose, { Document } from 'mongoose';

interface IOrderItem {
  itemId: string; // Reference to the item, e.g., a meal or product ID
  quantity: number;
  price: number; // Price per item at the time of order
}

interface IOrder extends Document {
  userId: string; // Reference to the User in another microservice
  items: IOrderItem[];
  subtotal: number; // Total price of all items before adding delivery fee
  deliveryFee: number; // Delivery fee calculated based on certain criteria
  total: number; // Final total (subtotal + deliveryFee)
  orderDate: Date;
  deliveryDate?: Date; // Optional delivery date
  deliveryAddress?: string; // Optional delivery address
}

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  orderDate: { type: Date, required: true, default: Date.now },
  deliveryDate: Date,
  deliveryAddress: String,
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
