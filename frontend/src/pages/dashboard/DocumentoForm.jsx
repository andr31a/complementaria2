import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInterceptors';
import useAuthStore from '../../store/useAuthStore';

const DocumentoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const isEditing = Boolean(id);

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    titulo: '',
    resumen: '',
    estado: 'borrador',
    categoriaId: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Cargar Categorías para el Select
    const fetchCats = async () => {
      try {
         const res = await api.get('/categorias?activa=true&pageSize=100');
         setCategorias(res.data.data);
         if (res.data.data.length > 0 && !isEditing) {
            setFormData(prev => ({ ...prev, categoriaId: res.data.data[0].id }));
         }
      } catch (err) {
         console.error("Error al cargar categorías");
      }
    };
    fetchCats();

    // Si es edición, traer data del doc
    if (isEditing) {
      const fetchDoc = async () => {
        try {
           const res = await api.get(`/documentos/${id}`);
           const d = res.data.data;
           setFormData({
             titulo: d.titulo,
             estado: d.estado,
             resumen: d.resumen || '',
             categoriaId: d.categoriaId
           });
        } catch(err) {
           setError("Documento no encontrado o no disponible.");
        }
      };
      fetchDoc();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Es Mandatario enviar FormData para Multer/Cloudinary
    const encTypeData = new FormData();
    encTypeData.append('titulo', formData.titulo);
    encTypeData.append('estado', formData.estado);
    if (formData.resumen) encTypeData.append('resumen', formData.resumen);
    encTypeData.append('categoriaId', formData.categoriaId);
    
    // Al crear un documento, se ancla su autor
    if (!isEditing && user) {
        encTypeData.append('usuarioId', user.id);
    }
    
    if (file) {
        encTypeData.append('archivo', file);
    }

    try {
       if (isEditing) {
           await api.put(`/documentos/${id}`, encTypeData, {
               headers: { 'Content-Type': 'multipart/form-data' }
           });
       } else {
           if (!file) throw new Error("El archivo adjunto es obligatorio para documentos nuevos.");
           await api.post('/documentos', encTypeData, {
               headers: { 'Content-Type': 'multipart/form-data' }
           });
       }
       navigate('/dashboard/documentos');
    } catch (err) {
       setError(err.response?.data?.message || err.message || 'Error en el servidor');
    } finally {
       setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '20px' }}>
        ← Volver
      </button>
      
      <h2 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>{isEditing ? 'Editar Documento Existente' : 'Subir Nuevo Documento'}</h2>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {error && <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px' }}>{error}</div>}
        
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Título del Documento *</label>
          <input 
            type="text" 
            required 
            value={formData.titulo}
            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Categoría Afinidad *</label>
            <select 
              value={formData.categoriaId}
              required
              onChange={(e) => setFormData({...formData, categoriaId: e.target.value})}
              style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', WebkitAppearance: 'none' }}
            >
              {categorias.map(cat => (
                 <option key={cat.id} value={cat.id} style={{ color: 'black' }}>{cat.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Estado Público *</label>
            <select 
              value={formData.estado}
              onChange={(e) => setFormData({...formData, estado: e.target.value})}
              style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', WebkitAppearance: 'none' }}
            >
               <option value="borrador" style={{ color: 'black' }}>Borrador (Oculto)</option>
               <option value="publicado" style={{ color: 'black' }}>Publicado (Visible)</option>
               <option value="archivado" style={{ color: 'black' }}>Archivado</option>
            </select>
          </div>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Resumen / Abstract</label>
           <textarea 
             value={formData.resumen}
             onChange={(e) => setFormData({...formData, resumen: e.target.value})}
             style={{ width: '100%', padding: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', minHeight: '80px', resize: 'vertical' }}
           />
        </div>

        <div style={{ padding: '20px', border: '2px dashed var(--border)', borderRadius: '8px', textAlign: 'center' }}>
           <label style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>
              {file ? `✅ Archivo Seleccionado: ${file.name}` : isEditing ? 'Reemplazar Archivo (Opcional)' : '📎 Haz Clic Aquí Para Seleccionar un Archivo (Solo PDFs, Imágenes, Docx) *'}
              <input 
                type="file" 
                style={{ display: 'none' }} 
                onChange={(e) => setFile(e.target.files[0])} 
                accept="application/pdf, image/jpeg, image/png, image/webp, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
           </label>
        </div>

        <button disabled={loading} type="submit" style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '500', marginTop: '10px' }}>
          {loading ? 'Subiendo a la Nube...' : (isEditing ? 'Actualizar Documento' : 'Crear Documento y Subir')}
        </button>
      </form>
    </motion.div>
  );
};

export default DocumentoForm;
