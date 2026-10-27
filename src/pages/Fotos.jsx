import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { Image as ImageIcon } from 'lucide-react';
import './SectionStyles.css';

export default function Fotos() {
  const [content, setContent] = useState(contentService.getContent());

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
        subtitle={fotos?.title || "FOTOS"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{fotos?.title || 'FOTOS'}</h2>
            {fotos?.subtitle && <p className="section-subtitle">{fotos.subtitle}</p>}
          </div>

          <div className="gallery-grid">
            {fotos?.items && fotos.items.length > 0 ? (
              fotos.items.map((foto) => (
                <div key={foto.id} className="gallery-card">
                  <div className="gallery-image-wrapper">
                    <img
                      src={foto.imageUrl}
                      alt={foto.title || 'Foto'}
                      className="gallery-image"
                      onError={(e) => {
                        e.target.src = '/src/img/foto mia color.jpeg';
                      }}
                    />
                    {foto.category && (
                      <span className="gallery-badge">{foto.category}</span>
                    )}
                  </div>
                  <div className="gallery-info">
                    <h3 className="gallery-item-title">{foto.title}</h3>
                    {foto.caption && <p className="gallery-item-caption">{foto.caption}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No hay fotografías cargadas aún.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
