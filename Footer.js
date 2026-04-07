import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Cpu, Calendar, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderApi, serviceApi, buildApi } from '../utils/api';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: User, exact: true },
  { to: '/dashboard/orders', label: 'Orders', icon: Package },
  { to: '/dashboard/builds', label: 'My Builds', icon: Cpu },
  { to: '/dashboard/bookings', label: 'Services', icon: Calendar },
  { to: '/dashboard/profile', label: 'Profile', icon: Settings },
];

const statusColors = { pending: '#fbbf24', confirmed: '#00d4ff', processing: '#b026ff', shipped: '#00ff88', delivered: '#00ff88', cancelled: '#ff2d7d', 'in-progress': '#b026ff', completed: '#00ff88' };

const Overview = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    Promise.all([orderApi.getMy(), serviceApi.getMy()]).then(([o, b]) => { setOrders(o.data.slice(0, 3)); setBookings(b.data.slice(0, 3)); }).catch(() => {});
  }, []);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[['Total Orders', orders.length, Package, '#00d4ff'], ['Active Bookings', bookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length, Calendar, '#b026ff'], ['Wishlist', user?.wishlist?.length || 0, ShoppingBag, '#00ff88']].map(([label, val, Icon, color]) => (
          <div key={label} className="glass" style={{ padding: 20, borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: 'Orbitron', fontSize: '2rem', color }}>{val}</div>
              </div>
              <Icon size={24} color={color} style={{ opacity: 0.5 }} />
            </div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 16 }}>RECENT ORDERS</h3>
      {orders.length === 0 ? <p style={{ color: '#475569' }}>No orders yet. <Link to="/products" style={{ color: '#00d4ff' }}>Shop now!</Link></p> :
        orders.map(order => (
          <div key={order._id} className="glass" style={{ padding: '14px 20px', borderRadius: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#475569' }}>#{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: 2 }}>{order.items?.length} items</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Orbitron', color: '#00d4ff' }}>₹{order.totalPrice?.toLocaleString()}</div>
              <span style={{ fontSize: '0.75rem', color: statusColors[order.status] || '#64748b', textTransform: 'uppercase', fontFamily: 'Orbitron' }}>{order.status}</span>
            </div>
          </div>
        ))}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { orderApi.getMy().then(r => setOrders(r.data)).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ color: '#64748b' }}>Loading orders...</div>;
  if (orders.length === 0) return <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>No orders found. <Link to="/products" style={{ color: '#00d4ff' }}>Start shopping!</Link></div>;
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: 20, color: '#00d4ff' }}>ORDER HISTORY</h2>
      {orders.map(order => (
        <div key={order._id} className="glass card-glow" style={{ padding: '20px', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#00d4ff' }}>#{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: 2 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge`} style={{ color: statusColors[order.status], border: `1px solid ${statusColors[order.status]}30`, background: `${statusColors[order.status]}15`, display: 'inline-block', marginBottom: 4 }}>
                {order.status?.toUpperCase()}
              </span>
              <div style={{ fontFamily: 'Orbitron', color: '#00d4ff' }}>₹{order.totalPrice?.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{order.items?.map(i => i.name).join(', ')}</div>
          {order.trackingNumber && <div style={{ marginTop: 8, fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#b026ff' }}>Tracking: {order.trackingNumber}</div>}
        </div>
      ))}
    </div>
  );
};

const Builds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { buildApi.getMy().then(r => setBuilds(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ color: '#64748b' }}>Loading builds...</div>;
  if (builds.length === 0) return <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>No saved builds. <Link to="/builder" style={{ color: '#00d4ff' }}>Build your PC!</Link></div>;
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: 20, color: '#00d4ff' }}>SAVED BUILDS</h2>
      {builds.map(build => (
        <div key={build._id} className="glass card-glow" style={{ padding: '20px', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', color: '#e2e8f0', marginBottom: 4 }}>{build.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Compatibility: <span style={{ color: build.compatibilityScore >= 80 ? '#00ff88' : 'orange' }}>{build.compatibilityScore}%</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Orbitron', color: '#00d4ff', fontSize: '1.1rem' }}>₹{build.totalPrice?.toLocaleString()}</div>
              <div style={{ color: '#475569', fontSize: '0.75rem' }}>{new Date(build.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { serviceApi.getMy().then(r => setBookings(r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ color: '#64748b' }}>Loading bookings...</div>;
  if (bookings.length === 0) return <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>No service bookings. <Link to="/services" style={{ color: '#00d4ff' }}>Book a service!</Link></div>;
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: 20, color: '#00d4ff' }}>SERVICE BOOKINGS</h2>
      {bookings.map(booking => (
        <div key={booking._id} className="glass card-glow" style={{ padding: '20px', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#e2e8f0', marginBottom: 4 }}>{booking.serviceType}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem', marginBottom: 4 }}>{booking.description?.slice(0, 80)}...</div>
              <div style={{ color: '#475569', fontSize: '0.8rem' }}>{new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</div>
            </div>
            <span style={{ color: statusColors[booking.status], border: `1px solid ${statusColors[booking.status]}30`, background: `${statusColors[booking.status]}15`, padding: '3px 10px', borderRadius: 4, fontFamily: 'Orbitron', fontSize: '0.65rem' }}>
              {booking.status?.toUpperCase()}
            </span>
          </div>
          {booking.technicianNotes && <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(0,212,255,0.05)', borderRadius: 6, fontSize: '0.85rem', color: '#64748b' }}>Technician: {booking.technicianNotes}</div>}
        </div>
      ))}
    </div>
  );
};

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try { await updateProfile(form); } catch { toast.error('Update failed'); } finally { setLoading(false); }
  };
  return (
    <div style={{ maxWidth: 500 }}>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', marginBottom: 20, color: '#00d4ff' }}>PROFILE SETTINGS</h2>
      <div className="glass" style={{ padding: 28, borderRadius: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #00d4ff, #b026ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron', fontSize: '1.5rem', color: 'white' }}>{user?.name?.[0]}</div>
        <div>
          <div style={{ fontFamily: 'Orbitron', color: '#e2e8f0' }}>{user?.name}</div>
          <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{user?.email}</div>
          <span className={`badge ${user?.role === 'admin' ? 'badge-purple' : 'badge-blue'}`} style={{ marginTop: 6, display: 'inline-block' }}>{user?.role?.toUpperCase()}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[['name', 'Full Name', 'text'], ['phone', 'Phone Number', 'tel']].map(([key, label, type]) => (
          <div key={key}>
            <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="input-cyber" />
          </div>
        ))}
        <motion.button type="submit" whileHover={{ scale: 1.02 }} disabled={loading} className="btn-primary" style={{ padding: '12px', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'SAVING...' : 'SAVE CHANGES'}
        </motion.button>
      </form>
    </div>
  );
};

const Dashboard = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32 }}>
      <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
        <div className="glass" style={{ borderRadius: 16, padding: '8px 0', overflow: 'hidden' }}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === '/dashboard' ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ x: 4, backgroundColor: 'rgba(0,212,255,0.08)' }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer', background: active ? 'rgba(0,212,255,0.1)' : 'transparent', borderLeft: active ? '3px solid #00d4ff' : '3px solid transparent', transition: 'all 0.2s' }}>
                  <Icon size={18} color={active ? '#00d4ff' : '#475569'} />
                  <span style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', letterSpacing: 1, color: active ? '#00d4ff' : '#475569' }}>{label}</span>
                </motion.div>
              </Link>
            );
          })}
          <div style={{ borderTop: '1px solid rgba(0,212,255,0.1)', margin: '8px 0' }} />
          <motion.div whileHover={{ x: 4 }} onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', cursor: 'pointer' }}>
            <LogOut size={18} color="#ff2d7d" />
            <span style={{ fontFamily: 'Orbitron', fontSize: '0.75rem', color: '#ff2d7d' }}>LOGOUT</span>
          </motion.div>
        </div>
      </div>
      <div>
        <Routes>
          <Route index element={<Overview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="builds" element={<Builds />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
      <style>{`@media(max-width:768px){.container{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
};

export default Dashboard;
