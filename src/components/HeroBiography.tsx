import React, { useState } from "react";
import { motion } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { Quote, Sparkles, Shield, Compass, Edit3 } from "lucide-react";
import { resolveImageUrl } from "../config/imageHelper";

export default function HeroBiography() {
  const { isEditMode, biography, setBiography } = useAppData();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fields: FieldConfig[] = [
    { name: "name", label: "Nombre del Héroe", type: "text" },
    { name: "image", label: "Imagen de Portada", type: "image" },
    { name: "title", label: "Título / Rango", type: "text" },
    { name: "period", label: "Periodo Histórico", type: "text" },
    { name: "birthPlace", label: "Lugar de Origen", type: "text" },
    { name: "epithet", label: "Epíteto / Distinción", type: "text" },
    { name: "quote", label: "Cita Célebre / Arenga (1523)", type: "textarea" },
    { name: "intro", label: "Resumen Biográfico Rápido", type: "textarea" },
    { name: "historyTitle", label: "Título de la Sección Narrativa", type: "text" },
    { name: "p1", label: "Párrafo Histórico 1 (Inicio)", type: "textarea" },
    { name: "p2", label: "Párrafo Histórico 2 (Encuentro)", type: "textarea" },
    { name: "p3", label: "Párrafo Histórico 3 (Batalla)", type: "textarea" },
    { name: "p4", label: "Párrafo Histórico 4 (Impacto)", type: "textarea" },
    { name: "legacyTitle", label: "Título de la Sección de Legado", type: "text" },
    { name: "legacyContent", label: "Contenido del Legado", type: "textarea" }
  ];

  const handleSave = (values: Record<string, any>) => {
    setBiography({
      name: values.name || biography.name,
      image: values.image || biography.image || "",
      title: values.title || biography.title,
      period: values.period || biography.period,
      birthPlace: values.birthPlace || biography.birthPlace,
      epithet: values.epithet || biography.epithet,
      quote: values.quote || biography.quote,
      intro: values.intro || biography.intro,
      historySection: {
        title: values.historyTitle || biography.historySection.title,
        paragraphs: [
          values.p1 || biography.historySection.paragraphs[0] || "",
          values.p2 || biography.historySection.paragraphs[1] || "",
          values.p3 || biography.historySection.paragraphs[2] || "",
          values.p4 || biography.historySection.paragraphs[3] || ""
        ].filter(p => p.trim() !== "")
      },
      legacy: {
        title: values.legacyTitle || biography.legacy.title,
        content: values.legacyContent || biography.legacy.content
      }
    });
    setIsOpen(false);
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-16"
    >
      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Información Biográfica</span>
          </button>
        </div>
      )}

      {/* Hero Section */}
      <motion.section 
        variants={itemVariants} 
        className="relative rounded-2xl overflow-hidden border-2 border-colonial-gold/30 shadow-2xl bg-colonial-dark text-colonial-beige"
      >
        <div className="absolute inset-0 bg-linear-to-t from-colonial-dark via-colonial-dark/60 to-transparent z-10" />
        
        {/* Main Hero Image */}
        <div className="relative h-[450px] sm:h-[550px] w-full overflow-hidden">
          <img
            src={resolveImageUrl(biography.image) || "/assets/images/cacique_diriangen_hero_1783307374586.jpg"}
            alt="Cacique Diriangén luchando contra invasores"
            className="w-full h-full object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Hero content overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-12 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-colonial-terracotta/90 text-colonial-gold-light text-xs font-mono px-3 py-1.5 rounded-full border border-colonial-gold/40 shadow-sm uppercase tracking-wider w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Héroe Nacional de Nicaragua</span>
          </div>
          
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-wide drop-shadow-md">
            {biography.name}
          </h1>
          
          <p className="font-serif italic text-lg sm:text-2xl text-colonial-gold-light tracking-wide max-w-2xl">
            "{biography.title}"
          </p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm text-colonial-sand/90 font-mono border-t border-colonial-gold/20 pt-4 mt-2">
            <div><span className="text-colonial-clay">Período:</span> {biography.period}</div>
            <div className="hidden sm:block text-colonial-gold/40">|</div>
            <div><span className="text-colonial-clay">Origen:</span> {biography.birthPlace}</div>
            <div className="hidden sm:block text-colonial-gold/40">|</div>
            <div><span className="text-colonial-clay">Epíteto:</span> {biography.epithet}</div>
          </div>
        </div>
      </motion.section>

      {/* Quote Banner */}
      <motion.section variants={itemVariants} className="max-w-4xl mx-auto px-4">
        <div className="relative bg-colonial-cream rounded-2xl p-8 sm:p-10 border border-colonial-gold/20 shadow-lg text-center overflow-hidden">
          {/* Decorative colonial corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-colonial-terracotta m-2 opacity-60" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-colonial-terracotta m-2 opacity-60" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-colonial-terracotta m-2 opacity-60" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-colonial-terracotta m-2 opacity-60" />
          
          <Quote className="w-12 h-12 text-colonial-terracotta mx-auto mb-4 opacity-40" />
          
          <p className="font-serif italic text-xl sm:text-2xl text-colonial-dark leading-relaxed max-w-2xl mx-auto">
            {biography.quote}
          </p>
          
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-[1px] w-8 bg-colonial-gold" />
            <span className="font-display font-semibold text-xs text-colonial-terracotta uppercase tracking-widest">
              Arenga de Diriangén, 1523
            </span>
            <div className="h-[1px] w-8 bg-colonial-gold" />
          </div>
        </div>
      </motion.section>

      {/* Main Biography Text Grid */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Left Side: Factsheet and Quick Info card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-colonial-cream rounded-2xl p-6 border-2 border-colonial-gold/20 shadow-md">
            <h3 className="font-display font-bold text-lg text-colonial-terracotta mb-4 border-b border-colonial-gold/20 pb-2 flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Resumen Histórico</span>
            </h3>
            
            <p className="text-sm text-colonial-dark/90 leading-relaxed mb-6 whitespace-pre-line">
              {biography.intro}
            </p>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex justify-between py-2 border-b border-colonial-sand">
                <span className="text-colonial-dark/60 font-medium">GRUPO ÉTNICO</span>
                <span className="text-colonial-terracotta-dark font-bold">Chorotega</span>
              </div>
              <div className="flex justify-between py-2 border-b border-colonial-sand">
                <span className="text-colonial-dark/60 font-medium">REINO</span>
                <span className="text-colonial-terracotta-dark font-bold">Señorío de los Dirianes</span>
              </div>
              <div className="flex justify-between py-2 border-b border-colonial-sand">
                <span className="text-colonial-dark/60 font-medium">AÑO DE RESISTENCIA</span>
                <span className="text-colonial-terracotta-dark font-bold">1523 (17 de Abril)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-colonial-sand">
                <span className="text-colonial-dark/60 font-medium">ADVERSARIO CLAVE</span>
                <span className="text-colonial-terracotta-dark font-bold">Gil González Dávila</span>
              </div>
              <div className="flex justify-between py-2 border-b border-colonial-sand">
                <span className="text-colonial-dark/60 font-medium">UBICACIÓN PRINCIPAL</span>
                <span className="text-colonial-terracotta-dark font-bold">Diriamba / Carazo</span>
              </div>
            </div>
          </div>

          {/* Quick interactive historical highlight */}
          <div className="bg-colonial-dark text-colonial-beige rounded-2xl p-6 border border-colonial-gold/30 shadow-md relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
              <Compass className="w-40 h-40 text-colonial-gold" />
            </div>
            <h4 className="font-display font-bold text-sm text-colonial-gold-light uppercase tracking-wider mb-2">
              Sabías que...
            </h4>
            <p className="text-xs text-colonial-sand/90 leading-relaxed">
              El nombre "Diriangén" proviene del idioma chorotega, compuesto por "diria" (cerro/altura) y "mheg" o "gen" (señor/cacique), traduciéndose literalmente como <strong>"El Señor de los Cerros"</strong>.
            </p>
          </div>
        </div>

        {/* Right Side: Narrative biography content */}
        <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-2xl border border-colonial-sand shadow-sm">
          <h2 className="font-display font-bold text-3xl text-colonial-dark flex items-center space-x-3">
            <span className="bg-colonial-terracotta/10 text-colonial-terracotta p-2 rounded-lg">
              📜
            </span>
            <span className="title-ornament">{biography.historySection.title}</span>
          </h2>

          <div className="prose prose-stone max-w-none space-y-6 text-colonial-dark/90 text-base leading-relaxed font-sans">
            {biography.historySection.paragraphs.map((p, index) => (
              <p key={index} className={index === 0 ? "text-lg font-serif italic text-colonial-dark-light border-l-4 border-colonial-terracotta pl-4 whitespace-pre-line" : "whitespace-pre-line"}>
                {p}
              </p>
            ))}
          </div>

          {/* Legacy Subsection */}
          <div className="mt-12 pt-8 border-t border-colonial-sand space-y-4">
            <h3 className="font-display font-bold text-2xl text-colonial-terracotta-dark flex items-center space-x-2">
              <span>🌟</span>
              <span>{biography.legacy.title}</span>
            </h3>
            <p className="text-colonial-dark/90 leading-relaxed font-sans text-sm sm:text-base whitespace-pre-line">
              {biography.legacy.content}
            </p>
          </div>
        </div>
      </motion.section>

      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Datos Biográficos"
        fields={fields}
        initialValues={{
          name: biography.name,
          image: biography.image || "",
          title: biography.title,
          period: biography.period,
          birthPlace: biography.birthPlace,
          epithet: biography.epithet,
          quote: biography.quote,
          intro: biography.intro,
          historyTitle: biography.historySection.title,
          p1: biography.historySection.paragraphs[0] || "",
          p2: biography.historySection.paragraphs[1] || "",
          p3: biography.historySection.paragraphs[2] || "",
          p4: biography.historySection.paragraphs[3] || "",
          legacyTitle: biography.legacy.title,
          legacyContent: biography.legacy.content
        }}
        onSave={handleSave}
      />
    </motion.div>
  );
}
