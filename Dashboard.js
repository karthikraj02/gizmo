import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, Truck, Star, ArrowRight, ChevronRight } from 'lucide-react';

const TypewriterText = ({ texts }) => {
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = texts[idx];
    const timeout = setTimeout(() => {
      if (!deleting) { if (charIdx < current.length) setCharIdx(c => c + 1); else setTimeout(() => setDeleting(true), 1500); }
      else { if (charIdx > 0) setCharIdx(c => c - 1); else { setDeleting(false); setIdx(i => (i + 1) % texts.length); } }
    }, deleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, texts]);
  return <span style={{ color: '#00d4ff', textShadow: '0 0 20px #00d4ff' }}>{texts[idx].slice(0, charIdx)}<span style={{ borderRight: '3px solid #00d4ff' }}>&#8203;</span></span>;
};

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Next-day delivery on 10,000+ products nationwide' },
  { icon: Shield, title: 'Warranty Assured', desc: '2-year warranty on all products with easy returns' },
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on orders above ₹50,000' },
  { icon: Cpu, title: 'Expert Support', desc: '24/7 technical support from certified engineers' },
];

const featured = [
  { name: 'Intel Core i9-14900K', category: 'CPU', price: 54999, rating: 5, badge: 'NEW' },
  { name: 'RTX 4090 Founders', category: 'GPU', price: 159999, rating: 5, badge: 'HOT' },
  { name: 'Corsair DDR5 32GB', category: 'RAM', price: 12999, rating: 4, badge: null },
  { name: 'Samsung 990 Pro 2TB', category: 'Storage', price: 18999, rating: 4, badge: 'SALE' },
];

const testimonials = [
  { name: 'Arjun Sharma', role: 'Pro Gamer', text: 'NexusTech built my dream gaming rig. Quality and service is unmatched!', rating: 5 },
  { name: 'Priya Menon', role: 'Content Creator', text: 'Got my workstation upgraded. Performance went through the roof!', rating: 5 },
  { name: 'Rahul Verma', role: 'Software Engineer', text: 'Best place for PC components. Genuine products, great prices.', rating: 5 },
];

const Home = () => (
  <div>
    {/* Hero */}
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }} className="grid-bg">
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,212,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(176,38,255,0.08) 0%, transparent 60%)' }} />
      <div className="container">
        <div style={{ maxWidth: 700 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="badge badge-blue" style={{ marginBottom: 24, display: 'inline-block' }}>⚡ Next-Gen PC Components</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: 24, fontFamily: 'Orbitron' }}>
            BUILD THE<br />
            <TypewriterText texts={['FUTURE', 'ULTIMATE RIG', 'IMPOSSIBLE', 'DREAM PC']} /><br />
            <span style={{ color: '#e2e8f0' }}>MACHINE</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            style={{ color: '#64748b', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: 40, maxWidth: 550 }}>
            Premium PC components, expert services, and cutting-edge technology. From budget builds to workstation beasts.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/products"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>Shop Now <ArrowRight size={16} /></motion.button></Link>
            <Link to="/builder"><motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-neon">Build Your PC</motion.button></Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ display: 'flex', gap: 40, marginTop: 48, flexWrap: 'wrap' }}>
            {[['10K+', 'Products'], ['50K+', 'Happy Customers'], ['5★', 'Avg Rating']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color: '#00d4ff', fontWeight: 900 }}>{val}</div>
                <div style={{ color: '#475569', fontSize: '0.85rem', letterSpacing: 1 }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="section" style={{ background: 'rgba(0,0,0,0.3)' }}>
      <div className="container">
        <div className="grid-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass card-glow" style={{ padding: 28, textAlign: 'center', borderRadius: 12 }}>
              <div style={{ width: 56, height: 56, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon size={24} color="#00d4ff" />
              </div>
              <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', marginBottom: 10, color: '#e2e8f0' }}>{title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Featured Products */}
    <section className="section">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-purple" style={{ marginBottom: 16, display: 'inline-block' }}>Featured</span>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 16 }}><span className="gradient-text">TOP PICKS</span> THIS WEEK</h2>
        </motion.div>
        <div className="grid-4">
          {featured.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ y: -8 }} className="glass card-glow" style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
                  <div style={{ background: 'rgba(0,212,255,0.05)', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <Cpu size={80} color="rgba(0,212,255,0.3)" />
                    {p.badge && <span className="badge badge-purple" style={{ position: 'absolute', top: 12, right: 12 }}>{p.badge}</span>}
                  </div>
                  <div style={{ padding: 16 }}>
                    <p style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 6 }}>{p.category}</p>
                    <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', marginBottom: 10, color: '#e2e8f0' }}>{p.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Orbitron', fontSize: '1.1rem', color: '#00d4ff' }}>₹{p.price.toLocaleString()}</span>
                      <div style={{ display: 'flex', gap: 2 }}>{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < p.rating ? '#00d4ff' : 'none'} color={j < p.rating ? '#00d4ff' : '#475569'} />)}</div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/products"><motion.button whileHover={{ scale: 1.05 }} className="btn-neon" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>View All Products <ChevronRight size={16} /></motion.button></Link>
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>WHAT OUR <span className="gradient-text">CUSTOMERS</span> SAY</h2>
        </motion.div>
        <div className="grid-3">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass card-glow" style={{ padding: 28, borderRadius: 12 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>{[...Array(t.rating)].map((_, j) => <Star key={j} size={14} fill="#00d4ff" color="#00d4ff" />)}</div>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#e2e8f0' }}>{t.name}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: 4 }}>{t.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(176,38,255,0.08))', borderTop: '1px solid rgba(0,212,255,0.2)', textAlign: 'center' }}>
      <div className="container">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: 16 }}>
          READY TO BUILD YOUR <span className="gradient-text">DREAM RIG?</span>
        </motion.h2>
        <p style={{ color: '#64748b', marginBottom: 32, fontSize: '1.1rem' }}>Join 50,000+ customers who trust NexusTech.</p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register"><motion.button whileHover={{ scale: 1.05 }} className="btn-primary" style={{ padding: '14px 36px' }}>Get Started Free</motion.button></Link>
          <Link to="/services"><motion.button whileHover={{ scale: 1.05 }} className="btn-neon" style={{ padding: '14px 36px' }}>Book a Service</motion.button></Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
