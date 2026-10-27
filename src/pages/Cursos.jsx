import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { GraduationCap, Clock, Send } from 'lucide-react';
import './SectionStyles.css';

export default function Cursos() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, cursos } = content;

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={cursos?.title || "CURSOS ONLINE"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{cursos?.title || 'CURSOS ONLINE'}</h2>
            {cursos?.subtitle && <p className="section-subtitle">{cursos.subtitle}</p>}
          </div>

          <div className="courses-grid">
            {cursos?.items && cursos.items.length > 0 ? (
              cursos.items.map((curso) => (
                <div key={curso.id} className="editorial-card course-card">
                  <div className="course-header">
                    <div className="course-badges">
                      {curso.modality && <span className="meta-badge">{curso.modality}</span>}
                      {curso.duration && (
                        <span className="duration-tag">
                          <Clock size={12} style={{ marginRight: 4 }} />
                          {curso.duration}
                        </span>
                      )}
                    </div>
                    <h3 className="course-title">{curso.title}</h3>
                  </div>

                  {curso.description && (
                    <p className="course-desc">{curso.description}</p>
                  )}

                  <div className="course-action">
                    <a
                      href={curso.link || `mailto:${general?.contactEmail || 'adolfodeboeck@gmail.com'}?subject=Consulta%20sobre%20curso:%20${encodeURIComponent(curso.title)}`}
                      className="course-enroll-btn"
                    >
                      <Send size={14} style={{ marginRight: 6 }} />
                      Consultar e Inscribirse
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-message">No hay cursos disponibles actualmente.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
