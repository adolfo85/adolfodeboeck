import React from 'react';
import defaultFondo from '../img/fondo.jpg';
import './HeroBanner.css';

export default function HeroBanner({
  name = "ADOLFO CÉSAR DE BOECK",
  subtitle = "Compositor",
  heroImage
}) {
  // Resuelve la imagen de fondo: usa fondo.jpg por defecto o si apunta a la textura antigua
  const bgImage = (!heroImage || heroImage.includes('hero_texture') || heroImage === '/src/img/fondo.jpg')
    ? defaultFondo
    : heroImage;

  return (
    <section
      className="hero-banner"
      style={{
        backgroundImage: `url(${bgImage})`
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
