import React from 'react';
import './HeroBanner.css';

export default function HeroBanner({
  name = "ADOLFO CÉSAR DE BOECK",
  subtitle = "Compositor",
  heroImage = "/src/img/hero_texture.jpg"
}) {
  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `url(${heroImage})`
      }}
    >
      <div className="hero-dark-overlay"></div>
      <div className="hero-inner-content">
        <h1 className="hero-composer-name">{name}</h1>
        <p className="hero-composer-subtitle">{subtitle}</p>
      </div>
    </section>
  );
}
