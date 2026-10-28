import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import navLogo from '../img/logo-nav.png';
import './Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Galería', path: '/galeria' },
    { name: 'Literatura', path: '/literatura' },
    { name: 'Cursos online', path: '/cursos' },
    { name: 'Audio y videos', path: '/videos' },
    { name: 'Catálogo de obras', path: '/catalogo' }
  ];

  return (
    <header className="site-header">
      <div className="navbar-container">
        {/* Enlaces de navegación estilo píldora (Izquierda) */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-pill-btn ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logo Monograma ADB (Derecha) */}
        <div className="nav-right">
          <Link to="/admin" title="Panel de Administración" className="admin-quick-link">
            <Shield size={16} />
          </Link>
          <Link to="/" className="brand-logo-link" title="Adolfo César De Boeck">
            <img
              src={navLogo}
              alt="Logo Adolfo César De Boeck"
              className="brand-logo-img"
            />
          </Link>

          {/* Botón hamburguesa móvil */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable para móvil */}
      {mobileOpen && (
        <div className="mobile-nav-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `mobile-nav-link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            className="mobile-nav-link admin-nav-item"
            onClick={() => setMobileOpen(false)}
          >
            <Shield size={16} style={{ marginRight: '8px' }} />
            Panel de Admin
          </NavLink>
        </div>
      )}
    </header>
  );
}
