import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import RepDashboard from './pages/rep/RepDashboard';
import LiveTracking from './pages/shared/LiveTracking';
import Customers from './pages/shared/Customers';
import Orders from './pages/shared/Orders';
import Products from './pages/shared/Products';
import CreateOrder from './pages/shared/CreateOrder';
import Payments from './pages/shared/Payments';
import Expenses from './pages/shared/Expenses';
import Employees from './pages/admin/Employees';
import Reports from './pages/admin/Reports';
import CustomerVisit from './pages/rep/CustomerVisit';
import AIInsights from './pages/admin/AIInsights';
import OrderTracking from './pages/shared/OrderTracking';
import Attendance from './pages/shared/Attendance';
import ComingSoon from './pages/shared/ComingSoon';
import Dealers from './pages/shared/Dealers';
import Consignments from './pages/shared/Consignments';
import Complaints from './pages/shared/Complaints';
import LogBook from './pages/shared/LogBook';
import Returns from './pages/shared/Returns';
import Transactions from './pages/shared/Transactions';
import Documents from './pages/shared/Documents';
import Audit from './pages/shared/Audit';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return <>{children}</>;
};

const RoleBasedHome = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'Sales Representative') return <Navigate to="/rep/dashboard" />;
  return <Navigate to="/admin/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<RoleBasedHome />} />
        
        {/* Core Dashboards */}
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="rep/dashboard" element={<RepDashboard />} />
        
        {/* New / Deep Pages */}
        <Route path="ai-insights" element={<AIInsights />} />
        <Route path="order-tracking" element={<OrderTracking />} />
        <Route path="attendance" element={<Attendance />} />
        
        {/* Shared / Existent */}
        <Route path="tracking" element={<LiveTracking />} />
        <Route path="employees" element={<Employees />} />
        <Route path="reports" element={<Reports />} />
        <Route path="visit" element={<CustomerVisit />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="create-order" element={<CreateOrder />} />
        <Route path="products" element={<Products />} />
        <Route path="payments" element={<Payments />} />
        <Route path="expenses" element={<Expenses />} />
        
        {/* Extracted Features */}
        <Route path="transactions" element={<Transactions />} />
        <Route path="consignments" element={<Consignments />} />
        <Route path="documents" element={<Documents />} />
        <Route path="audit" element={<Audit />} />
        <Route path="dealers" element={<Dealers />} />
        <Route path="returns" element={<Returns />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="log-book" element={<LogBook />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
