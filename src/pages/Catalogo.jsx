import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import './SectionStyles.css';

export default function Catalogo() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, catalogo } = content;
  const items = catalogo?.items || [];

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

          <div className="catalogo-table-container">
            {items.length > 0 ? (
              <div className="catalogo-table-wrapper">
                <table className="catalogo-table">
                  <thead>
                    <tr>
                      <th className="th-titulo">Título</th>
                      <th className="th-organico">Orgánico</th>
                      <th className="th-ano">Año</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((obra) => (
                      <tr key={obra.id} className="catalogo-row">
                        <td className="td-titulo">{obra.title || '—'}</td>
                        <td className="td-organico">{obra.organico || obra.instrumentation || '—'}</td>
                        <td className="td-ano">{obra.year || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="empty-message">No hay obras listadas en el catálogo.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
