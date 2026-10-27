import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { BookOpen, ExternalLink } from 'lucide-react';
import './SectionStyles.css';

export default function Literatura() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, literatura } = content;

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={literatura?.title || "LITERATURA"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{literatura?.title || 'LITERATURA'}</h2>
            {literatura?.subtitle && <p className="section-subtitle">{literatura.subtitle}</p>}
          </div>

          <div className="items-list">
            {literatura?.items && literatura.items.length > 0 ? (
              literatura.items.map((item) => (
                <article key={item.id} className="editorial-card item-card">
                  <div className="item-card-header">
                    <div className="item-badge-row">
                      {item.type && <span className="meta-badge">{item.type}</span>}
                      {item.year && <span className="meta-year">{item.year}</span>}
                    </div>
                    <h3 className="item-title">{item.title}</h3>
                  </div>
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="item-action-link"
                    >
                      <span>Acceder a la publicación</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </article>
              ))
            ) : (
              <p className="empty-message">No hay publicaciones registradas aún.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
