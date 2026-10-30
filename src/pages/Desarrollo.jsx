import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import {
  Code2,
  ExternalLink,
  GitBranch,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import './SectionStyles.css';
import './Desarrollo.css';

export default function Desarrollo() {
  const [content, setContent] = useState(contentService.getContent());
  
  // Estado para el visor Lightbox de capturas
  const [lightbox, setLightbox] = useState({
    open: false,
    images: [],
    currentIndex: 0,
    appTitle: ''
  });

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, desarrollo } = content;
  const items = desarrollo?.items || [];

  const openLightbox = (images, index, appTitle) => {
    setLightbox({
      open: true,
      images,
      currentIndex: index,
      appTitle
    });
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, open: false }));
  };

  const nextImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={desarrollo?.title || "DESARROLLO"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{desarrollo?.title || 'DESARROLLO'}</h2>
            {desarrollo?.subtitle && (
              <p className="section-subtitle">{desarrollo.subtitle}</p>
            )}
          </div>

          <div className="desarrollo-list">
            {items && items.length > 0 ? (
              items.map((app) => {
                const appImages = Array.isArray(app.images)
                  ? app.images
                  : app.imageUrl
                    ? [app.imageUrl]
                    : [];

                return (
                  <article key={app.id} className="app-card">
                    {/* Encabezado */}
                    <div className="app-card-header">
                      <div className="item-badge-row">
                        <span className="meta-badge app-badge">
                          {app.platform || 'Software'}
                        </span>
                        {app.year && <span className="meta-year">{app.year}</span>}
                      </div>
                      <h3 className="app-title">{app.title}</h3>
                    </div>

                    {/* Descripción */}
                    {app.description && (
                      <p className="app-description">{app.description}</p>
                    )}

                    {/* Enlaces de acción */}
                    {(app.link || app.githubUrl) && (
                      <div className="app-links-row">
                        {app.link && (
                          <a
                            href={app.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="app-action-btn primary"
                          >
                            <span>Abrir / Probar Aplicación</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                        {app.githubUrl && (
                          <a
                            href={app.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="app-action-btn secondary"
                          >
                            <GitBranch size={14} />
                            <span>Código en GitHub</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Galería de Capturas / Tomas de la Aplicación */}
                    {appImages.length > 0 && (
                      <div className="app-gallery-section">
                        <h4 className="app-gallery-title">
                          <ImageIcon size={15} />
                          <span>Tomas y capturas ({appImages.length}):</span>
                        </h4>
                        <div className="app-screenshots-grid">
                          {appImages.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className="app-screenshot-item"
                              onClick={() => openLightbox(appImages, idx, app.title)}
                              title="Clic para ampliar captura"
                            >
                              <img
                                src={imgUrl}
                                alt={`${app.title} - captura ${idx + 1}`}
                                className="app-screenshot-img"
                              />
                              <div className="app-screenshot-overlay">
                                <Maximize2 size={18} />
                                <span>Ampliar</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <p className="empty-message">No hay proyectos de desarrollo registrados aún.</p>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox Modal de Pantalla Completa */}
      {lightbox.open && (
        <div className="app-lightbox-overlay" onClick={closeLightbox}>
          <div
            className="app-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="app-lightbox-close"
              title="Cerrar visor"
            >
              <X size={26} />
            </button>

            {lightbox.images.length > 1 && (
              <button
                onClick={prevImage}
                className="app-lightbox-nav prev"
                title="Imagen anterior"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <img
              src={lightbox.images[lightbox.currentIndex]}
              alt={`${lightbox.appTitle} - vista ampliada`}
              className="app-lightbox-image"
            />

            {lightbox.images.length > 1 && (
              <button
                onClick={nextImage}
                className="app-lightbox-nav next"
                title="Imagen siguiente"
              >
                <ChevronRight size={24} />
              </button>
            )}

            <div className="app-lightbox-counter">
              {lightbox.currentIndex + 1} de {lightbox.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
