import axios from "axios";
import { API_BASE } from "./apiConfig";

export const obtenerNoticias = () => {
  return axios.get(`${API_BASE}/noticias/obtener-noticias`);
};

export const obtenerDetalleNoticia = (slug) => {
  return axios.get(`${API_BASE}/noticias/obtener-detalle-noticia/${slug}`);
};

export const obtenerCategorias = () => {
  return axios.get(`${API_BASE}/noticias/obtener-categorias`);
};