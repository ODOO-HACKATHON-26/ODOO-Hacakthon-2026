import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Truck, LogIn, Eye, EyeOff, Zap } from 'lucide-react';
import classes from './Login.module.css';

// Generate floating orbs
const ORBS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size:  [120, 200, 160, 90, 140, 180, 110, 150][i],
  x:     [8, 75, 20, 85, 40, 60, 15, 70][i],
  y:     [10, 20, 70, 60, 40, 80, 50, 30][i],
  delay: [0, 2, 4, 1, 5, 3, 6, 1.5][i],
  dur:   [14, 18, 12, 20, 16, 22, 10, 17][i],
}));

const PARTICLES = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 8,
  dur: Math.random() * 6 + 8,
}));

const Login = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(email, password);
    setLoading(false);
    if (ok) navigate('/');
    else setError('Invalid credentials. Try alice@transitops.com / password');
  };

  return (
    <div className={classes.root}>
      {/* Animated gradient background */}
      <div className={classes.gradientBg} />

      {/* Floating orbs */}
      <div className={classes.orbsContainer}>
        {ORBS.map(o => (
          <div
            key={o.id}
            className={classes.orb}
            style={{
              width: o.size,
              height: o.size,
              left: `${o.x}%`,
              top: `${o.y}%`,
              animationDelay: `${o.delay}s`,
              animationDuration: `${o.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Floating particles */}
      <div className={classes.particlesContainer}>
        {PARTICLES.map(p => (
          <div
            key={p.id}
            className={classes.particle}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            }}
          />
        ))}
      </div>

      {/* Grid lines overlay */}
      <div className={classes.gridOverlay} />

      {/* Login Card */}
      <div className={classes.card}>
        {/* Top glow bar */}
        <div className={classes.cardGlow} />

        {/* Logo */}
        <div className={classes.logoWrap}>
          <div className={classes.logoIcon}>
            <Truck size={26} />
          </div>
          <div>
            <h1 className={classes.logoTitle}>TransitOps</h1>
            <p className={classes.logoSubtitle}>Fleet Intelligence Platform</p>
          </div>
        </div>

        {/* Heading */}
        <div className={classes.heading}>
          <h2 className={classes.title}>Welcome back</h2>
          <p className={classes.subtitle}>Sign in to your command center</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={classes.form}>
          {error && (
            <div className={classes.error}>
              <Zap size={14} />
              {error}
            </div>
          )}

          <div className={classes.field}>
            <label className={classes.label}>Email address</label>
            <div className={classes.inputWrap}>
              <input
                type="email"
                className={classes.input}
                placeholder="you@transitops.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={classes.field}>
            <label className={classes.label}>Password</label>
            <div className={classes.inputWrap}>
              <input
                type={showPw ? 'text' : 'password'}
                className={classes.input}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={classes.eyeBtn}
                onClick={() => setShowPw(!showPw)}
                tabIndex={-1}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className={classes.submitBtn} disabled={loading}>
            {loading ? (
              <span className={classes.spinner} />
            ) : (
              <>
                <LogIn size={17} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className={classes.hint}>
          <span className={classes.hintDot} />
          Demo: alice@transitops.com / password
        </div>
      </div>
    </div>
  );
};

export default Login;
