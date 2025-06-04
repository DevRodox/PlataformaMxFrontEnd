import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { X, Upload, Calendar, User, FileType, Layers, Loader } from "lucide-react";
import { obtenerCategorias } from "../../services";
import { generateSlug } from "../../utils";

export const NoticiaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  modo = "agregar",
  initialData = {},
}) => {
  const [form, setForm] = useState({
    id: null,
    titulo: "",
    autor: "",
    fecha_publicacion: "",
    fecha_vencimiento: "",
    imagen_portada: null,
    categoria_id: "",
    seccion01: "",
    imagen01: null,
    seccion02: "",
    imagen02: null,
  });

  const [previews, setPreviews] = useState({
    imagen_portada: null,
    imagen01: null,
    imagen02: null
  });
  
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const { data } = await obtenerCategorias();
        setCategorias(data);
      } catch (err) {
        console.error("Error al obtener categorías:", err);
        setError("No se pudieron cargar las categorías");
      }
    };
    
    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    
    if (modo === "editar" && initialData) {
      setForm({
        id: initialData.id,
        titulo: initialData.titulo || "",
        autor: initialData.autor || "",
        fecha_publicacion: initialData.fecha_publicacion?.split("T")[0] || "",
        fecha_vencimiento: initialData.fecha_vencimiento?.split("T")[0] || "",
        imagen_portada: null,
        categoria_id: initialData.categoria_id?.toString() || "",
        seccion01: initialData.seccion01 || "",
        imagen01: null,
        seccion02: initialData.seccion02 || "",
        imagen02: null,
      });
      
      setPreviews({
        imagen_portada: initialData.imagen_portada_url || null,
        imagen01: initialData.imagen01_url || null,
        imagen02: initialData.imagen02_url || null
      });
    } else {
      setForm({
        id: null,
        titulo: "",
        autor: "",
        fecha_publicacion: "",
        fecha_vencimiento: "",
        imagen_portada: null,
        categoria_id: "",
        seccion01: "",
        imagen01: null,
        seccion02: "",
        imagen02: null,
      });
      
      setPreviews({
        imagen_portada: null,
        imagen01: null,
        imagen02: null
      });
    }
    setError("");
    setIsSubmitting(false);
  }, [isOpen, initialData, modo]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name.includes('imagen') && files && files.length > 0) {
      handleFileChange(name, files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (fieldName, file) => {
    if (file.size > 5 * 1024 * 1024) {
      setError(`El archivo ${file.name} es demasiado grande. Máximo 5MB permitido.`);
      return;
    }

    setForm((prev) => ({ ...prev, [fieldName]: file }));
    setPreviews(prev => ({
      ...prev,
      [fieldName]: URL.createObjectURL(file)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500", "bg-blue-500/10");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-500/10");
  };

  const handleDrop = (fieldName) => (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500", "bg-blue-500/10");
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(fieldName, e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!form.titulo.trim()) {
      setError("El título es obligatorio");
      return;
    }
    if (!form.autor.trim()) {
      setError("El autor es obligatorio");
      return;
    }
    if (!form.fecha_publicacion) {
      setError("La fecha de publicación es obligatoria");
      return;
    }
    if (!form.categoria_id) {
      setError("Selecciona una categoría");
      return;
    }
    if (!form.seccion01.trim()) {
      setError("La primera sección es obligatoria");
      return;
    }
    
    if (modo === "agregar" && !form.imagen_portada) {
      setError("La imagen de portada es obligatoria");
      return;
    }
    
    if (modo === "agregar" && !form.imagen01) {
      setError("La imagen para la primera sección es obligatoria");
      return;
    }

    const formData = { ...form, slug: generateSlug(form.titulo) };
    
    if (modo === "editar") {
      if (!formData.imagen_portada && initialData.imagen_portada_url) {
        formData.imagen_portada_url = initialData.imagen_portada_url;
      }
      
      if (!formData.imagen01 && initialData.imagen01_url) {
        formData.imagen01_url = initialData.imagen01_url;
      }
      
      if (!formData.imagen02 && initialData.imagen02_url) {
        formData.imagen02_url = initialData.imagen02_url;
      }
    }

    setError("");
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      setError("Ha ocurrido un error al guardar la noticia");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFileUpload = (fieldName, label, required = true) => {
    const fieldPreview = previews[fieldName];
    const fieldFile = form[fieldName];
    
    return (
      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-gray-300">
          <Upload size={16} className="mr-2" />
          {label} {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div 
          className="border-2 border-dashed rounded-lg p-4 text-center border-zinc-600 transition-colors"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop(fieldName)}
        >
          <input
            id={`file-${fieldName}`}
            type="file"
            name={fieldName}
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          {!fieldPreview ? (
            <div className="py-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-400">
                Arrastra una imagen aquí o{" "}
                <button
                  type="button"
                  onClick={() => document.getElementById(`file-${fieldName}`).click()}
                  className="text-blue-500 hover:text-blue-400 focus:outline-none"
                >
                  haz clic para seleccionar
                </button>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF hasta 5MB
              </p>
            </div>
          ) : (
            <div className="relative">
              <img
                src={fieldPreview}
                alt="Previsualización"
                className="mx-auto my-2 max-h-40 rounded object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setPreviews(prev => ({ ...prev, [fieldName]: null }));
                  setForm(prev => ({ ...prev, [fieldName]: null }));
                }}
                className="absolute top-1 right-1 p-1 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
              >
                <X size={16} />
              </button>
              <p className="mt-2 text-xs text-gray-400">
                {fieldFile ? (
                  <>
                    Archivo: {fieldFile.name}
                    <br />
                    Tamaño: {(fieldFile.size / 1024 / 1024).toFixed(2)} MB
                  </>
                ) : (
                  "Imagen actual"
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const calculateMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div 
        className="bg-zinc-800 text-white p-6 rounded-lg shadow-xl w-full max-w-2xl relative z-10 m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {modo === "agregar" ? "Crear Nueva Noticia" : "Editar Noticia"}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-700 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <FileType size={16} className="mr-2" />
                Título <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={form.titulo}
                onChange={handleChange}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="Título de la noticia"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <User size={16} className="mr-2" />
                Autor <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                name="autor"
                value={form.autor}
                onChange={handleChange}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="Nombre del autor"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Calendar size={16} className="mr-2" />
                  Fecha publicación <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={form.fecha_publicacion}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Calendar size={16} className="mr-2" />
                  Fecha vencimiento
                </label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  value={form.fecha_vencimiento}
                  min={calculateMinDate()}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <Layers size={16} className="mr-2" />
                Categoría <span className="text-red-400 ml-1">*</span>
              </label>
              <select
                name="categoria_id"
                value={form.categoria_id}
                onChange={handleChange}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                disabled={isSubmitting}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoria}
                  </option>
                ))}
              </select>
            </div>
            
            {renderFileUpload("imagen_portada", "Imagen de portada", true)}
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <FileType size={16} className="mr-2" />
                Sección 1 <span className="text-red-400 ml-1">*</span>
              </label>
              <textarea
                name="seccion01"
                value={form.seccion01}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="Contenido de la primera sección"
                disabled={isSubmitting}
              />
            </div>
            
            {renderFileUpload("imagen01", "Imagen para sección 1", true)}
            
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300">
                <FileType size={16} className="mr-2" />
                Sección 2 (opcional)
              </label>
              <textarea
                name="seccion02"
                value={form.seccion02}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:border-zinc-400 focus:ring-1 focus:ring-blue-500 outline-none transition"
                placeholder="Contenido de la segunda sección (opcional)"
                disabled={isSubmitting}
              />
            </div>
            
            {renderFileUpload("imagen02", "Imagen para sección 2", false)}
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-900/40 border border-red-800 rounded p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 font-medium rounded transition-colors flex items-center justify-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin mr-2" />
                {modo === "agregar" ? "Creando..." : "Actualizando..."}
              </>
            ) : (
              modo === "agregar" ? "Crear Noticia" : "Actualizar Noticia"
            )}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-zinc-700 hover:bg-gray-700 rounded transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

NoticiaFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  modo: PropTypes.oneOf(["agregar", "editar"]),
  initialData: PropTypes.object
};