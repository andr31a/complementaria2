import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/axiosInterceptors';
import useAuthStore from '../../store/useAuthStore';

const Overview = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ docs: 0, cats: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
         const [docsRes, catsRes] = await Promise.all([
           api.get('/documentos?pageSize=1'),
           api.get('/categorias?pageSize=1')
         ]);
         setStats({
           docs: docsRes.data.total || 0,
           cats: catsRes.data.total || 0
         });
      } catch (error) {
         console.error("Error cargando el resumen", error);
      } finally {
         setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Bienvenido de nuevo, {user?.nombre || 'Usuario'}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Gestión de documentos interactiva global centralizada.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Documentos</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, display:'inline-block', borderWidth: '3px'}}></span> : stats.docs}
          </p>
        </div>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Categorías</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 700 }}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, display:'inline-block', borderWidth: '3px'}}></span> : stats.cats}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
