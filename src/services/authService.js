// Servicio de autenticación administrativa
const AUTH_KEY = 'adolfodeboeck_admin_auth';
const ADMIN_PASSWORD = '31842796';

export const authService = {
  // Verificar si la sesión es válida y no ha expirado (24 horas)
  isAuthenticated() {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEY);
      if (!sessionStr) return false;

      const session = JSON.parse(sessionStr);
      if (!session || !session.expiry) return false;

      if (Date.now() > session.expiry) {
        this.logout();
        return false;
      }

      return true;
    } catch {
      return false;
    }
  },

  // Iniciar sesión con contraseña
  login(password) {
    if (password === ADMIN_PASSWORD) {
      const session = {
        role: 'admin',
        loginTime: Date.now(),
        expiry: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      return { success: true };
    }
    return { success: false, error: 'Contraseña de administrador incorrecta' };
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },

  // Obtener sesión actual
  getSession() {
    try {
      const sessionStr = localStorage.getItem(AUTH_KEY);
      return sessionStr ? JSON.parse(sessionStr) : null;
    } catch {
      return null;
    }
  }
};
