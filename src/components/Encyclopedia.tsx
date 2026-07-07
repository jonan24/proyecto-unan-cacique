import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { Article } from "../data";
import { Search, BookOpen, ExternalLink, Calendar, Users, Shield, MapPin, Tag, Edit3, Trash2, Plus } from "lucide-react";

export default function Encyclopedia() {
  const { isEditMode, articles, updateArticle, addArticle, deleteArticle } = useAppData();

  const [selectedArticleId, setSelectedArticleId] = useState<string>("diriangen");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // States for Editing/Adding articles
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Fallback to first article if the current selected one was deleted
  const currentArticle = articles.find(
    (art: Article) => art.id === selectedArticleId
  ) || articles[0] || {
    id: "empty",
    title: "Sin artículos",
    category: "General",
    summary: "No hay artículos disponibles.",
    content: "Por favor agrega un artículo nuevo para comenzar."
  };

  const articleFields: FieldConfig[] = [
    { name: "title", label: "Título del Artículo", type: "text", placeholder: "Ej. Armamento Chorotega" },
    { name: "category", label: "Categoría", type: "text", placeholder: "Ej. Cultura, Personajes, Batallas" },
    { name: "summary", label: "Resumen Introductorio (Destacado)", type: "textarea", placeholder: "Breve párrafo introductorio..." },
    { name: "content", label: "Contenido Completo (Párrafos)", type: "textarea", placeholder: "Escribe el contenido detallado de tu investigación. Usa dos saltos de línea (Enter dos veces) para separar los párrafos." },
    
    // Infobox attributes
    { name: "info_lugar", label: "[Ficha] Lugar / Ubicación", type: "text", placeholder: "Ej. Istmo de Rivas" },
    { name: "info_lider", label: "[Ficha] Líder / Cacique", type: "text", placeholder: "Ej. Cacique Diriangén / Nicarao" },
    { name: "info_adversarios", label: "[Ficha] Adversarios", type: "text", placeholder: "Ej. Conquistadores Españoles" },
    { name: "info_etnia", label: "[Ficha] Etnia / Pueblo", type: "text", placeholder: "Ej. Chorotega / Nahualt" },
    { name: "info_hecho", label: "[Ficha] Hecho Clave", type: "text", placeholder: "Ej. Resistencia armada de 1523" }
  ];

  const handleEditClick = () => {
    setEditingArticle(currentArticle);
  };

  const handleDeleteClick = () => {
    if (currentArticle.id === "empty") return;
    if (window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el artículo científico "${currentArticle.title}"?`)) {
      deleteArticle(currentArticle.id);
      // Select another article
      const remaining = articles.filter((a: Article) => a.id !== currentArticle.id);
      if (remaining.length > 0) {
        setSelectedArticleId(remaining[0].id);
      } else {
        setSelectedArticleId("empty");
      }
    }
  };

  const handleSaveArticle = (values: Record<string, any>) => {
    const infobox: Record<string, string> = {};
    if (values.info_lugar) infobox["Lugar"] = values.info_lugar;
    if (values.info_lider) infobox["Líder / Cacique"] = values.info_lider;
    if (values.info_adversarios) infobox["Adversarios"] = values.info_adversarios;
    if (values.info_etnia) infobox["Etnia / Pueblo"] = values.info_etnia;
    if (values.info_hecho) infobox["Hecho Clave"] = values.info_hecho;

    if (isAdding) {
      const newArt: Article = {
        id: `article-${Date.now()}`,
        title: values.title || "Nuevo Artículo",
        category: values.category || "General",
        summary: values.summary || "Resumen del nuevo artículo.",
        content: values.content || "Contenido completo del artículo.",
        infobox: Object.keys(infobox).length > 0 ? infobox : undefined
      };
      addArticle(newArt);
      setSelectedArticleId(newArt.id);
      setIsAdding(false);
    } else if (editingArticle) {
      updateArticle(editingArticle.id, {
        ...editingArticle,
        title: values.title || editingArticle.title,
        category: values.category || editingArticle.category,
        summary: values.summary || editingArticle.summary,
        content: values.content || editingArticle.content,
        infobox: Object.keys(infobox).length > 0 ? infobox : undefined
      });
      setEditingArticle(null);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  // Filter articles based on search query
  const filteredArticles = articles.filter((art: Article) =>
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper icons for infobox categories
  const getInfoboxIcon = (label: string) => {
    const labelLower = label.toLowerCase();
    if (labelLower.includes("nacimiento") || labelLower.includes("fallecimiento") || labelLower.includes("fecha")) {
      return <Calendar className="w-4 h-4 text-colonial-gold" />;
    }
    if (labelLower.includes("etnia") || labelLower.includes("familia") || labelLower.includes("pueblo") || labelLower.includes("cacique") || labelLower.includes("líder")) {
      return <Users className="w-4 h-4 text-colonial-gold" />;
    }
    if (labelLower.includes("rango") || labelLower.includes("arma") || labelLower.includes("adversarios")) {
      return <Shield className="w-4 h-4 text-colonial-gold" />;
    }
    if (labelLower.includes("hecho") || labelLower.includes("encuentro") || labelLower.includes("límite")) {
      return <BookOpen className="w-4 h-4 text-colonial-gold" />;
    }
    return <MapPin className="w-4 h-4 text-colonial-gold" />;
  };

  return (
    <div className="space-y-10">
      {/* Introduction */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Enciclopedia de la Resistencia
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Explora artículos detallados sobre los personajes históricos, comunidades, armas de combate y expediciones coloniales de la Nicaragua de 1523.
        </p>
        <div className="w-16 h-1 bg-colonial-terracotta mx-auto rounded" />
      </div>

      {/* Main Encyclopedia Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Index Sidebar (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-colonial-sand p-5 space-y-6 shadow-sm">
          {/* Admin Add Article Button */}
          {isEditMode && (
            <button
              onClick={handleAddClick}
              className="w-full px-4 py-2.5 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Artículo Científico</span>
            </button>
          )}

          {/* Search bar inside Sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-colonial-dark/60 block">
              Buscar en la Enciclopedia
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar artículo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-colonial-cream/50 border border-colonial-sand rounded-xl focus:outline-none focus:ring-2 focus:ring-colonial-terracotta/40 focus:border-colonial-terracotta font-sans transition-all"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-colonial-dark/40" />
            </div>
          </div>

          {/* Article Index list */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-colonial-clay border-b border-colonial-sand pb-1.5">
              Índice de Artículos
            </h4>
            
            <ul className="space-y-1">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art: Article) => {
                  const isSelected = art.id === selectedArticleId;
                  return (
                    <li key={art.id}>
                      <button
                        onClick={() => setSelectedArticleId(art.id)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-sans font-semibold transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? "bg-colonial-terracotta text-white shadow-md"
                            : "text-colonial-dark hover:bg-colonial-cream hover:text-colonial-terracotta-dark"
                        }`}
                      >
                        <span className="truncate">{art.title}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${
                          isSelected ? "bg-white/20 text-white" : "bg-colonial-cream text-colonial-clay"
                        }`}>
                          {art.category.split(" ")[0]}
                        </span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <li className="text-xs text-colonial-dark/50 italic py-4 text-center">
                  No se encontraron artículos
                </li>
              )}
            </ul>
          </div>

          {/* Sidebar decorative footer */}
          <div className="pt-4 border-t border-colonial-sand/60 text-[11px] font-mono text-colonial-dark/50 leading-relaxed">
            <span className="font-bold">Nota de edición:</span> Todos los datos han sido cotejados con crónicas de Indias y la Academia de Geografía e Historia de Nicaragua.
          </div>
        </div>

        {/* Central Reading Area (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-colonial-sand p-6 sm:p-8 shadow-sm space-y-6 relative">
          {/* Article editing toolbar inside active article */}
          {isEditMode && currentArticle.id !== "empty" && (
            <div className="flex items-center justify-end space-x-2 border-b border-colonial-sand pb-3 mb-3">
              <button
                onClick={handleEditClick}
                className="px-3 py-1.5 bg-colonial-cream hover:bg-colonial-sand text-colonial-dark hover:text-colonial-terracotta rounded-lg text-xs font-mono font-bold border border-colonial-sand/60 flex items-center space-x-1 cursor-pointer"
                title="Editar este artículo"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-xs font-mono font-bold border border-red-200 flex items-center space-x-1 cursor-pointer"
                title="Eliminar este artículo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentArticle.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Category Breadcrumb */}
              <div className="flex items-center space-x-2 text-xs font-mono text-colonial-clay">
                <Tag className="w-3.5 h-3.5" />
                <span className="uppercase tracking-widest font-semibold">{currentArticle.category}</span>
                <span>/</span>
                <span>Nicaragua Precolombina</span>
              </div>

              {/* Title with decorative double border */}
              <div className="border-b-4 border-double border-colonial-sand pb-4">
                <h3 className="font-display font-bold text-3xl sm:text-4xl text-colonial-dark">
                  {currentArticle.title}
                </h3>
                <p className="text-sm italic text-colonial-dark/60 mt-2 font-serif">
                  De la enciclopedia de la primera gesta revolucionaria del istmo.
                </p>
              </div>

              {/* Summary lead paragraph */}
              <p className="text-base font-medium text-colonial-dark leading-relaxed font-sans border-l-4 border-colonial-gold pl-4 bg-colonial-cream/35 py-3 pr-2 rounded-r-xl">
                {currentArticle.summary}
              </p>

              {/* Article core content */}
              <div className="prose prose-stone max-w-none text-sm sm:text-base text-colonial-dark/90 leading-relaxed font-sans space-y-4 whitespace-pre-line">
                {currentArticle.content.split("\n\n").map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Wikipedia-like Citation Block */}
              <div className="mt-10 pt-6 border-t border-colonial-sand space-y-3">
                <h5 className="text-xs font-mono font-bold text-colonial-dark/50 uppercase tracking-wider flex items-center space-x-1">
                  <span>📚 Referencias y Lecturas Adicionales</span>
                </h5>
                <ul className="text-xs font-serif text-colonial-dark/70 space-y-1.5 pl-4 list-decimal">
                  <li>Cereceda, A. de. (1523). <em>Relación del viaje de Gil González Dávila en busca del Mar Dulce</em>. Archivo General de Indias.</li>
                  <li>Ayón, T. (1889). <em>Historia de Nicaragua desde los tiempos más remotos</em>. Tomo I. Granada.</li>
                  <li>Incer Barquero, J. (2002). <em>Crónicas del Descubrimiento y la Conquista de Nicaragua</em>. Editorial Colección Cultural de Centroamérica.</li>
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right InfoBox Factsheet (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {currentArticle.infobox && (
              <motion.div
                key={`infobox-${currentArticle.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-colonial-cream rounded-2xl border-2 border-colonial-gold/30 shadow-md p-5"
              >
                {/* Infobox Header */}
                <div className="text-center border-b border-colonial-gold/20 pb-4 mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-colonial-clay uppercase block mb-1">
                    Ficha Técnica Histórica
                  </span>
                  <h4 className="font-display font-bold text-lg text-colonial-terracotta-dark">
                    {currentArticle.title}
                  </h4>
                </div>

                {/* Infobox entries */}
                <div className="space-y-4">
                  {Object.entries(currentArticle.infobox).map(([key, val]) => (
                    <div key={key} className="space-y-1.5 border-b border-colonial-sand/60 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center space-x-1.5 text-xs font-mono text-colonial-clay font-bold uppercase tracking-wider">
                        {getInfoboxIcon(key)}
                        <span>{key}</span>
                      </div>
                      <p className="text-sm font-sans font-semibold text-colonial-dark/90 pl-5 leading-normal whitespace-pre-line">
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Infobox footer emblem */}
                <div className="mt-5 pt-3 border-t border-colonial-gold/20 flex justify-center items-center space-x-2 text-[10px] font-mono text-colonial-dark/50">
                  <span className="w-1.5 h-1.5 bg-colonial-terracotta rounded-full" />
                  <span>Documento de Identidad Nacional</span>
                  <span className="w-1.5 h-1.5 bg-colonial-terracotta rounded-full" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt to related topic linking inside the encyclopedia */}
          <div className="bg-white rounded-2xl border border-colonial-sand p-5 shadow-inner">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-colonial-clay mb-3">
              Temas Sugeridos
            </h4>
            <div className="flex flex-wrap gap-2">
              {articles
                .filter((art: Article) => art.id !== selectedArticleId)
                .slice(0, 5)
                .map((art: Article) => (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className="text-xs bg-colonial-cream hover:bg-colonial-sand text-colonial-terracotta-dark font-sans font-semibold px-3 py-1.5 rounded-lg border border-colonial-sand transition-colors cursor-pointer text-left w-full truncate"
                  >
                    {art.title}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editing Modal */}
      <EditModal
        isOpen={!!editingArticle || isAdding}
        onClose={() => {
          setEditingArticle(null);
          setIsAdding(false);
        }}
        title={isAdding ? "Agregar Artículo Científico" : `Editar Artículo: ${editingArticle?.title}`}
        fields={articleFields}
        initialValues={
          isAdding
            ? { title: "", category: "", summary: "", content: "", info_lugar: "", info_lider: "", info_adversarios: "", info_etnia: "", info_hecho: "" }
            : {
                title: editingArticle?.title,
                category: editingArticle?.category,
                summary: editingArticle?.summary,
                content: editingArticle?.content,
                info_lugar: editingArticle?.infobox?.["Lugar"] || "",
                info_lider: editingArticle?.infobox?.["Líder / Cacique"] || "",
                info_adversarios: editingArticle?.infobox?.["Adversarios"] || "",
                info_etnia: editingArticle?.infobox?.["Etnia / Pueblo"] || "",
                info_hecho: editingArticle?.infobox?.["Hecho Clave"] || ""
              }
        }
        onSave={handleSaveArticle}
      />
    </div>
  );
}
