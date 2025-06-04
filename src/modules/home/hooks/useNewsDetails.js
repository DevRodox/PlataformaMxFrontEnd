import { useState, useEffect } from 'react';
import { obtenerDetalleNoticia, obtenerCategorias } from '../../config';

export const useNewsDetails = (slug) => {
  const [newsDetail, setNewsDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState({});

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await obtenerCategorias();
        const categoriasMap = {};
        data.forEach(cat => {
          categoriasMap[cat.id] = cat.categoria;
        });
        setCategorias(categoriasMap);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
      }
    };

    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data } = await obtenerDetalleNoticia(slug);
        
        const arrayData = Array.isArray(data) ? data : [];
        
        if (arrayData.length === 0) {
          throw new Error("Noticia no encontrada.");
        }

        const n = arrayData[0];
        
        const formattedNews = {
          id: n.id,
          slug: n.slug,
          title: n.titulo,
          author: n.autor,
          date: new Date(n.fecha_publicacion).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }),
          categoryId: n.categoria_id,
          category: categorias[n.categoria_id] || `Categoría ${n.categoria_id}`,
          images: [n.imagen_portada, n.imagen01].filter(Boolean),
          content: [n.seccion01].filter(Boolean),
        };

        if (n.imagen02) formattedNews.images.push(n.imagen02);
        if (n.seccion02) formattedNews.content.push(n.seccion02);

        setNewsDetail(formattedNews);
      } catch (err) {
        setError(err.message || 'Error al cargar el detalle de la noticia');
        console.error("Error loading news detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(categorias).length > 0 || loading) {
      fetchNewsDetail();
    }
  }, [slug, categorias]);

  return { newsDetail, loading, error };
};