
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: 'user' | 'admin';
  password?: string;
}

export interface OrderData {
  id: string;
  userId: string;
  name: string;
  pincode: string;
  area: string;
  address: string;
  phone: string;
  emptyCanProvided: boolean;
  quantity: number;
  productId: string;
  status: OrderStatus;
  createdAt: string;
}

export enum OrderStatus {
  PLACED = 'Placed',
  CONFIRMED = 'Confirmed',
  OUT_FOR_DELIVERY = 'Out for Delivery',
  DELIVERED = 'Delivered'
}

export type ViewState = 'HOME' | 'ORDER_FORM' | 'TRACKING' | 'ABOUT' | 'TERMS' | 'SEARCH' | 'LOGIN' | 'SIGNUP' | 'ADMIN_PANEL' | 'CLIENT_DASHBOARD' | 'BILL';
