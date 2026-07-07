import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, Landmark, ShieldCheck, Award, Quote, ChevronRight, Edit3 } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { resolveImageUrl } from "../config/imageHelper";

export default function InstitutionalThanks() {
  const { isEditMode, thanks, setThanks } = useAppData();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fields: FieldConfig[] = [
    { name: "danielOrtegaPortrait", label: "Retrato del Comandante Daniel Ortega", type: "image" },
    { name: "fslnFlagEmblem", label: "Bandera FSLN y Emblema UNAN", type: "image" },
    { name: "quoteText", label: "Frase célebre / Cita Presidencial", type: "textarea", placeholder: "Escribe la frase del Comandante..." },
    { name: "p1", label: "Párrafo 1 (Agradecimiento Principal)", type: "textarea", placeholder: "Escribe el primer párrafo..." },
    { name: "p2", label: "Párrafo 2 (Presupuesto del 6%)", type: "textarea", placeholder: "Escribe el segundo párrafo..." },
    { name: "p3", label: "Párrafo 3 (Compromiso Académico)", type: "textarea", placeholder: "Escribe el tercer párrafo..." }
  ];

  const handleSave = (values: Record<string, any>) => {
    setThanks({
      danielOrtegaPortrait: values.danielOrtegaPortrait || thanks.danielOrtegaPortrait,
      fslnFlagEmblem: values.fslnFlagEmblem || thanks.fslnFlagEmblem,
      quoteText: values.quoteText || thanks.quoteText,
      thanksParagraphs: [
        values.p1 || thanks.thanksParagraphs[0],
        values.p2 || thanks.thanksParagraphs[1],
        values.p3 || thanks.thanksParagraphs[2]
      ]
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest">
          <Landmark className="w-3.5 h-3.5" />
          <span>Reconocimiento Institucional</span>
        </div>
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Agradecimiento Institucional y Educativo
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Un sincero homenaje de gratitud por la oportunidad de recibir educación pública, 
          gratuita y con los más altos estándares de calidad en nuestra prestigiosa alma mater.
        </p>
        <div className="w-16 h-1 bg-colonial-terracotta mx-auto rounded" />
      </div>

      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="max-w-5xl mx-auto flex justify-center sm:justify-end">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Contenido Institucional</span>
          </button>
        </div>
      )}

      {/* Hero Visual Section - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Left Side: Portrait of Comandante Daniel Ortega */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 bg-white rounded-2xl border border-colonial-sand p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden border border-colonial-sand shadow-inner bg-colonial-cream">
              <img
                // REFERENCIA DE RUTA: Retrato del Comandante Daniel Ortega, guardado localmente
                src={resolveImageUrl(thanks.danielOrtegaPortrait)}
                alt="Comandante Daniel Ortega"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Subtle Red & Black corner overlay badge */}
              <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-600 to-black text-white px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider font-bold shadow-md">
                FSLN • Sandinista
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-display font-extrabold text-lg text-colonial-dark">
                Comandante Daniel Ortega Saavedra
              </h3>
              <p className="text-xs font-mono text-colonial-terracotta font-bold uppercase tracking-widest mt-0.5">
                Presidente de la República de Nicaragua
              </p>
            </div>
          </div>

          <div className="bg-colonial-cream/50 p-4 rounded-xl border border-colonial-sand/50 relative">
            <Quote className="w-8 h-8 text-colonial-terracotta/10 absolute top-2 left-2" />
            <p className="text-[11px] sm:text-xs text-colonial-dark/80 italic font-sans leading-relaxed text-center relative z-10">
              "{thanks.quoteText}"
            </p>
          </div>
        </motion.div>

        {/* Right Side: Letter of Thanks & Red-Black flag illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-7 flex flex-col justify-between space-y-8 bg-white rounded-2xl border border-colonial-sand p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          {/* FSLN Flag and UNAN-Managua Emblem */}
          <div className="relative h-44 rounded-xl overflow-hidden border border-colonial-sand bg-gradient-to-r from-red-700 via-zinc-900 to-black">
            <img
              // REFERENCIA DE RUTA: Bandera y Escudo Institucional local
              src={resolveImageUrl(thanks.fslnFlagEmblem)}
              alt="Bandera FSLN y Emblema UNAN"
              className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 opacity-90"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-5">
              <span className="text-[10px] font-mono tracking-widest text-colonial-gold-light uppercase font-bold">
                Gobierno de Reconciliación y Unidad Nacional
              </span>
              <h4 className="font-display font-extrabold text-lg sm:text-xl text-white tracking-wide">
                Patria, Educación y Revolución
              </h4>
            </div>
          </div>

          {/* Letter Content */}
          <div className="space-y-4 font-sans text-sm text-colonial-dark/90 leading-relaxed">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-red-100 text-red-600 rounded mt-0.5 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
              <p className="whitespace-pre-line">
                {thanks.thanksParagraphs[0]}
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 bg-red-100 text-red-600 rounded mt-0.5 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
              <p className="whitespace-pre-line">
                {thanks.thanksParagraphs[1]}
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-1 bg-red-100 text-red-600 rounded mt-0.5 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
              <p className="whitespace-pre-line">
                {thanks.thanksParagraphs[2]}
              </p>
            </div>
          </div>

          {/* Institutional Stamp or badges footer */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-colonial-sand/50 text-center">
            <div className="p-3 bg-colonial-cream/40 rounded-xl border border-colonial-sand/30 flex flex-col items-center justify-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <span className="text-[10px] font-mono font-bold text-colonial-dark uppercase tracking-wider block">
                Educación Gratuita
              </span>
            </div>
            <div className="p-3 bg-colonial-cream/40 rounded-xl border border-colonial-sand/30 flex flex-col items-center justify-center space-y-1">
              <Award className="w-5 h-5 text-colonial-gold" />
              <span className="text-[10px] font-mono font-bold text-colonial-dark uppercase tracking-wider block">
                6% Constitucional
              </span>
            </div>
            <div className="p-3 bg-colonial-cream/40 rounded-xl border border-colonial-sand/30 flex flex-col items-center justify-center space-y-1">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-[10px] font-mono font-bold text-colonial-dark uppercase tracking-wider block">
                Mística y Patria
              </span>
            </div>
          </div>
        </motion.div>

      </div>

      <EditModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Editar Contenido Institucional"
        fields={fields}
        initialValues={{
          danielOrtegaPortrait: thanks.danielOrtegaPortrait,
          fslnFlagEmblem: thanks.fslnFlagEmblem,
          quoteText: thanks.quoteText,
          p1: thanks.thanksParagraphs[0],
          p2: thanks.thanksParagraphs[1],
          p3: thanks.thanksParagraphs[2]
        }}
        onSave={handleSave}
      />
    </div>
  );
}
