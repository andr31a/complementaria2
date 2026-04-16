import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import api from '../api/axiosInterceptors';

import { Helmet } from 'react-helmet-async';

const Login = () => {
  const loginFn = useAuthStore(state => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.token) {
        const token = res.data.token;
        const profileRes = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
        loginFn(profileRes.data.data, token);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
         setError(err.response.data.message);
      } else {
         setError('Error de conexión o credenciales incorrectas.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <Helmet>
        <title>Iniciar Sesión - MiUNE 2.0</title>
        <meta name="description" content="Portal de gestión documental académica MiUNE. Inicia sesión para acceder." />
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '420px', padding: '40px', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: -100, right: -100, width: 250, height: 250, background: 'var(--accent)', filter: 'blur(100px)', opacity: 0.3, borderRadius: '50%' }} />
        
        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2.2rem', fontWeight: 700 }}>
          <span style={{ background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MiUNE</span> 2.0
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>Gestión Documental Avanzada</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} size={20} />
              <input 
                type="email" 
                className="input-field" 
                style={{ paddingLeft: '44px' }}
                placeholder="ejemplo@miune.edu.ec"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} size={20} />
              <input 
                type="password" 
                className="input-field" 
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-text" style={{ marginBottom: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </motion.div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? <div className="spinner" /> : 'Ingresar al panel'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
