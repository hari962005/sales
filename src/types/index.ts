export type Role = 'Super Admin' | 'Admin' | 'Sales Manager' | 'Area Manager' | 'Sales Representative' | 'Accounts' | 'Warehouse';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  territory?: string;
  avatar?: string;
}

export interface Customer {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  territory: string;
  type: string;
  outstanding: number;
  lastVisit: string;
  location: { lat: number, lng: number };
  communicatedBy?: string;
}

export interface Order {
  id: string;
  customerId: string;
  repId: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Confirmed' | 'Processing' | 'Packed' | 'Dispatched' | 'In Transit' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
}
