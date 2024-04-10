import mongoose, { Document } from 'mongoose';

export enum OrderStatus {
  CANCELLED = "Annulée",
  CART = "Panier",
  PAID = "Payée",
  TO_ACCEPT = "A accepter",
  IN_PREPARATION = "En préparation",
  AWAITING_PICKUP = "En attente de retrait",
  IN_TRANSIT = "En cours de livraison",
  DELIVERED = "Livrée",
}

interface IOrderItem {
  itemId: string;
  name: string;
  imgSrc: string;
  quantity: number;
  price: number;
  description: string; // Fixed: description should be a string, not a number
  itemInstructions: string;
}

interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface IOrder extends Document {
  userId: string;
  restaurantId: string;
  deliveryManId?: string; // Optional
  deliveryManName?: string; // Optional
  deliveryInstructions?: string; // Optional
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  orderDate: Date;
  deliveryDate?: Date; // Optional
  deliveryAddress?: DeliveryAddress; // Optional
  status: OrderStatus;
}

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  imgSrc: { type: String, required: true },
  description: { type: String, required: true },
  itemInstructions: { type: String, required: false }, // Optional
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  restaurantId: { type: String, required: true },
  deliveryManId: { type: String, required: false }, // Optional
  deliveryManName: { type: String, required: false }, // Optional
  deliveryInstructions: { type: String, required: false }, // Optional
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  total: { type: Number, required: true },
  orderDate: { type: Date, required: true, default: Date.now },
  deliveryDate: { type: Date, required: false }, // Optional
  deliveryAddress: {
    type: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    required: false, // Optional
  },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.CART },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
