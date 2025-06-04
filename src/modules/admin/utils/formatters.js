export const formatearListadoNoticias = (data) => {
  return data.map((noticia) => ({
    id: noticia.id,
    slug: noticia.slug,
    title: noticia.titulo,
    image: noticia.imagen_portada,
    fechaPublicacion: noticia.fecha_publicacion,
    fechaVencimiento: noticia.fecha_vencimiento,
  }));
};

export const ordenarNoticiasPorFecha = (noticias) => {
  return [...noticias].sort(
    (a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)
  );
};

export const truncarTexto = (texto, maxLength = 100) => {
  if (!texto || texto.length <= maxLength) return texto;
  return texto.substring(0, maxLength) + '...';
};