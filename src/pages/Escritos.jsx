import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import { contentService } from '../services/contentService';
import { BookOpen, FileText, ExternalLink, Layers } from 'lucide-react';
import './SectionStyles.css';
import './Escritos.css';

export default function Escritos() {
  const [content, setContent] = useState(contentService.getContent());
  const [activeFilter, setActiveFilter] = useState('todos'); // 'todos' | 'libros' | 'articulos'

  useEffect(() => {
    const handleUpdate = () => setContent(contentService.getContent());
    window.addEventListener('contentUpdated', handleUpdate);
    return () => window.removeEventListener('contentUpdated', handleUpdate);
  }, []);

  const { general, literatura } = content;
  const items = literatura?.items || [];

  const isBook = (item) => {
    const t = (item.type || item.category || '').toLowerCase();
    return t.includes('libro');
  };

  const books = items.filter(isBook);
  const articles = items.filter(it => !isBook(it));

  return (
    <div className="section-view">
      <HeroBanner
        name={general?.name}
        subtitle={literatura?.title || "ESCRITOS"}
        heroImage={general?.heroImage}
      />

      <main className="main-content-section">
        <div className="content-container">
          <div className="section-header-box">
            <h2 className="section-title">{literatura?.title || 'ESCRITOS'}</h2>
            {literatura?.subtitle && <p className="section-subtitle">{literatura.subtitle}</p>}
          </div>

          {/* Barra de Filtros Segmentada */}
          <div className="escritos-filter-bar">
            <button
              className={`escritos-filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('todos')}
            >
              <Layers size={15} />
              <span>Todos</span>
              <span className="filter-count-badge">{items.length}</span>
            </button>
            <button
              className={`escritos-filter-btn ${activeFilter === 'libros' ? 'active' : ''}`}
              onClick={() => setActiveFilter('libros')}
            >
              <BookOpen size={15} />
              <span>Libros</span>
              <span className="filter-count-badge">{books.length}</span>
            </button>
            <button
              className={`escritos-filter-btn ${activeFilter === 'articulos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('articulos')}
            >
              <FileText size={15} />
              <span>Artículos & Ensayos</span>
              <span className="filter-count-badge">{articles.length}</span>
            </button>
          </div>

          {/* LISTA DE ITEMS */}
          <div className="escritos-content-wrapper">
            {/* SECCIÓN LIBROS */}
            {(activeFilter === 'todos' || activeFilter === 'libros') && books.length > 0 && (
              <section className="escritos-category-block">
                {activeFilter === 'todos' && (
                  <h3 className="escritos-group-heading">
                    <BookOpen size={20} />
                    <span>Libros Publicados</span>
                  </h3>
                )}
                <div className="books-list">
                  {books.map((book) => (
                    <article key={book.id} className="book-card">
                      {/* Tapa del Libro */}
                      <div className="book-cover-col">
                        {book.imageUrl ? (
                          <img
                            src={book.imageUrl}
                            alt={`Tapa de ${book.title}`}
                            className="book-cover-img"
                          />
                        ) : (
                          <div className="book-cover-placeholder">
                            <BookOpen size={36} className="book-placeholder-icon" />
                            <span className="book-placeholder-text">Libro</span>
                          </div>
                        )}
                      </div>

                      {/* Información y Descripción */}
                      <div className="book-info-col">
                        <div className="item-badge-row">
                          <span className="meta-badge book-badge">Libro</span>
                          {book.year && <span className="meta-year">{book.year}</span>}
                        </div>
                        <h4 className="book-title">{book.title}</h4>
                        {book.description && (
                          <p className="book-description">{book.description}</p>
                        )}
                        {book.link && (
                          <a
                            href={book.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="item-action-link"
                          >
                            <span>Acceder a la publicación</span>
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* SECCIÓN ARTÍCULOS Y ENSAYOS */}
            {(activeFilter === 'todos' || activeFilter === 'articulos') && articles.length > 0 && (
              <section className="escritos-category-block">
                {activeFilter === 'todos' && (
                  <h3 className="escritos-group-heading">
                    <FileText size={20} />
                    <span>Artículos & Ensayos</span>
                  </h3>
                )}
                <div className="items-list">
                  {articles.map((item) => (
                    <article key={item.id} className="editorial-card item-card">
                      <div className="item-card-header">
                        <div className="item-badge-row">
                          <span className="meta-badge article-badge">{item.type || 'Artículo / Ensayo'}</span>
                          {item.year && <span className="meta-year">{item.year}</span>}
                        </div>
                        <h4 className="item-title">{item.title}</h4>
                      </div>
                      {item.description && (
                        <p className="item-description" style={{ whiteSpace: 'pre-line' }}>{item.description}</p>
                      )}
                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="item-action-link"
                        >
                          <span>Leer publicación</span>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Mensaje de sección vacía */}
            {items.length === 0 && (
              <p className="empty-message">No hay publicaciones registradas aún.</p>
            )}

            {activeFilter === 'libros' && books.length === 0 && items.length > 0 && (
              <p className="empty-message">No hay libros registrados en este momento.</p>
            )}

            {activeFilter === 'articulos' && articles.length === 0 && items.length > 0 && (
              <p className="empty-message">No hay artículos o ensayos registrados en este momento.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
