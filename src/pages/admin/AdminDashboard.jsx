import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { contentService } from '../../services/contentService';
import { githubService } from '../../services/githubService';
import { resolveImageUrl } from '../Fotos';
import {
  Save,
  LogOut,
  Eye,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  User,
  Image as ImageIcon,
  BookOpen,
  GraduationCap,
  Play,
  Music,
  Code2,
  X,
  GitBranch,
  Key,
  Loader,
  ExternalLink,
  Check,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState(contentService.getContent());
  const [activeTab, setActiveTab] = useState('inicio');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modales de adición / edición de ítems
  const [itemModal, setItemModal] = useState({ open: false, type: '', item: null, isNew: true });

  // Estado de sincronización automática con GitHub
  const [isGithubConnected, setIsGithubConnected] = useState(githubService.isConfigured());
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [isSavingGithub, setIsSavingGithub] = useState(false);
  const [githubConfig, setGithubConfig] = useState(githubService.getConfig());
  const [githubTestStatus, setGithubTestStatus] = useState(null);
  const [showToken, setShowToken] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleSaveAll = async () => {
    // 1. Guardar localmente de inmediato
    const localRes = contentService.saveContent(content);
    if (!localRes.success) {
      alert('Error al guardar localmente: ' + localRes.error);
      return;
    }

    // 2. Si GitHub está configurado, sincronizar commit en master
    if (githubService.isConfigured()) {
      setIsSavingGithub(true);
      showToast('Guardando y enviando cambios a GitHub...');
      try {
        const gitRes = await githubService.pushContent(content);
        if (gitRes.success) {
          showToast('¡Guardado y sincronizado en GitHub! Netlify actualizará el sitio en 1-2 min.');
        } else {
          alert('Se guardó en tu navegador, pero ocurrió un error al subir a GitHub:\n\n' + gitRes.error + '\n\nPuedes revisar tu Token en el botón "Conexión GitHub".');
        }
      } catch (err) {
        alert('Error al conectar con GitHub: ' + err.message);
      } finally {
        setIsSavingGithub(false);
      }
    } else {
      showToast('¡Guardado en el navegador! (Configura tu Token de GitHub para deploy automático)');
    }
  };

  const handleSaveGithubConfig = () => {
    const res = githubService.saveConfig(githubConfig);
    if (res.success) {
      const configured = githubService.isConfigured();
      setIsGithubConnected(configured);
      showToast('Configuración de GitHub guardada');
      setGithubModalOpen(false);
    } else {
      alert('Error al guardar configuración: ' + res.error);
    }
  };

  const handleTestGithubConnection = async () => {
    githubService.saveConfig(githubConfig);
    setGithubTestStatus({ loading: true });
    const res = await githubService.testConnection();
    if (res.success) {
      setGithubTestStatus({ loading: false, success: true, message: res.message });
      setIsGithubConnected(true);
    } else {
      setGithubTestStatus({ loading: false, success: false, message: res.error });
      setIsGithubConnected(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('¿Seguro que deseas restaurar el contenido original? Se perderán las modificaciones no respaldadas.')) {
      const def = contentService.resetToDefaults();
      setContent(def);
      showToast('Contenido restaurado a los valores predeterminados');
    }
  };

  const handleExportJson = () => {
    contentService.exportJson();
    showToast('Copia de seguridad descargada (JSON)');
  };

  // Manejo de campos simples
  const handleGeneralChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const handleBioTextChange = (lang, text) => {
    // Dividir por doble salto de línea en párrafos
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    setContent(prev => ({
      ...prev,
      bio: { ...prev.bio, [lang]: paragraphs }
    }));
  };

  // Operaciones CRUD en colecciones (fotos, literatura, cursos, videos, catalogo)
  const openItemModal = (type, item = null) => {
    if (item) {
      setItemModal({ open: true, type, item: { ...item }, isNew: false });
    } else {
      let newBlank = { id: 'item_' + Date.now() };
      if (type === 'literatura') {
        newBlank = { ...newBlank, type: 'Libro', year: new Date().getFullYear().toString(), imageUrl: '' };
      } else if (type === 'desarrollo') {
        newBlank = { ...newBlank, platform: 'Software de Escritorio', year: new Date().getFullYear().toString(), images: [] };
      }
      setItemModal({ open: true, type, item: newBlank, isNew: true });
    }
  };

  const closeItemModal = () => {
    setItemModal({ open: false, type: '', item: null, isNew: true });
  };

  // Helper general para optimizar y comprimir imágenes con canvas
  const compressImageFile = (file, maxWidth = 1300, maxHeight = 1000, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Carga de tapa de libro (para Escritos)
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Optimizando tapa del libro...');
      const url = await compressImageFile(file, 900, 1200, 0.85);
      setItemModal(p => ({
        ...p,
        item: { ...p.item, imageUrl: url }
      }));
      showToast('Tapa de libro cargada');
    } catch (err) {
      alert('Error al cargar imagen: ' + err.message);
    }
  };

  // Carga de múltiples capturas (para Desarrollo)
  const handleAppImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    showToast('Procesando capturas de la aplicación...');
    try {
      const urls = await Promise.all(files.map(f => compressImageFile(f, 1400, 950, 0.82)));
      setItemModal(p => {
        const cur = Array.isArray(p.item.images) ? p.item.images : [];
        return {
          ...p,
          item: {
            ...p.item,
            images: [...cur, ...urls]
          }
        };
      });
      showToast(`${urls.length} captura(s) agregada(s)`);
    } catch (err) {
      alert('Error al procesar capturas: ' + err.message);
    }
  };

  const handleRemoveAppImage = (idxToRemove) => {
    setItemModal(p => {
      const cur = Array.isArray(p.item.images) ? p.item.images : [];
      return {
        ...p,
        item: {
          ...p.item,
          images: cur.filter((_, idx) => idx !== idxToRemove)
        }
      };
    });
  };

  // Carga y optimización de imagen local desde el dispositivo (para Galería)
  const handlePhotoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1400;
        const maxHeight = 1400;
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedUrl = canvas.toDataURL('image/jpeg', 0.85);
        setItemModal(p => ({
          ...p,
          item: {
            ...p.item,
            imageUrl: optimizedUrl,
            title: p.item.title || file.name.replace(/\.[^/.]+$/, '')
          }
        }));
        showToast('Imagen cargada y lista para guardar');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const saveItemModal = () => {
    const { type, item, isNew } = itemModal;
    setContent(prev => {
      const section = prev[type] || { items: [] };
      const currentItems = Array.isArray(section.items) ? [...section.items] : [];
      
      let updatedItems;
      if (isNew) {
        updatedItems = [...currentItems, item];
      } else {
        updatedItems = currentItems.map(it => it.id === item.id ? item : it);
      }

      return {
        ...prev,
        [type]: {
          ...section,
          items: updatedItems
        }
      };
    });
    closeItemModal();
    showToast('Ítem actualizado en la sección');
  };

  const deleteItem = (type, id) => {
    if (window.confirm('¿Eliminar este elemento de la sección?')) {
      setContent(prev => {
        const section = prev[type] || { items: [] };
        const updatedItems = (section.items || []).filter(it => it.id !== id);
        return {
          ...prev,
          [type]: { ...section, items: updatedItems }
        };
      });
      showToast('Elemento eliminado');
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Bar */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <span className="admin-badge">ADMIN</span>
          <h1 className="admin-topbar-title">Panel de Control & Contenido</h1>
        </div>
        <div className="admin-topbar-actions">
          <Link to="/" target="_blank" className="admin-btn admin-btn-secondary" title="Abrir página pública">
            <Eye size={16} />
            <span>Ver Sitio Web</span>
          </Link>
          <button
            onClick={() => setGithubModalOpen(true)}
            className={`admin-btn ${isGithubConnected ? 'admin-btn-github-connected' : 'admin-btn-github-pending'}`}
            title="Configurar sincronización directa con GitHub"
          >
            <GitBranch size={16} />
            <span>{isGithubConnected ? 'GitHub Conectado' : 'Conectar GitHub'}</span>
            <span className={`status-indicator ${isGithubConnected ? 'connected' : 'pending'}`}></span>
          </button>
          <button onClick={handleExportJson} className="admin-btn admin-btn-secondary" title="Descargar backup JSON">
            <Download size={16} />
            <span>Exportar JSON</span>
          </button>
          <button onClick={handleResetDefaults} className="admin-btn admin-btn-danger" title="Restaurar inicial">
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleSaveAll}
            className="admin-btn admin-btn-save"
            disabled={isSavingGithub}
          >
            {isSavingGithub ? <Loader size={16} className="spinning" /> : <Save size={16} />}
            <span>{isSavingGithub ? 'Publicando en GitHub...' : 'Guardar Cambios'}</span>
          </button>
          <button onClick={handleLogout} className="admin-btn admin-btn-logout" title="Cerrar sesión">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Panel Content */}
      <div className="admin-main-layout">
        {/* Sidebar Nav */}
        <aside className="admin-sidebar">
          <nav className="admin-nav-tabs">
            <button
              className={`admin-tab-btn ${activeTab === 'inicio' ? 'active' : ''}`}
              onClick={() => setActiveTab('inicio')}
            >
              <User size={18} />
              <span>Portada & Bio</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'fotos' ? 'active' : ''}`}
              onClick={() => setActiveTab('fotos')}
            >
              <ImageIcon size={18} />
              <span>Galería</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'escritos' || activeTab === 'literatura' ? 'active' : ''}`}
              onClick={() => setActiveTab('escritos')}
            >
              <BookOpen size={18} />
              <span>Escritos</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'desarrollo' ? 'active' : ''}`}
              onClick={() => setActiveTab('desarrollo')}
            >
              <Code2 size={18} />
              <span>Desarrollo</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'cursos' ? 'active' : ''}`}
              onClick={() => setActiveTab('cursos')}
            >
              <GraduationCap size={18} />
              <span>Cursos online</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'videos' ? 'active' : ''}`}
              onClick={() => setActiveTab('videos')}
            >
              <Play size={18} />
              <span>Audio y videos</span>
            </button>
            <button
              className={`admin-tab-btn ${activeTab === 'catalogo' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalogo')}
            >
              <Music size={18} />
              <span>Catálogo de obras</span>
            </button>
          </nav>
        </aside>

        {/* Section Editor Area */}
        <section className="admin-editor-card">
          {/* TAB: PORTADA & BIO */}
          {activeTab === 'inicio' && (
            <div className="editor-tab-pane">
              <h2 className="editor-pane-title">Configuración de Portada & Biografía</h2>

              <div className="editor-grid-2">
                <div className="admin-form-group">
                  <label>Nombre del Compositor (Título Portada)</label>
                  <input
                    type="text"
                    value={content.general?.name || ''}
                    onChange={(e) => handleGeneralChange('name', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Subtítulo de Portada</label>
                  <input
                    type="text"
                    value={content.general?.subtitle || ''}
                    onChange={(e) => handleGeneralChange('subtitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="editor-grid-2">
                <div className="admin-form-group">
                  <label>Email de Contacto (Público)</label>
                  <input
                    type="email"
                    value={content.general?.contactEmail || ''}
                    onChange={(e) => handleGeneralChange('contactEmail', e.target.value)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Ruta o URL de Imagen Hero</label>
                  <input
                    type="text"
                    value={content.general?.heroImage || ''}
                    onChange={(e) => handleGeneralChange('heroImage', e.target.value)}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Título de la Sección Bio</label>
                <input
                  type="text"
                  value={content.bio?.title || 'BIO'}
                  onChange={(e) => setContent(prev => ({ ...prev, bio: { ...prev.bio, title: e.target.value } }))}
                />
              </div>

              <div className="admin-form-group">
                <label>Texto de la Biografía en Español (Separa párrafos con doble salto de línea)</label>
                <textarea
                  rows={8}
                  value={Array.isArray(content.bio?.es) ? content.bio.es.join('\n\n') : (content.bio?.es || '')}
                  onChange={(e) => handleBioTextChange('es', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>Texto de la Biografía en Inglés (Separa párrafos con doble salto de línea)</label>
                <textarea
                  rows={8}
                  value={Array.isArray(content.bio?.en) ? content.bio.en.join('\n\n') : (content.bio?.en || '')}
                  onChange={(e) => handleBioTextChange('en', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB: FOTOS */}
          {activeTab === 'fotos' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Galería de Fotos</h2>
                  <p className="editor-pane-sub">Administra las imágenes públicas mostradas en la sección Fotos.</p>
                </div>
                <button onClick={() => openItemModal('fotos')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Foto</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.fotos?.items?.map((foto) => (
                  <div key={foto.id} className="admin-item-row">
                    <img
                      src={resolveImageUrl(foto.imageUrl)}
                      alt={foto.title}
                      className="admin-thumb"
                      onError={(e) => { e.target.src = '/img/foto mia color.jpeg'; }}
                    />
                    <div className="admin-item-meta">
                      <h4>{foto.title || 'Sin título'}</h4>
                      <p>
                        {foto.caption || 'Sin epígrafe'} • Categ: {foto.category || 'General'}
                        {foto.link && (
                          <span style={{ color: '#f6d87e', marginLeft: '8px' }}>
                            • [Enlace adjunto]
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="admin-row-btns">
                      <button onClick={() => openItemModal('fotos', foto)} className="icon-btn edit-btn" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem('fotos', foto.id)} className="icon-btn delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ESCRITOS */}
          {(activeTab === 'escritos' || activeTab === 'literatura') && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Sección Escritos & Publicaciones</h2>
                  <p className="editor-pane-sub">Libros editados (con foto de tapa), artículos analíticos y ensayos.</p>
                </div>
                <button onClick={() => openItemModal('literatura')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Publicación / Libro</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.literatura?.items?.map((item) => (
                  <div key={item.id} className="admin-item-row">
                    <div className="admin-item-row-with-thumb">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={`Tapa de ${item.title}`} className="admin-row-thumb" />
                      ) : (
                        <div className="admin-row-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)' }}>
                          <BookOpen size={18} color="#94a3b8" />
                        </div>
                      )}
                      <div className="admin-item-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="meta-badge" style={{ background: item.type === 'Libro' ? 'rgba(245, 212, 107, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: item.type === 'Libro' ? '#f6d87e' : '#93c5fd' }}>
                            {item.type || 'Libro'}
                          </span>
                          {item.year && <span className="meta-year">{item.year}</span>}
                        </div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        {item.link && <small className="item-url-preview">Enlace: {item.link}</small>}
                      </div>
                    </div>
                    <div className="admin-row-btns">
                      <button onClick={() => openItemModal('literatura', item)} className="icon-btn edit-btn" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem('literatura', item.id)} className="icon-btn delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: DESARROLLO */}
          {activeTab === 'desarrollo' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Sección Desarrollo & Aplicaciones</h2>
                  <p className="editor-pane-sub">Software, herramientas interactivas y proyectos tecnológicos con capturas.</p>
                </div>
                <button onClick={() => openItemModal('desarrollo')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Aplicación</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.desarrollo?.items?.map((item) => {
                  const screenshots = Array.isArray(item.images) ? item.images : [];
                  return (
                    <div key={item.id} className="admin-item-row">
                      <div className="admin-item-meta">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className="meta-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                            {item.platform || 'Software'}
                          </span>
                          {item.year && <span className="meta-year">{item.year}</span>}
                          {screenshots.length > 0 && (
                            <span style={{ fontSize: '0.725rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              📷 {screenshots.length} captura(s)
                            </span>
                          )}
                        </div>
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                          {item.link && <small className="item-url-preview">App/Demo: {item.link}</small>}
                          {item.githubUrl && <small className="item-url-preview">GitHub: {item.githubUrl}</small>}
                        </div>

                        {screenshots.length > 0 && (
                          <div className="admin-screenshots-strip">
                            {screenshots.map((s, idx) => (
                              <img key={idx} src={s} alt={`Captura ${idx + 1}`} className="admin-mini-screenshot" />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="admin-row-btns">
                        <button onClick={() => openItemModal('desarrollo', item)} className="icon-btn edit-btn" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteItem('desarrollo', item.id)} className="icon-btn delete-btn" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: CURSOS */}
          {activeTab === 'cursos' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Sección Cursos Online</h2>
                  <p className="editor-pane-sub">Talleres, capacitaciones y programas ofrecidos.</p>
                </div>
                <button onClick={() => openItemModal('cursos')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Curso</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.cursos?.items?.map((curso) => (
                  <div key={curso.id} className="admin-item-row">
                    <div className="admin-item-meta">
                      <h4>{curso.title}</h4>
                      <p>Modalidad: {curso.modality || 'Online'} • Duración: {curso.duration} - {curso.description}</p>
                    </div>
                    <div className="admin-row-btns">
                      <button onClick={() => openItemModal('cursos', curso)} className="icon-btn edit-btn" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem('cursos', curso.id)} className="icon-btn delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: AUDIO Y VIDEOS */}
          {activeTab === 'videos' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Sección Audio y Videos</h2>
                  <p className="editor-pane-sub">Obras audiovisuales, enlaces a YouTube o plataformas de audio.</p>
                </div>
                <button onClick={() => openItemModal('videos')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Video/Audio</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.videos?.items?.map((vid) => (
                  <div key={vid.id} className="admin-item-row">
                    <div className="admin-item-meta">
                      <h4>{vid.title}</h4>
                      <p>{vid.platform} - {vid.description}</p>
                      <small className="item-url-preview">URL: {vid.url}</small>
                    </div>
                    <div className="admin-row-btns">
                      <button onClick={() => openItemModal('videos', vid)} className="icon-btn edit-btn" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteItem('videos', vid.id)} className="icon-btn delete-btn" title="Eliminar">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CATÁLOGO DE OBRAS */}
          {activeTab === 'catalogo' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Catálogo de Obras</h2>
                  <p className="editor-pane-sub">Composiciones catalogadas bajo los parámetros: Título, Orgánico y Año.</p>
                </div>
                <button onClick={() => openItemModal('catalogo')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Obra</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.catalogo?.items && content.catalogo.items.length > 0 ? (
                  content.catalogo.items.map((obra) => (
                    <div key={obra.id} className="admin-item-row">
                      <div className="admin-item-meta">
                        <h4>{obra.title || 'Sin título'}</h4>
                        <p>
                          <span style={{ color: 'var(--text-muted)' }}>Orgánico: </span>
                          <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>
                            {obra.organico || obra.instrumentation || '—'}
                          </span>
                          &nbsp;&nbsp;•&nbsp;&nbsp;
                          <span style={{ color: 'var(--text-muted)' }}>Año: </span>
                          <span style={{ color: '#cbd5e1' }}>
                            {obra.year || '—'}
                          </span>
                        </p>
                      </div>
                      <div className="admin-row-btns">
                        <button onClick={() => openItemModal('catalogo', obra)} className="icon-btn edit-btn" title="Editar">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deleteItem('catalogo', obra.id)} className="icon-btn delete-btn" title="Eliminar">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', padding: '1.5rem' }}>
                    No hay obras agregadas en el catálogo. Haz clic en "Agregar Obra" para sumar una.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* MODAL UNIVERSAL DE ADICIÓN / EDICIÓN */}
      {itemModal.open && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="admin-modal-header">
              <h3>
                {itemModal.isNew ? 'Agregar elemento en ' : 'Editar elemento de '}
                <span style={{ textTransform: 'uppercase' }}>{itemModal.type}</span>
              </h3>
              <button onClick={closeItemModal} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Campos para FOTOS / GALERÍA */}
              {itemModal.type === 'fotos' && (
                <>
                  <div className="admin-form-group">
                    <label>Título de la Fotografía</label>
                    <input
                      type="text"
                      placeholder="Ej: Concierto en el Conservatorio"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Categoría (Ej: Concierto, Ensayo, Retrato, Obra)</label>
                    <input
                      type="text"
                      placeholder="Ej: Concierto"
                      value={itemModal.item.category || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, category: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-form-group" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <label style={{ color: '#f6d87e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={16} /> Subir archivo de imagen desde tu computadora
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileUpload}
                      style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}
                    />
                    <small style={{ color: 'var(--text-dim)', display: 'block', marginTop: '6px' }}>
                      Selecciona un archivo JPG, PNG o WEBP de tu equipo. Se optimizará y guardará automáticamente.
                    </small>

                    <div style={{ margin: '1rem 0 0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                      <label style={{ fontSize: '0.85rem' }}>O ingresar URL / Enlace web de la imagen:</label>
                      <input
                        type="text"
                        placeholder="https://... o /img/foto.jpg o enlace compartido de Google Drive"
                        value={itemModal.item.imageUrl || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, imageUrl: e.target.value } }))}
                        style={{ marginTop: '4px' }}
                      />
                      <small style={{ color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                        Admite URLs directas, imágenes locales (/img/...) y enlaces compartidos de Google Drive o Dropbox.
                      </small>
                    </div>

                    {/* Previsualización en vivo */}
                    {itemModal.item.imageUrl && (
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                          Vista previa de la imagen:
                        </span>
                        <img
                          src={resolveImageUrl(itemModal.item.imageUrl)}
                          alt="Vista previa"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '180px',
                            objectFit: 'contain',
                            borderRadius: '4px',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const errNotice = document.getElementById('preview-error-msg');
                            if (errNotice) errNotice.style.display = 'block';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'inline-block';
                            const errNotice = document.getElementById('preview-error-msg');
                            if (errNotice) errNotice.style.display = 'none';
                          }}
                        />
                        <p id="preview-error-msg" style={{ display: 'none', color: '#f87171', fontSize: '0.8rem', marginTop: '4px' }}>
                          No se pudo cargar la imagen desde ese enlace. Asegúrate de que el enlace sea directo o sube el archivo de tu equipo.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label>Enlace externo o web relacionado (Opcional)</label>
                    <input
                      type="url"
                      placeholder="https://... (enlace a web, evento, álbum o publicación externa)"
                      value={itemModal.item.link || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, link: e.target.value } }))}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Epígrafe / Descripción</label>
                    <textarea
                      rows={3}
                      placeholder="Descripción breve de la fotografía..."
                      value={itemModal.item.caption || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, caption: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {/* Campos para ESCRITOS / LITERATURA */}
              {itemModal.type === 'literatura' && (
                <>
                  <div className="admin-form-group">
                    <label>Título del Libro o Escrito</label>
                    <input
                      type="text"
                      placeholder="Ej: Principios de Composición Filatélica"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Segmento / Categoría</label>
                      <select
                        value={itemModal.item.type || 'Libro'}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, type: e.target.value } }))}
                        style={{ width: '100%', background: '#1c1d27', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '0.6rem', borderRadius: '4px' }}
                      >
                        <option value="Libro">Libro</option>
                        <option value="Artículo">Artículo</option>
                        <option value="Ensayo">Ensayo</option>
                      </select>
                    </div>
                    <div className="admin-form-group">
                      <label>Año de Publicación</label>
                      <input
                        type="text"
                        placeholder="Ej: 2026"
                        value={itemModal.item.year || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, year: e.target.value } }))}
                      />
                    </div>
                  </div>

                  {/* Imagen de Tapa para Libros */}
                  <div className="admin-form-group" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <label style={{ color: '#f6d87e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={16} /> Tapa o Portada del Libro
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}
                    />
                    <small style={{ color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                      Sube una foto de la portada desde tu dispositivo (se optimizará y guardará automáticamente).
                    </small>

                    {itemModal.item.imageUrl && (
                      <div className="cover-preview-card" style={{ marginTop: '1rem' }}>
                        <img src={itemModal.item.imageUrl} alt="Vista previa de tapa" className="cover-preview-img" />
                        <div>
                          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.825rem', color: '#4ade80' }}>✓ Tapa cargada correctamente</p>
                          <button
                            type="button"
                            onClick={() => setItemModal(p => ({ ...p, item: { ...p.item, imageUrl: '' } }))}
                            className="admin-btn admin-btn-danger"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                          >
                            Quitar tapa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label>Descripción / Resumen de la obra</label>
                    <textarea
                      rows={4}
                      placeholder="Breve reseña o fundamentación del libro o artículo..."
                      value={itemModal.item.description || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, description: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Enlace externo (editorial, compra, descarga o lectura)</label>
                    <input
                      type="url"
                      value={itemModal.item.link || ''}
                      placeholder="https://..."
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, link: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {/* Campos para DESARROLLO (APLICACIONES) */}
              {itemModal.type === 'desarrollo' && (
                <>
                  <div className="admin-form-group">
                    <label>Título de la Aplicación / Software</label>
                    <input
                      type="text"
                      placeholder="Ej: Software de Maquetación Filatélica"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Plataforma / Categoría</label>
                      <input
                        type="text"
                        placeholder="Ej: Software de Escritorio, Web, MIDI, etc."
                        value={itemModal.item.platform || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, platform: e.target.value } }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Año</label>
                      <input
                        type="text"
                        placeholder="Ej: 2026"
                        value={itemModal.item.year || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, year: e.target.value } }))}
                      />
                    </div>
                  </div>

                  <div className="admin-form-group">
                    <label>Descripción detallada de la aplicación</label>
                    <textarea
                      rows={4}
                      placeholder="Explica qué hace la aplicación, su propósito, funciones y características..."
                      value={itemModal.item.description || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, description: e.target.value } }))}
                    />
                  </div>

                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Enlace a la App o Demo (Opcional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={itemModal.item.link || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, link: e.target.value } }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Repositorio GitHub (Opcional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={itemModal.item.githubUrl || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, githubUrl: e.target.value } }))}
                      />
                    </div>
                  </div>

                  {/* Tomas / Capturas de pantalla (Múltiples imágenes) */}
                  <div className="admin-form-group" style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <label style={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={16} /> Subir Capturas / Tomas de la Aplicación (Múltiples fotos)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleAppImagesUpload}
                      style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}
                    />
                    <small style={{ color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                      Puedes seleccionar varias capturas a la vez de tu computadora. Se optimizarán y mostrarán en la galería de la aplicación.
                    </small>

                    {/* Previsualización y gestión de capturas cargadas */}
                    {itemModal.item.images && itemModal.item.images.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#e2e8f0', display: 'block', marginBottom: '0.5rem' }}>
                          Capturas actuales ({itemModal.item.images.length}):
                        </span>
                        <div className="admin-screenshots-upload-grid">
                          {itemModal.item.images.map((imgUrl, idx) => (
                            <div key={idx} className="admin-screenshot-box">
                              <img src={imgUrl} alt={`Captura ${idx + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleRemoveAppImage(idx)}
                                className="admin-screenshot-del-btn"
                                title="Eliminar captura"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Campos para CURSOS */}
              {itemModal.type === 'cursos' && (
                <>
                  <div className="admin-form-group">
                    <label>Nombre del Curso / Taller</label>
                    <input
                      type="text"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Modalidad (Online / Presencial / Individual)</label>
                      <input
                        type="text"
                        value={itemModal.item.modality || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, modality: e.target.value } }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Duración</label>
                      <input
                        type="text"
                        value={itemModal.item.duration || ''}
                        placeholder="Ej: Semestral, 8 clases"
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, duration: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Descripción del Programa</label>
                    <textarea
                      rows={4}
                      value={itemModal.item.description || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, description: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Enlace de Consulta / Inscripción (Opcional)</label>
                    <input
                      type="text"
                      value={itemModal.item.link || ''}
                      placeholder="mailto:adolfodeboeck@gmail.com o enlace"
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, link: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {/* Campos para VIDEOS */}
              {itemModal.type === 'videos' && (
                <>
                  <div className="admin-form-group">
                    <label>Título de la Obra o Video</label>
                    <input
                      type="text"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>URL de YouTube o enlace del video / audio</label>
                    <input
                      type="url"
                      value={itemModal.item.url || ''}
                      placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, url: e.target.value } }))}
                    />
                  </div>
                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Plataforma (Ej: YouTube, SoundCloud)</label>
                      <input
                        type="text"
                        value={itemModal.item.platform || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, platform: e.target.value } }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Año (Opcional)</label>
                      <input
                        type="text"
                        value={itemModal.item.year || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, year: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Descripción / Ficha artística</label>
                    <textarea
                      rows={3}
                      value={itemModal.item.description || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, description: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {/* Campos para CATÁLOGO (Título, Orgánico, Año) */}
              {itemModal.type === 'catalogo' && (
                <>
                  <div className="admin-form-group">
                    <label>Título</label>
                    <input
                      type="text"
                      placeholder="Título de la composición"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Orgánico</label>
                    <input
                      type="text"
                      placeholder="Ej: Coro mixto, Cuarteto de cuerdas, Guitarra sola..."
                      value={itemModal.item.organico ?? itemModal.item.instrumentation ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setItemModal(p => ({
                          ...p,
                          item: { ...p.item, organico: val, instrumentation: val }
                        }));
                      }}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Año</label>
                    <input
                      type="text"
                      placeholder="Ej: 2024"
                      value={itemModal.item.year || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, year: e.target.value } }))}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="admin-modal-footer">
              <button onClick={closeItemModal} className="admin-btn admin-btn-secondary">
                Cancelar
              </button>
              <button onClick={saveItemModal} className="admin-btn admin-btn-save">
                Guardar Elemento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Conexión con GitHub */}
      {githubModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setGithubModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <GitBranch size={22} color="#3b82f6" />
                <h3>Sincronización con GitHub (Deploy Automático)</h3>
              </div>
              <button onClick={() => setGithubModalOpen(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                Conecta tu Token de GitHub para que cada vez que hagas clic en <strong>"Guardar Cambios"</strong>, la web cree un commit automáticamente en tu repositorio y Netlify actualice la página para todos los teléfonos, computadoras y visitantes.
              </p>

              <div className="editor-grid-2">
                <div className="admin-form-group">
                  <label>Usuario / Organización</label>
                  <input
                    type="text"
                    value={githubConfig.owner}
                    onChange={(e) => setGithubConfig(p => ({ ...p, owner: e.target.value }))}
                    placeholder="adolfo85"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Repositorio</label>
                  <input
                    type="text"
                    value={githubConfig.repo}
                    onChange={(e) => setGithubConfig(p => ({ ...p, repo: e.target.value }))}
                    placeholder="adolfodeboeck"
                  />
                </div>
              </div>

              <div className="editor-grid-2">
                <div className="admin-form-group">
                  <label>Rama (Branch)</label>
                  <input
                    type="text"
                    value={githubConfig.branch}
                    onChange={(e) => setGithubConfig(p => ({ ...p, branch: e.target.value }))}
                    placeholder="master"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Ruta del archivo</label>
                  <input
                    type="text"
                    value={githubConfig.path}
                    readOnly
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ margin: 0 }}>GitHub Personal Access Token (Classic o Fine-grained)</label>
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {showToken ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <input
                  type={showToken ? 'text' : 'password'}
                  value={githubConfig.token}
                  onChange={(e) => setGithubConfig(p => ({ ...p, token: e.target.value }))}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  style={{ fontFamily: 'monospace', letterSpacing: showToken ? 'normal' : '0.1em' }}
                />
              </div>

              {/* Guía rápida para crear el token */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: '6px',
                padding: '1rem',
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#cbd5e1',
                lineHeight: '1.5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#60a5fa', marginBottom: '0.5rem' }}>
                  <Key size={14} />
                  <span>¿Cómo obtener tu Token en 3 simples pasos?</span>
                </div>
                <ol style={{ paddingLeft: '1.2rem', margin: 0 }}>
                  <li style={{ marginBottom: '0.35rem' }}>
                    Entra a GitHub:&nbsp;
                    <a
                      href="https://github.com/settings/tokens/new?description=Web%20Adolfo%20De%20Boeck&scopes=repo"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38bdf8', textDecoration: 'underline' }}
                    >
                      Crear Token directo en GitHub <ExternalLink size={11} style={{ verticalAlign: 'middle' }} />
                    </a>
                  </li>
                  <li style={{ marginBottom: '0.35rem' }}>
                    Asegúrate de que la casilla <strong>repo</strong> (Full control of private repositories) esté marcada.
                  </li>
                  <li>
                    Haz clic en <strong>Generate token</strong> (al final de la página de GitHub), copia el código generado (empieza con <code>ghp_...</code>) y pégalo arriba.
                  </li>
                </ol>
              </div>

              {/* Estado de prueba de conexión */}
              {githubTestStatus && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  fontSize: '0.825rem',
                  background: githubTestStatus.loading
                    ? 'rgba(255, 255, 255, 0.05)'
                    : githubTestStatus.success
                      ? 'rgba(34, 197, 94, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${
                    githubTestStatus.loading
                      ? 'rgba(255, 255, 255, 0.15)'
                      : githubTestStatus.success
                        ? 'rgba(34, 197, 94, 0.4)'
                        : 'rgba(239, 68, 68, 0.4)'
                  }`,
                  color: githubTestStatus.loading
                    ? '#cbd5e1'
                    : githubTestStatus.success
                      ? '#4ade80'
                      : '#f87171'
                }}>
                  {githubTestStatus.loading && <Loader size={16} className="spinning" />}
                  {githubTestStatus.success && <Check size={16} />}
                  {!githubTestStatus.loading && !githubTestStatus.success && <AlertCircle size={16} />}
                  <span>{githubTestStatus.loading ? 'Verificando credenciales en GitHub...' : githubTestStatus.message}</span>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                onClick={handleTestGithubConnection}
                className="admin-btn admin-btn-secondary"
                disabled={githubTestStatus?.loading || !githubConfig.token}
              >
                {githubTestStatus?.loading ? <Loader size={15} className="spinning" /> : <RefreshCw size={15} />}
                <span>Probar Conexión</span>
              </button>
              <button
                type="button"
                onClick={handleSaveGithubConfig}
                className="admin-btn admin-btn-save"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
