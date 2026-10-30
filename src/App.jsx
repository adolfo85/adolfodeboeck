import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Páginas públicas
import Home from './pages/Home';
import Fotos from './pages/Fotos';
import Escritos from './pages/Escritos';
import Desarrollo from './pages/Desarrollo';
import Cursos from './pages/Cursos';
import Videos from './pages/Videos';
import Catalogo from './pages/Catalogo';

// Panel de Administración
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './pages/admin/ProtectedRoute';

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Fotos />} />
          <Route path="/fotos" element={<Fotos />} />
          <Route path="/escritos" element={<Escritos />} />
          <Route path="/literatura" element={<Escritos />} />
          <Route path="/desarrollo" element={<Desarrollo />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/catalogo" element={<Catalogo />} />

          {/* Rutas de Administración */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
