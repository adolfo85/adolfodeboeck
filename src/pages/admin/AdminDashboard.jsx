import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { contentService } from '../../services/contentService';
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
  X
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState(contentService.getContent());
  const [activeTab, setActiveTab] = useState('inicio');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modales de adición / edición de ítems
  const [itemModal, setItemModal] = useState({ open: false, type: '', item: null, isNew: true });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const handleSaveAll = () => {
    const res = contentService.saveContent(content);
    if (res.success) {
      showToast('¡Cambios guardados correctamente!');
    } else {
      alert('Error al guardar: ' + res.error);
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
      const newBlank = { id: 'item_' + Date.now() };
      setItemModal({ open: true, type, item: newBlank, isNew: true });
    }
  };

  const closeItemModal = () => {
    setItemModal({ open: false, type: '', item: null, isNew: true });
  };

  // Carga y optimización de imagen local desde el dispositivo
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
          <button onClick={handleExportJson} className="admin-btn admin-btn-secondary" title="Descargar backup JSON">
            <Download size={16} />
            <span>Exportar JSON</span>
          </button>
          <button onClick={handleResetDefaults} className="admin-btn admin-btn-danger" title="Restaurar inicial">
            <RotateCcw size={16} />
          </button>
          <button onClick={handleSaveAll} className="admin-btn admin-btn-save">
            <Save size={16} />
            <span>Guardar Cambios</span>
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
              className={`admin-tab-btn ${activeTab === 'literatura' ? 'active' : ''}`}
              onClick={() => setActiveTab('literatura')}
            >
              <BookOpen size={18} />
              <span>Literatura</span>
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

          {/* TAB: LITERATURA */}
          {activeTab === 'literatura' && (
            <div className="editor-tab-pane">
              <div className="pane-header-with-action">
                <div>
                  <h2 className="editor-pane-title">Sección Literatura & Publicaciones</h2>
                  <p className="editor-pane-sub">Libros editados, artículos y textos analíticos.</p>
                </div>
                <button onClick={() => openItemModal('literatura')} className="admin-btn admin-btn-save">
                  <Plus size={16} />
                  <span>Agregar Publicación</span>
                </button>
              </div>

              <div className="admin-items-table">
                {content.literatura?.items?.map((item) => (
                  <div key={item.id} className="admin-item-row">
                    <div className="admin-item-meta">
                      <h4>{item.title}</h4>
                      <p>{item.type} {item.year ? `(${item.year})` : ''} - {item.description}</p>
                      {item.link && <small className="item-url-preview">Enlace: {item.link}</small>}
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

              {/* Campos para LITERATURA */}
              {itemModal.type === 'literatura' && (
                <>
                  <div className="admin-form-group">
                    <label>Título de la Publicación</label>
                    <input
                      type="text"
                      value={itemModal.item.title || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, title: e.target.value } }))}
                    />
                  </div>
                  <div className="editor-grid-2">
                    <div className="admin-form-group">
                      <label>Tipo (Ej: Libro, Artículo, Ensayo)</label>
                      <input
                        type="text"
                        value={itemModal.item.type || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, type: e.target.value } }))}
                      />
                    </div>
                    <div className="admin-form-group">
                      <label>Año de Publicación</label>
                      <input
                        type="text"
                        value={itemModal.item.year || ''}
                        onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, year: e.target.value } }))}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Descripción / Resumen</label>
                    <textarea
                      rows={3}
                      value={itemModal.item.description || ''}
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, description: e.target.value } }))}
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Enlace externo (opcional)</label>
                    <input
                      type="url"
                      value={itemModal.item.link || ''}
                      placeholder="https://..."
                      onChange={(e) => setItemModal(p => ({ ...p, item: { ...p.item, link: e.target.value } }))}
                    />
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
    </div>
  );
}
