import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import './Home.css';

export default function Home() {
  const [content, setContent] = useState(contentService.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setContent(contentService.getContent());
    };
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, bio } = content;

  return (
    <div className="home-view">
      {/* Hero Banner con textura crumpled paper y tipografía serif */}
      <HeroBanner
        name={general?.name}
        subtitle={general?.subtitle}
        heroImage={general?.heroImage}
      />

      {/* Tarjeta Central BIO en fondo oscuro */}
      <main className="main-content-section">
        <div className="content-container">
          <article className="editorial-card bio-card">
            <h2 className="bio-heading">{bio?.title || 'BIO'}</h2>

            {/* Texto en Español */}
            <div className="bio-language-block bio-es">
              {Array.isArray(bio?.es) ? (
                bio.es.map((paragraph, idx) => (
                  <p key={idx} className="bio-paragraph">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="bio-paragraph">{bio?.es}</p>
              )}
            </div>

            {/* Separador sutil si existe versión en inglés */}
            {bio?.en && (
              <div className="bio-language-block bio-en">
                {Array.isArray(bio.en) ? (
                  bio.en.map((paragraph, idx) => (
                    <p key={idx} className="bio-paragraph english-text">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="bio-paragraph english-text">{bio.en}</p>
                )}
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}