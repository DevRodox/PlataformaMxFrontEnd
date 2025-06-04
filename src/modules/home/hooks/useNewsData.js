import { useState, useEffect } from 'react';
import { obtenerNoticias } from '../../config';

export const useNewsData = () => {
  const [newsData, setNewsData] = useState({
    slide: [],
    secondNews: [],
    more: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await obtenerNoticias();
        const data = Array.isArray(response) ? response : response.data;

        if (!Array.isArray(data)) {
          throw new Error("La respuesta de noticias no es un array.");
        }

        const sortedNews = [...data].sort(
          (a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)
        );

        const now = new Date();
        const validNews = sortedNews.filter(
          news => news.fecha_vencimiento === null || new Date(news.fecha_vencimiento) > now
        );

        if (validNews.length === 0) {
          setNewsData({
            slide: [],
            secondNews: [],
            more: []
          });
          return;
        }

        const principalNews = validNews.slice(0, Math.min(5, validNews.length));
        
        const siguientes = validNews.length > 5 ? 
          validNews.slice(5, Math.min(9, validNews.length)) : [];
        
        const restantes = validNews.length > 9 ? validNews.slice(9) : [];

        setNewsData({
          slide: principalNews.map((n) => ({
            id: n.id,
            slug: n.slug,
            image: n.imagen_portada,
            title: n.titulo,
          })),
          secondNews: siguientes.map((n) => ({
            id: n.id,
            slug: n.slug,
            image: n.imagen_portada,
            description: n.titulo,
          })),
          more: restantes.map((n) => ({
            id: n.id,
            slug: n.slug,
            image: n.imagen_portada,
            description: n.titulo,
          })),
        });
      } catch (err) {
        setError(err.message || 'Error al cargar noticias');
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return { newsData, loading, error };
};