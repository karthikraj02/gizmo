import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../utils/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', country: 'India' });
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = cartTotal > 50000 ? 0 : 299;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderApi.create({
        items: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        shippingAddress: address,
        paymentMethod: 'stripe',
      });
      setOrderId(data._id);
      // Simulate payment success (in production integrate Stripe here)
      await orderApi.markAsPaid(data._id, { paymentResult: { id: 'sim_' + Date.now(), status: 'succeeded', update_time: new Date().toISOString() } });
      clearCart();
      setPlaced(true);
      toast.success('Order placed successfully!');
    } catch (err) { toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  if (placed) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
          <CheckCircle size={80} color="#00ff88" style={{ margin: '0 auto 24px', display: 'block' }} />
        </motion.div>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: '#00ff88', marginBottom: 16 }}>ORDER PLACED!</h2>
        <p style={{ color: '#64748b', marginBottom: 8 }}>Order ID: <span style={{ fontFamily: 'JetBrains Mono', color: '#00d4ff' }}>{orderId}</span></p>
        <p style={{ color: '#475569', marginBottom: 32 }}>We'll notify you when your order ships.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/dashboard/orders')} className="btn-primary">View Orders</motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate('/products')} className="btn-neon">Shop More</motion.button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '40px 24px', maxWidth: 900 }}>
      <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.8rem', marginBottom: 32 }}>CHECKOUT</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32 }}>
        <div>
          {/* Step 1: Address */}
          <div className="glass" style={{ borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} /> SHIPPING ADDRESS
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['street', 'Street Address', 'col-span-2'], ['city', 'City', ''], ['state', 'State', ''], ['pincode', 'PIN Code', ''], ['country', 'Country', '']].map(([key, label, cls]) => (
                <div key={key} style={{ gridColumn: cls === 'col-span-2' ? '1/-1' : 'auto' }}>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 6 }}>{label}</label>
                  <input value={address[key]} onChange={e => setAddress(p => ({ ...p, [key]: e.target.value }))} className="input-cyber" placeholder={label} />
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Payment */}
          <div className="glass" style={{ borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CreditCard size={16} /> PAYMENT
            </h3>
            <div style={{ padding: '16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, marginBottom: 16 }}>
              <p style={{ fontFamily: 'Orbitron', fontSize: '0.7rem', color: '#00d4ff', marginBottom: 8 }}>DEMO MODE</p>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Payment will be simulated. In production, Stripe integration handles secure card processing.</p>
            </div>
            <div style={{ padding: '16px', border: '2px solid rgba(0,212,255,0.4)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <CreditCard size={20} color="#00d4ff" />
              <div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#e2e8f0' }}>Credit / Debit Card</div>
                <div style={{ color: '#475569', fontSize: '0.8rem' }}>Secure payment via Stripe</div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
          <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 20 }}>ORDER SUMMARY</h3>
            {cart.map(item => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.85rem' }}>
                <span style={{ color: '#64748b' }}>{item.name} × {item.quantity}</span>
                <span style={{ color: '#94a3b8' }}>₹{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="divider-neon" />
            {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['GST (18%)', `₹${tax.toLocaleString()}`]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#64748b', fontSize: '0.85rem' }}>
                <span>{label}</span><span>{val}</span>
              </div>
            ))}
            <div className="divider-neon" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '0.85rem' }}>TOTAL</span>
              <span style={{ fontFamily: 'Orbitron', fontSize: '1.4rem', color: '#00d4ff' }}>₹{total.toLocaleString()}</span>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={placeOrder}
              disabled={loading || !address.street || !address.city || !address.pincode} className="btn-primary"
              style={{ width: '100%', padding: '14px', opacity: (!address.street || !address.city || !address.pincode) ? 0.5 : 1 }}>
              {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
