import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInterceptors';

const DocumentosList = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documentos?pageSize=20');
        setDocumentos(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.8rem' }}>Directorio de Documentos</h2>
        <Link to="/dashboard/documentos/nuevo" style={{ background: 'var(--accent)', color: 'white', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>+ Nuevo Doc</Link>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Título</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Tipo</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Estado</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Peso</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="spinner" style={{ margin: '0 auto' }}></div>
                </td>
              </tr>
            ) : documentos.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No hay documentos registrados.
                </td>
              </tr>
            ) : (
              documentos.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px' }}>{doc.titulo}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{doc.tipo.split('/')[1] || doc.tipo}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                     <span style={{ color: doc.estado === 'publicado' ? '#10b981' : '#f59e0b' }}>● {doc.estado}</span>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{doc.peso}</td>
                  <td style={{ padding: '16px' }}>
                    <Link to={`/dashboard/documentos/editar/${doc.id}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: '500' }}>✏️ Editar</Link>
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

export default DocumentosList;
