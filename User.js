import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer style={{ background: '#050b1a', borderTop: '1px solid rgba(0,212,255,0.15)', padding: '60px 0 24px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '48px' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Zap size={24} color="#00d4ff" fill="#00d4ff" />
            <span style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: '1.2rem', background: 'linear-gradient(135deg, #00d4ff, #b026ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NEXUS TECH</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '20px' }}>
            The future of PC building. Premium components, expert services, and cutting-edge technology.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[Github, Twitter, Instagram, Youtube].map((Icon, i) => (
              <motion.a key={i} href="#" whileHover={{ y: -3, color: '#00d4ff' }}
                style={{ color: '#475569', display: 'flex', padding: '8px', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '4px', transition: 'all 0.3s' }}>
                <Icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Links */}
        {[
          { title: 'Products', links: [{ to: '/products?category=CPU', label: 'Processors' }, { to: '/products?category=GPU', label: 'Graphics Cards' }, { to: '/products?category=RAM', label: 'Memory' }, { to: '/products?category=Motherboard', label: 'Motherboards' }, { to: '/products?category=Storage', label: 'Storage' }] },
          { title: 'Services', links: [{ to: '/services', label: 'PC Repair' }, { to: '/services', label: 'Custom Builds' }, { to: '/services', label: 'PC Upgrade' }, { to: '/builder', label: 'PC Builder' }, { to: '/services', label: 'Data Recovery' }] },
          { title: 'Company', links: [{ to: '/', label: 'About Us' }, { to: '/', label: 'Careers' }, { to: '/', label: 'Privacy Policy' }, { to: '/', label: 'Terms of Service' }, { to: '/', label: 'Refund Policy' }] },
        ].map(section => (
          <div key={section.title}>
            <h4 style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '2px', color: '#00d4ff', marginBottom: '16px', textTransform: 'uppercase' }}>{section.title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {section.links.map(link => (
                <Link key={link.label} to={link.to} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.3s' }}
                  onMouseEnter={e => e.target.style.color = '#94a3b8'}
                  onMouseLeave={e => e.target.style.color = '#64748b'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: 'Orbitron', fontSize: '0.8rem', letterSpacing: '2px', color: '#00d4ff', marginBottom: '16px', textTransform: 'uppercase' }}>Contact</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { Icon: Mail, text: 'support@nexustech.in' },
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: MapPin, text: 'Bengaluru, Karnataka, India' },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontSize: '0.9rem' }}>
                <Icon size={14} color="#00d4ff" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#475569', fontSize: '0.85rem', fontFamily: 'JetBrains Mono' }}>
          © 2025 NexusTech. All rights reserved.
        </p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['SECURED', 'ENCRYPTED', 'TRUSTED'].map(tag => (
            <span key={tag} className="badge badge-blue" style={{ fontSize: '0.6rem' }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
