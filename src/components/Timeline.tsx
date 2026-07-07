import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { TimelineItem } from "../data";
import { Calendar, Eye, X, ChevronRight, Award, Edit3, Trash2, Plus } from "lucide-react";
import { resolveImageUrl } from "../config/imageHelper";

export default function Timeline() {
  const { isEditMode, timeline, updateTimelineItem, addTimelineItem, deleteTimelineItem } = useAppData();
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  // States for Editing/Adding timeline items
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const timelineFields: FieldConfig[] = [
    { name: "year", label: "Año / Fecha", type: "text", placeholder: "Ej. 1523" },
    { name: "title", label: "Título del Acontecimiento", type: "text", placeholder: "Ej. Combate del 17 de Abril" },
    { name: "shortDescription", label: "Descripción Corta", type: "text", placeholder: "Resumen breve para la tarjeta de la línea" },
    { name: "fullDescription", label: "Descripción Detallada", type: "textarea", placeholder: "Explica detalladamente qué ocurrió..." },
    { name: "image", label: "Ilustración Histórica (Opcional)", type: "image" }
  ];

  const handleEditClick = (e: React.MouseEvent, item: TimelineItem) => {
    e.stopPropagation(); // Prevent opening detail modal
    setEditingItem(item);
  };

  const handleDeleteClick = (e: React.MouseEvent, year: string, title: string) => {
    e.stopPropagation(); // Prevent opening detail modal
    if (window.confirm(`¿Estás seguro de que deseas eliminar el hito de "${year} - ${title}"?`)) {
      deleteTimelineItem(year);
    }
  };

  const handleSaveItem = (values: Record<string, any>) => {
    if (isAdding) {
      const newItem: TimelineItem = {
        year: values.year || `Año-${Date.now()}`,
        title: values.title || "Nuevo Acontecimiento",
        shortDescription: values.shortDescription || "Breve resumen del acontecimiento histórico.",
        fullDescription: values.fullDescription || "Descripción detallada del hito histórico.",
        image: values.image || ""
      };
      addTimelineItem(newItem);
      setIsAdding(false);
    } else if (editingItem) {
      updateTimelineItem(editingItem.year, {
        ...editingItem,
        ...values
      } as TimelineItem);
      setEditingItem(null);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="space-y-12">
      {/* Introduction Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Línea de Tiempo de la Resistencia
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Sigue el rastro cronológico del choque de mundos en 1523 y cómo el grito libertario del Cacique Diriangén se transformó en patrimonio inquebrantable de la identidad soberana de Nicaragua.
        </p>
        <div className="flex items-center justify-center space-x-2 pt-2">
          <span className="h-0.5 w-12 bg-colonial-gold" />
          <span className="text-xs font-mono text-colonial-terracotta uppercase tracking-widest font-semibold">
            Haz clic en cualquier hito para ver más detalles
          </span>
          <span className="h-0.5 w-12 bg-colonial-gold" />
        </div>
      </div>

      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="max-w-5xl mx-auto flex justify-center sm:justify-end">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Hito de Tiempo</span>
          </button>
        </div>
      )}

      {/* Vertical Timeline Structure */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative max-w-5xl mx-auto px-4"
      >
        {/* Central connecting vertical line */}
        <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-colonial-gold via-colonial-terracotta to-colonial-forest/40 transform -translate-x-1/2 hidden sm:block" />
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-colonial-gold sm:hidden" />

        <div className="space-y-12">
          {timeline.map((item: TimelineItem, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={item.year}
                variants={itemVariants}
                className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                  isEven ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Visual Connector Dot */}
                <div className="absolute left-6 sm:left-1/2 w-5 h-5 rounded-full border-4 border-white bg-colonial-terracotta shadow-md transform -translate-x-1/2 z-10 scale-110 sm:scale-125 transition-all duration-300 group-hover:bg-colonial-gold-light" />

                {/* Left/Right Container for Card spacing */}
                <div className="w-full sm:w-1/2 pl-12 sm:pl-0 sm:px-8">
                  {/* Timeline Card */}
                  <div
                    onClick={() => setSelectedItem(item)}
                    className="bg-white rounded-2xl border border-colonial-sand shadow-md p-6 sm:p-8 hover:shadow-xl hover:border-colonial-gold/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
                  >
                    {/* Background Subtle Highlight */}
                    <div className="absolute top-0 left-0 w-2 h-full bg-colonial-terracotta group-hover:bg-colonial-gold transition-colors" />

                    {/* Admin editing overlay when in edit mode */}
                    {isEditMode && (
                      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl border border-colonial-sand/60 shadow-md">
                        <button
                          onClick={(e) => handleEditClick(e, item)}
                          className="p-1 text-colonial-terracotta hover:bg-colonial-cream rounded"
                          title="Editar hito de tiempo"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-4 bg-colonial-sand" />
                        <button
                          onClick={(e) => handleDeleteClick(e, item.year, item.title)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar este hito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Timeline Date Header */}
                    <div className="flex items-center space-x-2 text-colonial-terracotta mb-3">
                      <Calendar className="w-4 h-4" />
                      <span className="font-mono text-xs font-bold tracking-wider uppercase">
                        {item.year}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-xl text-colonial-dark group-hover:text-colonial-terracotta transition-colors mb-2 pr-16">
                      {item.title}
                    </h3>

                    <p className="text-sm text-colonial-dark/80 leading-relaxed font-sans mb-4">
                      {item.shortDescription}
                    </p>

                    {/* Expand Trigger Text */}
                    <div className="flex items-center space-x-1 text-xs font-mono font-bold text-colonial-gold-light group-hover:text-colonial-terracotta transition-colors">
                      <span>Ver detalles de la resistencia</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {/* Empty container for desktop balancing */}
                <div className="hidden sm:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Timeline Modal Details */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-colonial-dark/85 backdrop-blur-xs">
            {/* Modal backdrop closer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 cursor-pointer"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-colonial-beige rounded-2xl border-2 border-colonial-gold border-double p-6 sm:p-8 shadow-2xl z-10 overflow-hidden text-colonial-dark"
            >
              {/* Top Banner Ornament */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-colonial-gold via-colonial-terracotta to-colonial-gold" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-colonial-cream hover:bg-colonial-sand text-colonial-dark transition-colors border border-colonial-gold/20 cursor-pointer animate-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Year Label */}
                <div className="inline-flex items-center space-x-1 bg-colonial-terracotta/10 text-colonial-terracotta font-mono text-xs font-bold px-3 py-1 rounded-full border border-colonial-terracotta/20">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedItem.year}</span>
                </div>

                {/* Title */}
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-colonial-terracotta-dark pr-8">
                  {selectedItem.title}
                </h3>

                {/* Modal Main Image if exists */}
                {selectedItem.image && (
                  <div className="relative h-48 sm:h-64 w-full rounded-xl overflow-hidden border border-colonial-gold/20 shadow-inner">
                    <img
                      src={resolveImageUrl(selectedItem.image)}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent flex items-end p-4">
                      <span className="text-white text-[11px] font-mono tracking-wider flex items-center space-x-1 bg-black/40 px-2 py-1 rounded">
                        <Award className="w-3.5 h-3.5 text-colonial-gold" />
                        <span>Hito Histórico de Nicaragua</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* Full Description */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-colonial-clay font-bold border-b border-colonial-sand pb-1.5">
                    Descripción Completa
                  </h4>
                  <p className="text-sm sm:text-base text-colonial-dark/90 leading-relaxed font-sans whitespace-pre-line">
                    {selectedItem.fullDescription}
                  </p>
                </div>

                {/* Actions Footer */}
                <div className="flex justify-end pt-4 border-t border-colonial-sand">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-5 py-2.5 rounded-lg bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white font-medium text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </motion.div>
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
        title={isAdding ? "Agregar Nuevo Hito Histórico" : `Editar Hito Histórico: ${editingItem?.year}`}
        fields={timelineFields}
        initialValues={
          isAdding
            ? { year: "", title: "", shortDescription: "", fullDescription: "", image: "" }
            : (editingItem || {})
        }
        onSave={handleSaveItem}
      />
    </div>
  );
}
