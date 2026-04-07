import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart2, Package, Users, Calendar, Settings, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { adminApi, productApi, orderApi, serviceApi } from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: BarChart2 },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: Settings },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/services', label: 'Services', icon: Calendar },
];

const COLORS = ['#00d4ff', '#b026ff', '#ff2d7d', '#00ff88', '#fbbf24', '#60a5fa'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminApi.getDashboard().then(r => setData(r.data)).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false)); }, []);
  if (loading) return <div style={{ color: '#64748b' }}>Loading dashboard...</div>;
  if (!data) return null;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[['Total Revenue', `₹${data.totalRevenue?.toLocaleString()}`, '#00d4ff'], ['Orders', data.totalOrders, '#b026ff'], ['Users', data.totalUsers, '#00ff88'], ['Products', data.totalProducts, '#fbbf24']].map(([label, val, color]) => (
          <div key={label} className="glass" style={{ padding: 20, borderRadius: 12 }}>
            <div style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', marginBottom: 8 }}>{label}</div>
            <div style={{ fontFamily: 'Orbitron', fontSize: '1.6rem', color }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 16 }}>MONTHLY REVENUE</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthlyRevenue}>
              <XAxis dataKey="_id.month" tick={{ fill: '#475569', fontSize: 12 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="#00d4ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 16 }}>BY CATEGORY</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data.categoryRevenue} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" outerRadius={80}>
                {data.categoryRevenue?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass" style={{ borderRadius: 16, padding: 24 }}>
        <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.85rem', color: '#00d4ff', marginBottom: 16 }}>RECENT ORDERS</h3>
        {data.recentOrders?.map(order => (
          <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#00d4ff' }}>#{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem' }}>{order.user?.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Orbitron', color: '#e2e8f0' }}>₹{order.totalPrice?.toLocaleString()}</div>
              <div style={{ color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>{order.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', category: 'CPU', brand: '', description: '', stock: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => { productApi.getAll({ limit: 50 }).then(r => setProducts(r.data.products)).catch(() => {}); }, []);
  const handleCreate = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const { data } = await productApi.create({ ...form, price: Number(form.price), stock: Number(form.stock) });
      setProducts(p => [data, ...p]); setShowForm(false); toast.success('Product created!');
      setForm({ name: '', price: '', category: 'CPU', brand: '', description: '', stock: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await productApi.delete(id); setProducts(p => p.filter(x => x._id !== id)); toast.success('Deleted!'); }
    catch { toast.error('Delete failed'); }
  };
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', color: '#00d4ff' }}>PRODUCTS ({products.length})</h2>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff', padding: '8px 16px', cursor: 'pointer', borderRadius: 6, fontFamily: 'Orbitron', fontSize: '0.7rem' }}>
          <PlusCircle size={16} /> ADD PRODUCT
        </motion.button>
      </div>
      {showForm && (
        <div className="glass" style={{ padding: 24, borderRadius: 16, marginBottom: 20 }}>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['name','Name'], ['brand','Brand'], ['price','Price'], ['stock','Stock']].map(([k,l]) => (
              <div key={k}>
                <label style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontFamily: 'Orbitron', marginBottom: 6 }}>{l}</label>
                <input value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="input-cyber" required />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontFamily: 'Orbitron', marginBottom: 6 }}>CATEGORY</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-cyber">
                {['CPU','GPU','RAM','Motherboard','Storage','PSU','Cooling','Case','Accessories'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', color: '#64748b', fontSize: '0.7rem', fontFamily: 'Orbitron', marginBottom: 6 }}>DESCRIPTION</label>
              <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-cyber" />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} disabled={loading} className="btn-primary" style={{ flex: 1, opacity: loading ? 0.7 : 1 }}>CREATE</motion.button>
              <motion.button type="button" whileHover={{ scale: 1.02 }} onClick={() => setShowForm(false)} className="btn-neon" style={{ flex: 1 }}>CANCEL</motion.button>
            </div>
          </form>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {products.map(p => (
          <div key={p._id} className="glass" style={{ padding: '14px 20px', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#e2e8f0' }}>{p.name}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem', marginTop: 2 }}>{p.brand} · {p.category} · Stock: {p.stock}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontFamily: 'Orbitron', color: '#00d4ff' }}>₹{p.price?.toLocaleString()}</span>
              <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleDelete(p._id)}
                style={{ background: 'none', border: 'none', color: '#ff2d7d', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { orderApi.getAll().then(r => setOrders(r.data)).catch(() => {}); }, []);
  const updateStatus = async (id, status) => {
    try { await orderApi.updateStatus(id, { status }); setOrders(p => p.map(o => o._id === id ? { ...o, status } : o)); toast.success('Status updated!'); }
    catch { toast.error('Update failed'); }
  };
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', color: '#00d4ff', marginBottom: 20 }}>ALL ORDERS ({orders.length})</h2>
      {orders.map(order => (
        <div key={order._id} className="glass" style={{ padding: '16px 20px', borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#00d4ff' }}>#{order._id.slice(-8).toUpperCase()}</div>
              <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{order.user?.name} — {order.user?.email}</div>
              <div style={{ color: '#475569', fontSize: '0.8rem' }}>{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} items</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'Orbitron', color: '#00d4ff' }}>₹{order.totalPrice?.toLocaleString()}</span>
              <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)} className="input-cyber" style={{ width: 130, padding: '6px 10px', fontSize: '0.8rem' }}>
                {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => { adminApi.getUsers().then(r => setUsers(r.data)).catch(() => {}); }, []);
  const toggleRole = async (id, role) => {
    try { await adminApi.updateUser(id, { role }); setUsers(p => p.map(u => u._id === id ? { ...u, role } : u)); toast.success('Role updated!'); }
    catch { toast.error('Update failed'); }
  };
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', color: '#00d4ff', marginBottom: 20 }}>ALL USERS ({users.length})</h2>
      {users.map(user => (
        <div key={user._id} className="glass" style={{ padding: '14px 20px', borderRadius: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#e2e8f0' }}>{user.name}</div>
            <div style={{ color: '#475569', fontSize: '0.8rem' }}>{user.email}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className={`badge ${user.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{user.role}</span>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => toggleRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
              style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', padding: '4px 12px', cursor: 'pointer', borderRadius: 4, fontFamily: 'Orbitron', fontSize: '0.65rem' }}>
              TOGGLE
            </motion.button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminServices = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => { serviceApi.getAll().then(r => setBookings(r.data)).catch(() => {}); }, []);
  const updateStatus = async (id, status) => {
    try { await serviceApi.updateStatus(id, { status }); setBookings(p => p.map(b => b._id === id ? { ...b, status } : b)); toast.success('Updated!'); }
    catch { toast.error('Update failed'); }
  };
  return (
    <div>
      <h2 style={{ fontFamily: 'Orbitron', fontSize: '1rem', color: '#00d4ff', marginBottom: 20 }}>SERVICE BOOKINGS ({bookings.length})</h2>
      {bookings.map(booking => (
        <div key={booking._id} className="glass" style={{ padding: '16px 20px', borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', color: '#e2e8f0' }}>{booking.serviceType}</div>
              <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{booking.user?.name} · {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}</div>
            </div>
            <select value={booking.status} onChange={e => updateStatus(booking._id, e.target.value)} className="input-cyber" style={{ width: 140, padding: '6px 10px', fontSize: '0.8rem' }}>
              {['pending','confirmed','in-progress','completed','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

const Admin = () => {
  const location = useLocation();
  return (
    <div className="container" style={{ padding: '40px 24px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>
      <div style={{ position: 'sticky', top: 90, height: 'fit-content' }}>
        <div style={{ marginBottom: 12 }}>
          <span className="badge badge-purple" style={{ fontSize: '0.6rem' }}>ADMIN PANEL</span>
        </div>
        <div className="glass" style={{ borderRadius: 16, padding: '8px 0' }}>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = to === '/admin' ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <motion.div whileHover={{ x: 4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', background: active ? 'rgba(176,38,255,0.1)' : 'transparent', borderLeft: active ? '3px solid #b026ff' : '3px solid transparent' }}>
                  <Icon size={18} color={active ? '#b026ff' : '#475569'} />
                  <span style={{ fontFamily: 'Orbitron', fontSize: '0.72rem', letterSpacing: 1, color: active ? '#b026ff' : '#475569' }}>{label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
