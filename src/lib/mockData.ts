import type { User, Customer, Order } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@salestrack.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'John Doe', email: 'john@salestrack.com', role: 'Sales Representative', territory: 'North', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Jane Smith', email: 'jane@salestrack.com', role: 'Sales Representative', territory: 'South', avatar: 'https://i.pravatar.cc/150?u=3' },
];

export const mockCustomers: Customer[] = [
  { id: 'C1', businessName: 'Acme Corp', ownerName: 'Alice', phone: '555-0101', email: 'alice@acme.com', address: '123 Main St', territory: 'North', type: 'Retail', outstanding: 1200, lastVisit: '2023-10-01', location: { lat: 40.7128, lng: -74.0060 } },
  { id: 'C2', businessName: 'Globex', ownerName: 'Bob', phone: '555-0202', email: 'bob@globex.com', address: '456 Market St', territory: 'South', type: 'Wholesale', outstanding: 0, lastVisit: '2023-09-28', location: { lat: 34.0522, lng: -118.2437 } },
];

export const mockOrders: Order[] = [
  { id: 'ORD-001', customerId: 'C1', repId: '2', date: '2023-10-01', status: 'Delivered', total: 500, items: 3 },
  { id: 'ORD-002', customerId: 'C2', repId: '3', date: '2023-10-02', status: 'Processing', total: 1250, items: 5 },
];
