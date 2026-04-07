import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/common/CustomCursor';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Services = lazy(() => import('./pages/Services'));
const Builder = lazy(() => import('./pages/Builder'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

const Loader = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 60, height: 60, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
      <p style={{ fontFamily: 'Orbitron', color: '#00d4ff', fontSize: '0.8rem', letterSpacing: '3px' }}>LOADING...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main style={{ minHeight: '100vh', paddingTop: '70px' }}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
    <Footer />
  </>
);

const App = () => (
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CustomCursor />
          <Toaster position="top-right" toastOptions={{
            style: { background: '#0a0f1e', color: '#e2e8f0', border: '1px solid rgba(0,212,255,0.3)', fontFamily: 'Rajdhani', fontSize: '1rem' },
            success: { iconTheme: { primary: '#00d4ff', secondary: '#030712' } },
            error: { iconTheme: { primary: '#ff2d7d', secondary: '#030712' } },
          }} />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
);

export default App;
