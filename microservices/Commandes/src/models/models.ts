import mongoose, { Document } from 'mongoose';

enum OrderStatus {
  Cart = "cart",
  Paid = "paid",
  Fulfilled = "fulfilled",
}

interface IOrderItem {
  itemId: string;
  name: string;
  imgSrc: string;
  quantity: number;
  price: number;
  description: number;
}

interface IOrder extends Document {
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: Date;
  deliveryDate?: Date;
  deliveryAddress?: string;
  status: OrderStatus;
}

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  imgSrc: { type: String, required: true },
  description: { type: String, required: true },
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
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Cart },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
