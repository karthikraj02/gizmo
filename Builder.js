import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cart.length === 0) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
      <ShoppingBag size={80} color="rgba(0,212,255,0.15)" />
      <h2 style={{ fontFamily: 'Orbitron', color: '#334155', fontSize: '1.5rem' }}>YOUR CART IS EMPTY</h2>
      <p style={{ color: '#475569' }}>Add some amazing components to get started.</p>
      <Link to="/products"><motion.button whileHover={{ scale: 1.05 }} className="btn-primary">Browse Products</motion.button></Link>
    </div>
  );

  const shipping = cartTotal > 50000 ? 0 : 299;
  const tax = Math.round(cartTotal * 0.18);
  const total = cartTotal + shipping + tax;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          YOUR <span className="gradient-text">CART</span>
        </h1>
        <motion.button whileHover={{ scale: 1.05 }} onClick={clearCart}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid rgba(255,45,125,0.3)', color: '#ff2d7d', padding: '8px 16px', cursor: 'pointer', borderRadius: 4, fontSize: '0.85rem' }}>
          <Trash2 size={14} /> Clear Cart
        </motion.button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        <div>
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20, height: 0 }}
                className="glass" style={{ borderRadius: 12, padding: '20px', marginBottom: 16, display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ width: 80, height: 80, background: 'rgba(0,212,255,0.05)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                    : <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: 'rgba(0,212,255,0.2)' }}>{item.category?.[0]}</div>}
                </div>
                <div style={{ flex: 1 }}>
                  <span className="badge badge-blue" style={{ marginBottom: 6, display: 'inline-block', fontSize: '0.6rem' }}>{item.category}</span>
                  <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: 4 }}>{item.name}</h3>
                  <p style={{ color: '#475569', fontSize: '0.8rem' }}>{item.brand}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(0,212,255,0.3)', borderRadius: 6, overflow: 'hidden' }}>
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    style={{ padding: '6px 12px', background: 'rgba(0,212,255,0.1)', border: 'none', color: '#00d4ff', cursor: 'pointer' }}><Minus size={12} /></button>
                  <span style={{ padding: '6px 14px', fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#e2e8f0' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    style={{ padding: '6px 12px', background: 'rgba(0,212,255,0.1)', border: 'none', color: '#00d4ff', cursor: 'pointer' }}><Plus size={12} /></button>
                </div>
                <div style={{ textAlign: 'right', minWidth: 100 }}>
                  <div style={{ fontFamily: 'Orbitron', fontSize: '1rem', color: '#00d4ff' }}>₹{(item.price * item.quantity).toLocaleString()}</div>
                  <div style={{ color: '#475569', fontSize: '0.75rem' }}>₹{item.price?.toLocaleString()} each</div>
                </div>
                <motion.button whileHover={{ scale: 1.2 }} onClick={() => removeFromCart(item._id)}
                  style={{ background: 'none', border: 'none', color: '#ff2d7d', cursor: 'pointer', display: 'flex', padding: 4 }}><Trash2 size={16} /></motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
          <div className="glass" style={{ borderRadius: 16, padding: 28 }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#00d4ff', marginBottom: 20 }}>ORDER SUMMARY</h3>
            {[['Subtotal', `₹${cartTotal.toLocaleString()}`], ['Shipping', shipping === 0 ? 'FREE' : `₹${shipping}`], ['GST (18%)', `₹${tax.toLocaleString()}`]].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: '#64748b', fontSize: '0.9rem' }}>
                <span>{label}</span>
                <span style={{ color: val === 'FREE' ? '#00ff88' : '#94a3b8' }}>{val}</span>
              </div>
            ))}
            <div className="divider-neon" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontFamily: 'Orbitron', fontSize: '0.85rem' }}>TOTAL</span>
              <span style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', color: '#00d4ff' }}>₹{total.toLocaleString()}</span>
            </div>
            {cartTotal < 50000 && <p style={{ color: '#475569', fontSize: '0.8rem', marginBottom: 16, textAlign: 'center' }}>Add ₹{(50000 - cartTotal).toLocaleString()} more for free shipping!</p>}
            <Link to="/checkout">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary"
                style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                PROCEED TO CHECKOUT <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: 16, color: '#475569', textDecoration: 'none', fontSize: '0.85rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:900px){.container > div:last-child{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
};

export default Cart;
