import mongoose, { Document } from 'mongoose';

enum OrderStatus {
  Cart = "cart",
  Paid = "paid",
  Fulfilled = "fulfilled",
}

export enum RestaurantStatus {
  TO_ACCEPT = "to accept",
  IN_PREPARATION = "in preparation",
  READY = "ready",
}

enum DeliveryStatus {
  AWAITING_PICKUP = "awaiting pickup",
  IN_TRANSIT = "in transit",
  DELIVERED = "delivered",
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
  restaurantStatus: RestaurantStatus;
  deliveryStatus: DeliveryStatus;
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
  restaurantStatus: { type: String, required: true, enum: Object.values(RestaurantStatus), default: RestaurantStatus.TO_ACCEPT },
  deliveryStatus: { type: String, required: false, enum: Object.values(DeliveryStatus), default: DeliveryStatus.AWAITING_PICKUP }, // Optional if your logic requires
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Cart },
}, { timestamps: true });

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order;
