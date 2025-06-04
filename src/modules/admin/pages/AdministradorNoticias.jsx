import { useState, useEffect } from "react";
import { 
  PageHeader, 
  FloatingActionButton, 
  ConfirmationModal, 
  EmptyState, 
  LoadingState
} from "../components";

import { 
  NoticiasGrid, 
  NoticiaFormModal 
} from "../components";

import { useNoticias } from "../hooks";

export const AdministradorNoticias = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("agregar");
  const [selectedItem, setSelectedItem] = useState(null);
  
  const {
    noticias,
    noticiasActivas,
    noticiasVencidas,
    loading,
    fetchNoticias,
    obtenerDetalleCompleto,
    agregarNuevaNoticia,
    actualizarNoticiaExistente,
    eliminarNoticiaById
  } = useNoticias();

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  const handleOpenCreateForm = () => {
    setFormMode("agregar");
    setSelectedItem(null);
    setFormModalOpen(true);
  };

  const handleOpenEditForm = async (item) => {
    try {
      const detalleNoticia = await obtenerDetalleCompleto(item.slug);
      setFormMode("editar");
      setSelectedItem(detalleNoticia);
      setFormModalOpen(true);
    } catch (err) {
      console.error("Error al obtener detalle de la noticia:", err);
    }
  };

  const handleSubmitForm = async (data) => {
    try {
      if (formMode === "agregar") {
        await agregarNuevaNoticia(data);
      } else {
        await actualizarNoticiaExistente(data);
      }
      setFormModalOpen(false);
    } catch (error) {
      console.error("Error al procesar noticia:", error);
    }
  };

  const handleRequestDelete = (id) => {
    setSelectedItem({ id });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarNoticiaById(selectedItem.id);
      setShowDeleteModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error al eliminar noticia:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState message="Cargando noticias..." />;
    }
    
    if (noticias.length === 0) {
      return (
        <EmptyState 
          title="No hay noticias" 
          message="Todavía no hay noticias registradas." 
          actionLabel="Crear noticia"
          onAction={handleOpenCreateForm}
        />
      );
    }
    
    return (
      <div className="space-y-12">
        {noticiasActivas.length > 0 && (
          <NoticiasGrid 
            title="Noticias Activas"
            badge={{ label: "Activas", color: "green" }}
            items={noticiasActivas}
            onEdit={handleOpenEditForm}
            onDelete={handleRequestDelete}
          />
        )}
        
        {noticiasVencidas.length > 0 && (
          <NoticiasGrid 
            title="Noticias Vencidas"
            badge={{ label: "Vencidas", color: "red" }}
            items={noticiasVencidas}
            onEdit={handleOpenEditForm}
            onDelete={handleRequestDelete}
          />
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PageHeader 
        title="Administrar Noticias"
        description="Gestiona las noticias y artículos de tu plataforma"
      />
      
      {renderContent()}
      
      <FloatingActionButton 
        onClick={handleOpenCreateForm} 
        label="Crear noticia"
      />

      <NoticiaFormModal
        isOpen={formModalOpen}
        modo={formMode}
        initialData={selectedItem}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmitForm}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Eliminar Noticia"
        message="¿Estás seguro de que deseas eliminar esta noticia? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        danger
      />
    </div>
  );
};