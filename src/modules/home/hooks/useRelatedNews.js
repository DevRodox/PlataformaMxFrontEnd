import { useState, useEffect } from 'react';
import { obtenerNoticias } from '../../config';

export const useRelatedNews = (currentNewsSlug) => {
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRelatedNews = async () => {
      if (!currentNewsSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await obtenerNoticias();
        const allNews = response.data;
        
        if (Array.isArray(allNews)) {
        const filteredNews = allNews
          .filter(news => news.slug !== currentNewsSlug)
          .map(news => ({
            id: news.id,
            slug: news.slug,
            title: news.titulo,
            image: news.imagen_portada,
          }));
          
          setRelatedNews(filteredNews);
        } else {
          throw new Error('Received data is not an array');
        }
      } catch (err) {
        setError(err.message || 'Error al cargar noticias relacionadas');
        console.error('Error loading related news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedNews();
  }, [currentNewsSlug]);

  return { relatedNews, loading, error };
};