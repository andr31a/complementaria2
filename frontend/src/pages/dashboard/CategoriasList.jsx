import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInterceptors';

const CategoriasList = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categorias?pageSize=20');
        setCategorias(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Módulo de Categorías</h2>
        <Link to="/dashboard/categorias/nueva" style={{ display: 'inline-block', background: 'var(--accent)', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>+ Nueva Categoría</Link>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Nombre</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Estatus</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Creado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>#{cat.id}</td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{cat.nombre}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: cat.activa ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: cat.activa ? '#10b981' : '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>
                      {cat.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CategoriasList;
