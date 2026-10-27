import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { Play, ExternalLink } from 'lucide-react';
import './SectionStyles.css';

// Función para transformar URLs de YouTube (watch, youtu.be, shorts) a embed
function getEmbedUrl(url) {
  if (!url) return null;
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
  } catch {
    return null;
  }
  return null;
}

export default function Videos() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, videos } = content;

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={videos?.title || "AUDIO Y VIDEOS"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{videos?.title || 'AUDIO Y VIDEOS'}</h2>
            {videos?.subtitle && <p className="section-subtitle">{videos.subtitle}</p>}
          </div>

          <div className="videos-grid">
            {videos?.items && videos.items.length > 0 ? (
              videos.items.map((video) => {
                const embedUrl = getEmbedUrl(video.url);
                return (
                  <div key={video.id} className="editorial-card video-card">
                    {embedUrl ? (
                      <div className="video-responsive-frame">
                        <iframe
                          src={embedUrl}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ) : (
                      <div className="video-placeholder-link">
                        <Play size={36} className="play-icon" />
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-direct-link"
                        >
                          Reproducir en {video.platform || 'Plataforma externa'}
                          <ExternalLink size={14} style={{ marginLeft: 6 }} />
                        </a>
                      </div>
                    )}

                    <div className="video-details">
                      <div className="video-meta">
                        {video.platform && <span className="meta-badge">{video.platform}</span>}
                        {video.year && <span className="meta-year">{video.year}</span>}
                      </div>
                      <h3 className="video-item-title">{video.title}</h3>
                      {video.description && (
                        <p className="video-item-desc">{video.description}</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-message">No hay registros de audio o video cargados.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
