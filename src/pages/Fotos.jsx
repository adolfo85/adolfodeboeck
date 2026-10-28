import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { ExternalLink, X, ZoomIn } from 'lucide-react';
import './SectionStyles.css';

export function resolveImageUrl(url) {
  if (!url) return '';
  // Data URLs o Blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // Enlaces de Google Drive compartidos: transformar a vista directa de imagen
  if (url.includes('drive.google.com')) {
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (m && m[1]) return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  }
  
  // Enlaces de Dropbox compartidos: forzar descarga directa/raw
  if (url.includes('dropbox.com')) {
    return url.replace('?dl=0', '?raw=1').replace('&dl=0', '&raw=1');
  }
  
  // Rutas legacy de desarrollo /src/img/ transformadas a /img/ público
  if (url.startsWith('/src/img/')) return url.replace('/src/img/', '/img/');
  if (url.startsWith('src/img/')) return url.replace('src/img/', '/img/');
  
  // Si solo se ingresa el nombre de archivo (ej: 'guitarra.jpg')
  if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `/img/${url}`;
  }
  
  return url;
}

export default function Fotos() {
  const [content, setContent] = useState(contentService.getContent());
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, fotos } = content;

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={fotos?.title || "GALERÍA"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{fotos?.title || 'GALERÍA'}</h2>
            {fotos?.subtitle && <p className="section-subtitle">{fotos.subtitle}</p>}
          </div>

          <div className="gallery-grid">
            {fotos?.items && fotos.items.length > 0 ? (
              fotos.items.map((foto) => {
                const resolvedSrc = resolveImageUrl(foto.imageUrl);
                return (
                  <div key={foto.id} className="gallery-card">
                    <div
                      className="gallery-image-wrapper"
                      onClick={() => setSelectedPhoto(foto)}
                      title="Clic para ampliar imagen"
                    >
                      <img
                        src={resolvedSrc}
                        alt={foto.title || 'Foto de galería'}
                        className="gallery-image"
                        loading="lazy"
                        onError={(e) => {
                          if (!e.target.dataset.triedFallback) {
                            e.target.dataset.triedFallback = 'true';
                            e.target.src = '/img/foto mia color.jpeg';
                          }
                        }}
                      />
                      <div className="gallery-zoom-overlay">
                        <ZoomIn size={24} />
                      </div>
                      {foto.category && (
                        <span className="gallery-badge">{foto.category}</span>
                      )}
                    </div>
                    <div className="gallery-info">
                      <h3 className="gallery-item-title">{foto.title}</h3>
                      {foto.caption && <p className="gallery-item-caption">{foto.caption}</p>}
                      {foto.link && (
                        <a
                          href={foto.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gallery-action-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink size={13} />
                          <span>Ver enlace</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">No hay fotografías cargadas aún en la galería.</p>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox / Visor de imagen en pantalla completa */}
      {selectedPhoto && (
        <div className="gallery-lightbox-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="gallery-lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Cerrar visor"
            >
              <X size={22} />
            </button>
            <img
              src={resolveImageUrl(selectedPhoto.imageUrl)}
              alt={selectedPhoto.title || 'Foto ampliada'}
              className="gallery-lightbox-image"
              onError={(e) => {
                e.target.src = '/img/foto mia color.jpeg';
              }}
            />
            <div className="gallery-lightbox-footer">
              <div style={{ flex: 1 }}>
                {selectedPhoto.category && (
                  <span className="meta-badge" style={{ marginBottom: '6px', display: 'inline-block' }}>
                    {selectedPhoto.category}
                  </span>
                )}
                <h3 className="gallery-lightbox-title">{selectedPhoto.title}</h3>
                {selectedPhoto.caption && (
                  <p className="gallery-lightbox-caption">{selectedPhoto.caption}</p>
                )}
              </div>
              {selectedPhoto.link && (
                <a
                  href={selectedPhoto.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gallery-action-link"
                  style={{ alignSelf: 'center' }}
                >
                  <ExternalLink size={15} />
                  <span>Visitar enlace relacionado</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
