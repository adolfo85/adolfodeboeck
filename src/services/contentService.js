import defaultContent from '../data/content.json';

const STORAGE_KEY = 'adolfodeboeck_site_content';

export const contentService = {
  // Obtener todo el contenido
  getContent() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          general: { ...defaultContent.general, ...(parsed.general || {}) },
          bio: { ...defaultContent.bio, ...(parsed.bio || {}) },
          fotos: { ...defaultContent.fotos, ...(parsed.fotos || {}) },
          literatura: { ...defaultContent.literatura, ...(parsed.literatura || {}) },
          cursos: { ...defaultContent.cursos, ...(parsed.cursos || {}) },
          videos: { ...defaultContent.videos, ...(parsed.videos || {}) },
          catalogo: { ...defaultContent.catalogo, ...(parsed.catalogo || {}) }
        };
      }
    } catch (e) {
      console.warn('Error al cargar contenido de localStorage:', e);
    }
    return defaultContent;
  },

  // Obtener una sección específica
  getSection(sectionKey) {
    const all = this.getContent();
    return all[sectionKey] || defaultContent[sectionKey] || {};
  },

  // Guardar todo el contenido
  saveContent(newContent) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
      window.dispatchEvent(new Event('contentUpdated'));
      return { success: true };
    } catch (e) {
      console.error('Error al guardar contenido:', e);
      return { success: false, error: e.message };
    }
  },

  // Actualizar una sección específica
  updateSection(sectionKey, data) {
    const all = this.getContent();
    all[sectionKey] = data;
    return this.saveContent(all);
  },

  // Resetear a los valores por defecto
  resetToDefaults() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event('contentUpdated'));
      return defaultContent;
    } catch (e) {
      console.error('Error al resetear contenido:', e);
      return defaultContent;
    }
  },

  // Exportar backup en formato JSON
  exportJson() {
    const data = this.getContent();
    const str = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', str);
    dlAnchor.setAttribute('download', 'adolfo_de_boeck_web_content.json');
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  },

  // Importar desde JSON
  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.general || !parsed.bio) {
        throw new Error('Estructura de archivo inválida');
      }
      return this.saveContent(parsed);
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
