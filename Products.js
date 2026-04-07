import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)' }} className="grid-bg">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass"
        style={{ width: '100%', maxWidth: 440, padding: '48px 40px', borderRadius: 16, margin: '0 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }} style={{ display: 'inline-block', marginBottom: 16 }}>
            <Zap size={40} color="#00d4ff" fill="#00d4ff" />
          </motion.div>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '1.5rem', marginBottom: 8 }}>WELCOME BACK</h1>
          <p style={{ color: '#64748b' }}>Sign in to your Nexus Tech account</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(255,45,125,0.1)', border: '1px solid rgba(255,45,125,0.3)', color: '#ff2d7d', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: '0.9rem' }}>
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>EMAIL</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-cyber" style={{ paddingLeft: 40 }} placeholder="your@email.com" required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.8rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-cyber" style={{ paddingLeft: 40, paddingRight: 40 }} placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex' }}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            disabled={loading} className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '0.9rem', opacity: loading ? 0.7 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 28, color: '#475569' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#00d4ff', textDecoration: 'none', fontFamily: 'Orbitron', fontSize: '0.8rem' }}>REGISTER</Link>
        </div>

        {/* Demo credentials */}
        <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: 8, fontSize: '0.8rem', color: '#475569' }}>
          <p style={{ fontFamily: 'Orbitron', fontSize: '0.65rem', color: '#00d4ff', marginBottom: 6 }}>DEMO CREDENTIALS</p>
          <p>Admin: admin@nexustech.com / admin123</p>
          <p>User: user@nexustech.com / user123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
