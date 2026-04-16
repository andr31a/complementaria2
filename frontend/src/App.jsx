import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ProtectedRoute, GuestRoute } from './components/AuthRoutes';

// Lazy loading
const Login = React.lazy(() => import('./pages/Login'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Overview = React.lazy(() => import('./pages/dashboard/Overview'));
const DocumentosList = React.lazy(() => import('./pages/dashboard/DocumentosList'));
const DocumentoForm = React.lazy(() => import('./pages/dashboard/DocumentoForm'));
const CategoriasList = React.lazy(() => import('./pages/dashboard/CategoriasList'));
const CategoriaForm = React.lazy(() => import('./pages/dashboard/CategoriaForm'));

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}><div className="spinner" /></div>}>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />}>
                {/* Nested Routes dentro de Dashboard */}
                <Route index element={<Overview />} />
                <Route path="documentos" element={<DocumentosList />} />
                <Route path="documentos/nuevo" element={<DocumentoForm />} />
                <Route path="documentos/editar/:id" element={<DocumentoForm />} />
                <Route path="categorias" element={<CategoriasList />} />
                <Route path="categorias/nueva" element={<CategoriaForm />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
};

export default App;
