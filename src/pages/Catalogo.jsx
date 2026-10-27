import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { Music, Clock, Calendar } from 'lucide-react';
import './SectionStyles.css';

export default function Catalogo() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, catalogo } = content;

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={catalogo?.title || "CATÁLOGO DE OBRAS"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{catalogo?.title || 'CATÁLOGO DE OBRAS'}</h2>
            {catalogo?.subtitle && <p className="section-subtitle">{catalogo.subtitle}</p>}
          </div>

          <div className="catalogo-list">
            {catalogo?.items && catalogo.items.length > 0 ? (
              catalogo.items.map((obra) => (
                <div key={obra.id} className="editorial-card catalogo-card">
                  <div className="catalogo-card-header">
                    <h3 className="catalogo-obra-title">{obra.title}</h3>
                    <div className="catalogo-tags">
                      {obra.year && (
                        <span className="tag-pill">
                          <Calendar size={12} style={{ marginRight: 4 }} />
                          {obra.year}
                        </span>
                      )}
                      {obra.duration && (
                        <span className="tag-pill">
                          <Clock size={12} style={{ marginRight: 4 }} />
                          {obra.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  {obra.instrumentation && (
                    <div className="catalogo-instrumentation">
                      <Music size={15} className="inst-icon" />
                      <span>{obra.instrumentation}</span>
                    </div>
                  )}

                  {obra.notes && <p className="catalogo-notes">{obra.notes}</p>}
                </div>
              ))
            ) : (
              <p className="empty-message">No hay obras listadas en el catálogo.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
