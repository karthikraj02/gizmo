import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ArrowLeft, Package, Shield, Truck, Plus, Minus } from 'lucide-react';
import { productApi } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [recommendations, setRecommendations] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      try {
        const [prod, recs] = await Promise.all([productApi.getOne(id), productApi.getRecommendations(id)]);
        setProduct(prod.data);
        setRecommendations(recs.data);
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add a review'); return; }
    try {
      await productApi.addReview(id, reviewForm);
      toast.success('Review added!');
      const { data } = await productApi.getOne(id);
      setProduct(data);
    } catch (err) { toast.error(err.response?.data?.message || 'Error adding review'); }
  };

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 50, height: 50, border: '3px solid rgba(0,212,255,0.2)', borderTop: '3px solid #00d4ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!product) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>Product not found</div>;

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#64748b', textDecoration: 'none', marginBottom: 32, fontFamily: 'Orbitron', fontSize: '0.75rem' }}>
        <ArrowLeft size={16} /> BACK TO STORE
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 60 }}>
        {/* Images */}
        <div>
          <motion.div className="glass" style={{ borderRadius: 16, overflow: 'hidden', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            {product.images?.[activeImage]
              ? <img src={product.images[activeImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ fontFamily: 'Orbitron', fontSize: '6rem', color: 'rgba(0,212,255,0.15)' }}>{product.category?.[0]}</div>
            }
          </motion.div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {product.images.map((img, i) => (
                <motion.div key={i} whileHover={{ scale: 1.05 }} onClick={() => setActiveImage(i)}
                  style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImage === i ? '#00d4ff' : 'transparent'}` }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge badge-blue" style={{ marginBottom: 12, display: 'inline-block' }}>{product.category}</span>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginBottom: 12, lineHeight: 1.3 }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 3 }}>{[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(product.rating) ? '#00d4ff' : 'none'} color={i < Math.round(product.rating) ? '#00d4ff' : '#475569'} />)}</div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>
          <div style={{ marginBottom: 24 }}>
            <span style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: '#00d4ff' }}>₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && <span style={{ color: '#475569', textDecoration: 'line-through', marginLeft: 12, fontSize: '1.1rem' }}>₹{product.originalPrice?.toLocaleString()}</span>}
          </div>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-pink'}`}>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span>
            <span style={{ color: '#475569', fontSize: '0.85rem' }}>Brand: <span style={{ color: '#94a3b8' }}>{product.brand}</span></span>
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ color: '#64748b', fontFamily: 'Orbitron', fontSize: '0.75rem' }}>QTY</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(0,212,255,0.3)', borderRadius: 6, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ padding: '8px 14px', background: 'rgba(0,212,255,0.1)', border: 'none', color: '#00d4ff', cursor: 'pointer' }}><Minus size={14} /></button>
              <span style={{ padding: '8px 20px', fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#e2e8f0' }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                style={{ padding: '8px 14px', background: 'rgba(0,212,255,0.1)', border: 'none', color: '#00d4ff', cursor: 'pointer' }}><Plus size={14} /></button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0} className="btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', opacity: product.stock === 0 ? 0.5 : 1 }}>
              <ShoppingCart size={18} /> ADD TO CART
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} style={{ padding: '14px 16px', background: 'rgba(255,45,125,0.1)', border: '1px solid rgba(255,45,125,0.3)', color: '#ff2d7d', cursor: 'pointer', borderRadius: 4 }}>
              <Heart size={18} />
            </motion.button>
          </div>

          <div style={{ display: 'flex', gap: 20, marginTop: 24, paddingTop: 24, borderTop: '1px solid rgba(0,212,255,0.1)' }}>
            {[{ icon: Shield, text: '2 Year Warranty' }, { icon: Truck, text: 'Free Shipping' }, { icon: Package, text: 'Easy Returns' }].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.8rem' }}>
                <Icon size={14} color="#00d4ff" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs */}
      {product.specs && product.specs.size > 0 && (
        <div className="glass" style={{ borderRadius: 16, padding: 32, marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', marginBottom: 20, color: '#00d4ff' }}>SPECIFICATIONS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
            {[...product.specs.entries()].map(([key, val]) => (
              <div key={key} style={{ display: 'flex', background: 'rgba(10,15,30,0.8)', padding: '12px 16px' }}>
                <span style={{ color: '#475569', fontSize: '0.85rem', minWidth: 120, fontFamily: 'JetBrains Mono' }}>{key}</span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="glass" style={{ borderRadius: 16, padding: 32 }}>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', marginBottom: 24, color: '#00d4ff' }}>REVIEWS ({product.numReviews})</h2>
        {product.reviews?.map(r => (
          <div key={r._id} style={{ padding: '16px 0', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <div style={{ display: 'flex', gap: 3, marginBottom: 6 }}>{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? '#00d4ff' : 'none'} color={i < r.rating ? '#00d4ff' : '#475569'} />)}</div>
            <p style={{ color: '#94a3b8', marginBottom: 8 }}>{r.comment}</p>
            <span style={{ color: '#475569', fontSize: '0.8rem', fontFamily: 'Orbitron' }}>— {r.name}</span>
          </div>
        ))}
        {user && (
          <form onSubmit={handleAddReview} style={{ marginTop: 24 }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>WRITE A REVIEW</h3>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={24} fill={s <= reviewForm.rating ? '#00d4ff' : 'none'} color={s <= reviewForm.rating ? '#00d4ff' : '#475569'}
                  style={{ cursor: 'pointer' }} onClick={() => setReviewForm(p => ({ ...p, rating: s }))} />
              ))}
            </div>
            <textarea value={reviewForm.comment} onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
              className="input-cyber" style={{ width: '100%', height: 100, resize: 'vertical', paddingTop: 12 }}
              placeholder="Share your experience..." required />
            <motion.button type="submit" whileHover={{ scale: 1.02 }} className="btn-primary" style={{ marginTop: 12, padding: '10px 24px' }}>
              Submit Review
            </motion.button>
          </form>
        )}
      </div>

      <style>{`.container > div > div { display: grid; } @media(max-width:768px) { .container > div:nth-child(2) > div { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
};

export default ProductDetail;
