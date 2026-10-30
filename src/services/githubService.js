// Servicio para sincronizar automáticamente el contenido con GitHub
// Permite que al presionar 'Guardar' en el panel de admin, se cree un commit en master
// y Netlify inicie el deploy automático para actualizar el sitio en todos los dispositivos.

const CONFIG_KEY = 'adolfodeboeck_github_config';

const DEFAULT_CONFIG = {
  owner: 'adolfo85',
  repo: 'adolfodeboeck',
  branch: 'master',
  path: 'src/data/content.json',
  token: ''
};

function unicodeToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const githubService = {
  // Obtener la configuración actual
  getConfig() {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error leyendo config de GitHub:', e);
    }
    return { ...DEFAULT_CONFIG };
  },

  // Guardar configuración
  saveConfig(newConfig) {
    try {
      const current = this.getConfig();
      const updated = {
        ...current,
        ...newConfig,
        token: (newConfig.token || '').trim()
      };
      localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
      return { success: true, config: updated };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // Verificar si hay un token configurado
  isConfigured() {
    const config = this.getConfig();
    return Boolean(config.token && config.token.length > 5);
  },

  // Probar conexión con el repositorio en GitHub
  async testConnection() {
    const config = this.getConfig();
    if (!this.isConfigured()) {
      return { success: false, error: 'No se ha ingresado un Token de GitHub.' };
    }

    try {
      const url = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${config.token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      if (res.status === 200) {
        const data = await res.json();
        return {
          success: true,
          message: `Conexión establecida correctamente con el repositorio ${config.owner}/${config.repo}.`,
          sha: data.sha
        };
      } else if (res.status === 401) {
        return { success: false, error: 'Token inválido o sin autorización (Error 401).' };
      } else if (res.status === 404) {
        return {
          success: false,
          error: `No se encontró el archivo o repositorio (${config.owner}/${config.repo}). Verifica que el token tenga permisos de 'repo'.`
        };
      } else {
        const errData = await res.json().catch(() => ({}));
        return {
          success: false,
          error: errData.message || `Error en la solicitud (Código ${res.status}).`
        };
      }
    } catch (e) {
      return {
        success: false,
        error: 'Error de red o conexión: ' + e.message
      };
    }
  },

  // Subir el contenido JSON a GitHub (Commit + Push directo)
  async pushContent(content, commitMessage = 'Actualizar contenido del sitio web desde el panel de administración') {
    const config = this.getConfig();
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'No se ha configurado el Token de GitHub para la sincronización automática.'
      };
    }

    try {
      // 1. Obtener el SHA actual del archivo content.json en master
      const getUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}?ref=${config.branch}&t=${Date.now()}`;
      const getRes = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${config.token}`,
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      let currentSha = null;
      if (getRes.status === 200) {
        const data = await getRes.json();
        currentSha = data.sha;
      } else if (getRes.status === 401) {
        return { success: false, error: 'El Token de GitHub es inválido o ha expirado.' };
      } else if (getRes.status === 404) {
        return {
          success: false,
          error: `No se pudo acceder a ${config.path}. Verifica que el token tenga permiso de lectura y escritura en el repositorio.`
        };
      } else {
        const err = await getRes.json().catch(() => ({}));
        return { success: false, error: err.message || 'Error al obtener la versión actual del archivo.' };
      }

      // 2. Codificar el nuevo contenido a Base64 respetando caracteres UTF-8
      const jsonString = JSON.stringify(content, null, 2);
      const base64Content = unicodeToBase64(jsonString);

      // 3. Crear el commit en GitHub con PUT
      const putUrl = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${config.path}`;
      const putBody = {
        message: commitMessage,
        content: base64Content,
        branch: config.branch
      };
      if (currentSha) {
        putBody.sha = currentSha;
      }

      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${config.token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(putBody)
      });

      if (putRes.status === 200 || putRes.status === 201) {
        const resultData = await putRes.json();
        return {
          success: true,
          commitUrl: resultData.commit?.html_url,
          commitSha: resultData.commit?.sha
        };
      } else {
        const errData = await putRes.json().catch(() => ({}));
        return {
          success: false,
          error: errData.message || `Error al guardar en GitHub (Código ${putRes.status}).`
        };
      }
    } catch (e) {
      return {
        success: false,
        error: 'Error de conexión con GitHub: ' + e.message
      };
    }
  }
};

