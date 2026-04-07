@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');

:root {
  --bg-primary: #030712;
  --bg-secondary: #0a0f1e;
  --bg-card: rgba(10, 15, 30, 0.8);
  --bg-glass: rgba(255, 255, 255, 0.03);
  --neon-blue: #00d4ff;
  --neon-purple: #b026ff;
  --neon-cyan: #00fff0;
  --neon-pink: #ff2d7d;
  --neon-green: #00ff88;
  --accent-primary: #00d4ff;
  --accent-secondary: #b026ff;
  --text-primary: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --border-color: rgba(0, 212, 255, 0.15);
  --border-glow: rgba(0, 212, 255, 0.4);
  --gradient-primary: linear-gradient(135deg, #00d4ff, #b026ff);
  --gradient-secondary: linear-gradient(135deg, #b026ff, #ff2d7d);
  --shadow-neon: 0 0 20px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1);
  --shadow-purple: 0 0 20px rgba(176, 38, 255, 0.3), 0 0 60px rgba(176, 38, 255, 0.1);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Rajdhani', sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
  cursor: none;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--neon-blue); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--neon-purple); }

/* Custom Cursor */
.cursor {
  width: 12px; height: 12px;
  background: var(--neon-blue);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
  box-shadow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue);
}
.cursor-follower {
  width: 32px; height: 32px;
  border: 1px solid rgba(0, 212, 255, 0.5);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  transition: all 0.15s ease;
}
.cursor.clicking { transform: scale(0.6); }
.cursor-follower.clicking { transform: scale(1.5); border-color: var(--neon-purple); }

/* Typography */
h1, h2, h3, h4, h5, h6 { font-family: 'Orbitron', sans-serif; font-weight: 700; line-height: 1.2; }

/* Glassmorphism */
.glass {
  background: rgba(10, 15, 30, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
}
.glass-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* Neon Text */
.neon-text {
  color: var(--neon-blue);
  text-shadow: 0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue), 0 0 40px var(--neon-blue);
}
.neon-text-purple {
  color: var(--neon-purple);
  text-shadow: 0 0 10px var(--neon-purple), 0 0 20px var(--neon-purple), 0 0 40px var(--neon-purple);
}
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Neon Button */
.btn-neon {
  position: relative;
  padding: 12px 28px;
  background: transparent;
  border: 1px solid var(--neon-blue);
  color: var(--neon-blue);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.btn-neon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--neon-blue);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  z-index: -1;
}
.btn-neon:hover { color: var(--bg-primary); box-shadow: var(--shadow-neon); }
.btn-neon:hover::before { transform: scaleX(1); }

.btn-primary {
  padding: 12px 28px;
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: var(--shadow-neon); }

/* Card hover glow */
.card-glow {
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}
.card-glow:hover {
  border-color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.05);
  transform: translateY(-4px);
}

/* Animated grid background */
.grid-bg {
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Scanline effect */
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px);
  pointer-events: none;
  z-index: 1;
}

/* Input styles */
.input-cyber {
  width: 100%;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  clip-path: polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
}
.input-cyber:focus {
  border-color: var(--neon-blue);
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
}

/* Loading shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px var(--neon-blue); }
  50% { box-shadow: 0 0 20px var(--neon-blue), 0 0 40px var(--neon-blue); }
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes glitch {
  0%, 100% { clip-path: inset(0 0 100% 0); }
  10% { clip-path: inset(10% 0 60% 0); }
  20% { clip-path: inset(40% 0 20% 0); }
  30% { clip-path: inset(80% 0 5% 0); }
}
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.float { animation: float 6s ease-in-out infinite; }
.pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

/* Badge */
.badge {
  padding: 2px 10px;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  clip-path: polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%);
}
.badge-blue { background: rgba(0, 212, 255, 0.15); color: var(--neon-blue); border: 1px solid rgba(0,212,255,0.3); }
.badge-purple { background: rgba(176, 38, 255, 0.15); color: var(--neon-purple); border: 1px solid rgba(176,38,255,0.3); }
.badge-green { background: rgba(0, 255, 136, 0.15); color: var(--neon-green); border: 1px solid rgba(0,255,136,0.3); }
.badge-pink { background: rgba(255, 45, 125, 0.15); color: var(--neon-pink); border: 1px solid rgba(255,45,125,0.3); }

/* Divider */
.divider-neon {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
  margin: 24px 0;
}

/* Star rating */
.star { color: var(--neon-blue); font-size: 1.1rem; }
.star.empty { color: var(--text-muted); }

/* Tag */
.tag {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(0,212,255,0.08);
  border: 1px solid rgba(0,212,255,0.2);
  color: var(--text-secondary);
  font-size: 0.75rem;
  border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
}

/* Responsive container */
.container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }
@media (max-width: 768px) { .container { padding: 0 16px; } }

/* Section */
.section { padding: 80px 0; }
@media (max-width: 768px) { .section { padding: 48px 0; } }

/* Grid layouts */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }

@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .grid-4, .grid-3, .grid-2 { grid-template-columns: 1fr; }
}

/* Flex utilities */
.flex { display: flex; }
.flex-center { display: flex; align-items: center; justify-content: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }
.gap-6 { gap: 24px; }
