import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Monitor, Cpu, HardDrive, ShieldCheck, Download, Calendar, Clock, CheckCircle } from 'lucide-react';
import { serviceApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const services = [
  { icon: Wrench, name: 'PC Repair', desc: 'Hardware diagnostics, component replacement, and full system repair.', price: '₹499+', time: '1-3 days' },
  { icon: Monitor, name: 'PC Upgrade', desc: 'CPU, RAM, GPU, storage upgrades with compatibility check.', price: '₹299+', time: 'Same Day' },
  { icon: Cpu, name: 'Custom Build', desc: 'Full custom PC assembly from scratch. Gaming, workstation, or office.', price: '₹999+', time: '2-5 days' },
  { icon: HardDrive, name: 'Data Recovery', desc: 'Professional data recovery from failed drives and SSDs.', price: '₹1499+', time: '2-7 days' },
  { icon: ShieldCheck, name: 'Virus Removal', desc: 'Complete malware removal, antivirus setup, and system hardening.', price: '₹399+', time: 'Same Day' },
  { icon: Download, name: 'OS Installation', desc: 'Windows/Linux installation, driver setup, and software configuration.', price: '₹299+', time: 'Same Day' },
];

const serviceTypes = ['PC Repair', 'PC Upgrade', 'Custom Build', 'Data Recovery', 'Virus Removal', 'OS Installation', 'Hardware Diagnostics'];
const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

const Services = () => {
  const [form, setForm] = useState({ serviceType: '', description: '', scheduledDate: '', scheduledTime: '', serviceMode: 'dropoff', userNotes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book a service'); return; }
    setLoading(true);
    try {
      await serviceApi.create(form);
      setSuccess(true);
      toast.success('Service booked successfully!');
      setForm({ serviceType: '', description: '', scheduledDate: '', scheduledTime: '', serviceMode: 'dropoff', userNotes: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) { toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setLoading(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '80px 0 60px', background: 'radial-gradient(ellipse at center, rgba(176,38,255,0.08), transparent)', textAlign: 'center' }} className="grid-bg">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge badge-purple" style={{ marginBottom: 16, display: 'inline-block' }}>Expert Services</span>
            <h1 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.8rem, 5vw, 3rem)', marginBottom: 16 }}>PC <span className="gradient-text">REPAIR & SERVICES</span></h1>
            <p style={{ color: '#64748b', maxWidth: 600, margin: '0 auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
              Certified technicians ready to diagnose, repair, and upgrade your system. Fast turnaround, genuine parts, guaranteed quality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {services.map(({ icon: Icon, name, desc, price, time }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }} className="glass card-glow" style={{ padding: 28, borderRadius: 12, cursor: 'pointer' }}>
                <div style={{ width: 56, height: 56, background: 'rgba(176,38,255,0.1)', border: '1px solid rgba(176,38,255,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Icon size={24} color="#b026ff" />
                </div>
                <h3 style={{ fontFamily: 'Orbitron', fontSize: '0.9rem', marginBottom: 10, color: '#e2e8f0' }}>{name}</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>{desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Orbitron', color: '#00d4ff', fontSize: '0.9rem' }}>{price}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#475569', fontSize: '0.8rem' }}>
                    <Clock size={12} /> {time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'Orbitron', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 12 }}>BOOK A <span className="gradient-text">SERVICE</span></h2>
            <p style={{ color: '#64748b' }}>Schedule your appointment online. We'll confirm within 2 hours.</p>
          </motion.div>

          {success ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="glass" style={{ padding: 48, textAlign: 'center', borderRadius: 16, border: '1px solid rgba(0,255,136,0.3)' }}>
              <CheckCircle size={60} color="#00ff88" style={{ margin: '0 auto 20px', display: 'block' }} />
              <h3 style={{ fontFamily: 'Orbitron', fontSize: '1.2rem', color: '#00ff88', marginBottom: 12 }}>BOOKING CONFIRMED!</h3>
              <p style={{ color: '#64748b' }}>We'll send a confirmation to your email shortly.</p>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass" style={{ padding: '40px', borderRadius: 16 }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>SERVICE TYPE *</label>
                    <select value={form.serviceType} onChange={e => setForm(p => ({ ...p, serviceType: e.target.value }))}
                      className="input-cyber" required>
                      <option value="">Select service...</option>
                      {serviceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>SERVICE MODE *</label>
                    <select value={form.serviceMode} onChange={e => setForm(p => ({ ...p, serviceMode: e.target.value }))} className="input-cyber">
                      <option value="dropoff">Drop Off</option>
                      <option value="pickup">Pickup (We Come to You)</option>
                      <option value="doorstep">Doorstep Service</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>ISSUE DESCRIPTION *</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="input-cyber" style={{ width: '100%', height: 100, resize: 'vertical', paddingTop: 12 }}
                    placeholder="Describe the issue or what you need..." required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>
                      <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} /> PREFERRED DATE *
                    </label>
                    <input type="date" value={form.scheduledDate} min={today}
                      onChange={e => setForm(p => ({ ...p, scheduledDate: e.target.value }))}
                      className="input-cyber" required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> TIME SLOT *
                    </label>
                    <select value={form.scheduledTime} onChange={e => setForm(p => ({ ...p, scheduledTime: e.target.value }))} className="input-cyber" required>
                      <option value="">Select time...</option>
                      {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#64748b', fontSize: '0.75rem', fontFamily: 'Orbitron', letterSpacing: 1, marginBottom: 8 }}>ADDITIONAL NOTES</label>
                  <input value={form.userNotes} onChange={e => setForm(p => ({ ...p, userNotes: e.target.value }))}
                    className="input-cyber" placeholder="Any specific requirements..." />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={loading} className="btn-primary" style={{ padding: '14px', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'BOOKING...' : 'BOOK SERVICE'}
                </motion.button>
                {!user && <p style={{ color: '#ff2d7d', fontSize: '0.85rem', textAlign: 'center' }}>⚠ Please login to book a service</p>}
              </form>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
