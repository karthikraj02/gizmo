import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="grid-bg">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass"
        style={{ width: '100%', maxWidth: 440, padding: '48px 40px', borderRadius: 16, margin: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Zap size={40} color="#00d4ff" fill="#00d4ff" style={{ marginBottom: 16 }} />
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', marginBottom: 8 }}>CREATE ACCOUNT</h1>
          <p style={{ color: '#64748b' }}>Join the Nexus Tech community</p>
        </div>
        {error && <div style={{ background: 'rgba(255,45,125,0.1)', border: '1px solid rgba(255,45,125,0.3)', color: '#ff2d7d', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { key: 'name', label: 'FULL NAME', icon: User, type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'EMAIL', icon: Mail, type: 'email', placeholder: 'your@email.com' },
            { key: 'password', label: 'PASSWORD', icon: Lock, type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'CONFIRM PASSWORD', icon: Lock, type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="input-cyber" style={{ paddingLeft: 40 }} placeholder={placeholder} required />
              </div>
            </div>
          ))}
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading} className="btn-primary" style={{ width: '100%', padding: '14px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </motion.button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 28, color: '#475569' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>SIGN IN</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
