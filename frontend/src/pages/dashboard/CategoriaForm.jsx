import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInterceptors';

const CategoriaForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', descripcion: '', activa: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/categorias', formData);
      navigate('/dashboard/categorias');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la categoría.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px' }}>
        ← Volver
      </button>
      
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>Crear Nueva Categoría</h2>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Nombre de la Categoría *</label>
          <input 
            type="text" 
            required 
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
            placeholder="Ej. Normativas"
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Descripción</label>
           <textarea 
             value={formData.descripcion}
             onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
             style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', minHeight: '100px', resize: 'vertical' }}
             placeholder="Explica qué tipo de documentos irán aquí..."
           />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
           <input 
             type="checkbox" 
             checked={formData.activa}
             onChange={(e) => setFormData({...formData, activa: e.target.checked})}
             style={{ width: '18px', height: '18px' }}
           />
           <label style={{ color: 'var(--text-main)' }}>Categoría Activa (Visible)</label>
        </div>

        <button disabled={loading} type="submit" style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', marginTop: '10px' }}>
          {loading ? 'Guardando...' : 'Crear Categoría'}
        </button>
      </form>
    </motion.div>
  );
};

export default CategoriaForm;
