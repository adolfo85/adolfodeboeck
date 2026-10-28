import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
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

        {/* Monograma / Logo minimalista (Derecha) */}
        <div className="nav-right">
          <Link to="/admin" title="Panel de Administración" className="admin-quick-link">
            <Shield size={16} />
          </Link>
          <Link to="/" className="monogram-logo" title="Adolfo César De Boeck">
            <svg
              width="48"
              height="48"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="monogram-svg"
            >
              {/* Monograma geométrico de líneas orgánicas de compositor */}
              <ellipse
                cx="50"
                cy="50"
                rx="38"
                ry="24"
                transform="rotate(-25 50 50)"
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="2"
              />
              <ellipse
                cx="48"
                cy="52"
                rx="34"
                ry="20"
                transform="rotate(40 48 52)"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="1.5"
              />
              <ellipse
                cx="52"
                cy="48"
                rx="30"
                ry="16"
                transform="rotate(-65 52 48)"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
            </svg>
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
