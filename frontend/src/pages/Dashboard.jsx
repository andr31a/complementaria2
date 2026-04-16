import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, FileText, Settings, User, LayoutDashboard } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Helmet } from 'react-helmet-async';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    color: isActive ? 'var(--accent)' : 'var(--text-muted)',
    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Helmet>
        <title>Panel de Control | MiUNE 2.0</title>
      </Helmet>
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }} animate={{ x: 0 }}
        className="glass-panel"
        style={{ width: '250px', borderRadius: 0, padding: '24px', display: 'flex', flexDirection: 'column' }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '40px' }}>
          <span style={{ background: 'var(--accent-grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MiUNE</span>
        </h2>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <NavLink to="/dashboard" end style={navLinkStyle}>
            <LayoutDashboard size={20} />
            <span>Resumen</span>
          </NavLink>
          <NavLink to="/dashboard/documentos" style={navLinkStyle}>
            <FileText size={20} />
            <span>Documentos</span>
          </NavLink>
          <NavLink to="/dashboard/categorias" style={navLinkStyle}>
            <User size={20} />
            <span>Categorías</span>
          </NavLink>
          {user?.role === 'ADMIN' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.5 }}>
              <Settings size={20} />
              <span>Ajustes</span>
            </div>
          )}
        </nav>
        
        <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s ease' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
          <LogOut size={18} color="var(--danger)" />
          <span>Cerrar Sesión</span>
        </button>
      </motion.aside>
      
      {/* Main Content Render */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
