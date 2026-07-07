import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { GalleryItem } from "../data";
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, Edit3, Trash2, Plus } from "lucide-react";

export default function Gallery() {
  const { isEditMode, gallery, updateGalleryItem, addGalleryItem, deleteGalleryItem } = useAppData();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // States for Editing/Adding gallery items
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const categoriesList = ["Todos", "Pinturas", "Esculturas", "Cultura", "Sitios Históricos", "Geografía"];

  const galleryFields: FieldConfig[] = [
    { name: "title", label: "Título de la Obra / Foto", type: "text", placeholder: "Ej. Pintura Heroica de Diriangén" },
    { name: "category", label: "Categoría", type: "text", placeholder: "Pinturas, Esculturas, Cultura, Sitios Históricos, Geografía" },
    { name: "description", label: "Descripción Detallada / Ficha Técnica", type: "textarea", placeholder: "Explica el origen, autor y significado..." },
    { name: "image", label: "Fotografía u Obra de Arte", type: "image" }
  ];

  const handleEditClick = (e: React.MouseEvent, item: GalleryItem) => {
    e.stopPropagation(); // Avoid triggering lightbox
    setEditingItem(item);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation(); // Avoid triggering lightbox
    if (window.confirm(`¿Estás seguro de que deseas eliminar la obra "${title}"?`)) {
      deleteGalleryItem(id);
    }
  };

  const handleSaveItem = (values: Record<string, any>) => {
    if (isAdding) {
      const newItem: GalleryItem = {
        id: `gallery-${Date.now()}`,
        title: values.title || "Nueva Obra",
        category: values.category || "Cultura",
        description: values.description || "Sin descripción disponible.",
        image: values.image || ""
      };
      addGalleryItem(newItem);
      setIsAdding(false);
    } else if (editingItem) {
      updateGalleryItem(editingItem.id, {
        ...editingItem,
        ...values
      } as GalleryItem);
      setEditingItem(null);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  // Filter items based on active category
  const filteredItems = selectedCategory === "Todos"
    ? gallery
    : gallery.filter((item: GalleryItem) => item.category === selectedCategory);

  const handleOpenLightbox = (itemId: string) => {
    // Find index of the item in the *currently filtered* list to support carousel-like navigation
    const idx = filteredItems.findIndex((item: GalleryItem) => item.id === itemId);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Keyboard accessibility for lightbox navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxIndex !== null) {
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowRight") setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
      if (e.key === "ArrowLeft") setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-10" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Galería Histórica y Cultural
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Un viaje visual a través de representaciones artísticas, monumentos esculpidos y los paisajes geográficos de Nicaragua que presenciaron la resistencia precolombina.
        </p>
        <div className="w-16 h-1 bg-colonial-terracotta mx-auto rounded" />
      </div>

      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="max-w-4xl mx-auto flex justify-center sm:justify-end">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Obra / Imagen</span>
          </button>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
        {categoriesList.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLightboxIndex(null); // Reset lightbox to prevent index out of bounds
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-colonial-terracotta text-white shadow-md border-b-2 border-colonial-gold-light"
                  : "bg-white text-colonial-dark border border-colonial-sand hover:bg-colonial-cream hover:text-colonial-terracotta"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item: GalleryItem) => (
            <motion.div
              layout
              key={item.id}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-colonial-sand overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative"
            >
              {/* Admin editing overlay when in edit mode */}
              {isEditMode && (
                <div className="absolute top-3 right-3 z-20 flex items-center space-x-1.5 bg-white/95 backdrop-blur px-2 py-1 rounded-lg border border-colonial-sand/60 shadow-md">
                  <button
                    onClick={(e) => handleEditClick(e, item)}
                    className="p-1 text-colonial-terracotta hover:bg-colonial-cream rounded"
                    title="Editar ficha"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-3 bg-colonial-sand" />
                  <button
                    onClick={(e) => handleDeleteClick(e, item.id, item.title)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar del catálogo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Image Frame with overlay hover */}
              <div
                onClick={() => handleOpenLightbox(item.id)}
                className="relative h-64 overflow-hidden bg-colonial-cream cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Hover overlay with icon */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 z-10">
                  <div className="bg-colonial-terracotta p-3 rounded-full border border-colonial-gold-light text-white transform scale-90 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </div>

                {/* Category label badge */}
                <div className="absolute top-3 left-3 bg-colonial-dark/80 backdrop-blur-xs text-[10px] font-mono font-bold text-colonial-gold-light px-2.5 py-1 rounded-md uppercase tracking-wider border border-colonial-gold/30 z-10">
                  {item.category}
                </div>
              </div>

              {/* Card Footer Text */}
              <div className="p-5 space-y-2">
                <h4 className="font-display font-bold text-base text-colonial-dark group-hover:text-colonial-terracotta transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-colonial-dark/70 font-sans line-clamp-2 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Overlay View */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <div className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 bg-black/95 backdrop-blur-md">
            {/* Background closer */}
            <div className="absolute inset-0" onClick={handleCloseLightbox} />

            {/* Lightbox Header Controls */}
            <div className="relative z-10 flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl mx-auto w-full">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-colonial-gold-light">
                <ImageIcon className="w-4 h-4" />
                <span>IMAGEN {lightboxIndex + 1} DE {filteredItems.length}</span>
                <span className="hidden sm:inline-block">/</span>
                <span className="hidden sm:inline-block text-white uppercase tracking-widest bg-white/10 px-2 py-0.5 rounded text-[10px]">
                  {filteredItems[lightboxIndex].category}
                </span>
              </div>
              <button
                onClick={handleCloseLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Core Area */}
            <div className="relative z-10 flex-1 flex items-center justify-between max-w-7xl mx-auto w-full gap-4">
              {/* Previous button */}
              <button
                onClick={handlePrev}
                className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 h-8" />
              </button>

              {/* Main Image View */}
              <motion.div
                key={filteredItems[lightboxIndex].id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="max-h-[60vh] sm:max-h-[70vh] max-w-full overflow-hidden flex items-center justify-center rounded-xl border border-white/10 shadow-2xl relative"
              >
                <img
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-h-full max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Next button */}
              <button
                onClick={handleNext}
                className="p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Siguiente imagen"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 h-8" />
              </button>
            </div>

            {/* Lightbox Caption Footer */}
            <div className="relative z-10 bg-zinc-900/90 border border-white/10 rounded-2xl p-5 sm:p-6 max-w-4xl mx-auto w-full text-white text-center space-y-2">
              <div className="inline-flex items-center space-x-1.5 bg-colonial-terracotta text-white font-mono text-[9px] sm:text-[10px] uppercase font-bold px-2.5 py-0.5 rounded">
                <Sparkles className="w-3 h-3 text-colonial-gold-light" />
                <span>Patrimonio de Nicaragua</span>
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-colonial-gold-light">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed font-sans whitespace-pre-line">
                {filteredItems[lightboxIndex].description}
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Editing Modal */}
      <EditModal
        isOpen={!!editingItem || isAdding}
        onClose={() => {
          setEditingItem(null);
          setIsAdding(false);
        }}
        title={isAdding ? "Agregar Obra al Catálogo" : `Editar Ficha Técnica: ${editingItem?.title}`}
        fields={galleryFields}
        initialValues={
          isAdding
            ? { title: "", category: "", description: "", image: "" }
            : (editingItem || {})
        }
        onSave={handleSaveItem}
      />
    </div>
  );
}
