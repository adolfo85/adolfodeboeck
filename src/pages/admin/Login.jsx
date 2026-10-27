import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Lock, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = authService.login(password.trim());
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Clave de administración incorrecta');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="admin-login-page">
      <div className="login-box-card">
        <div className="login-header-icon">
          <KeyRound size={28} />
        </div>
        <h1 className="login-title">Administración</h1>
        <p className="login-subtitle">
          Ingresa la clave de administrador para gestionar las secciones
        </p>

        {error && (
          <div className="login-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-field">
            <label htmlFor="adminPassword">Clave de Acceso</label>
            <div className="password-input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la clave..."
                autoFocus
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading || !password}
          >
            {loading ? 'Verificando...' : 'Acceder al Panel'}
          </button>
        </form>

        <div className="login-footer-nav">
          <Link to="/" className="back-site-link">
            <ArrowLeft size={14} style={{ marginRight: 6 }} />
            Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  );
}
