import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import './Footer.css';

export default function Footer({ contactEmail = "adolfodeboeck@gmail.com" }) {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-contact">
          Contacto: <a href={`mailto:${contactEmail}`} className="contact-mail-link">{contactEmail}</a>
        </p>
        <div className="footer-bottom-mark">
          <Link to="/admin" title="Panel de Administración" className="footer-admin-link">
            <Lock size={13} />
          </Link>
        </div>
      </div>
    </footer>
  );
}