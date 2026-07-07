import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import { 
  Settings, 
  Edit3, 
  Download, 
  RefreshCw, 
  Clipboard, 
  Check, 
  FileCode, 
  X, 
  HelpCircle, 
  AlertTriangle 
} from "lucide-react";

export default function EditorHub() {
  const { 
    isEditMode, 
    setIsEditMode, 
    biography, 
    timeline, 
    articles, 
    gallery, 
    songs, 
    students, 
    thanks,
    resetAllData 
  } = useAppData();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showExporter, setShowExporter] = useState<boolean>(false);
  const [activeExportTab, setActiveExportTab] = useState<"data" | "config">("data");
  const [copiedTab, setCopiedTab] = useState<"data" | "config" | null>(null);

  // Generate serialized code for src/data.ts
  const generateDataTSCode = (): string => {
    return `// ARCHIVO AUTO-GENERADO POR EL MODO EDICIÓN DE NICARAGUA INDÓMITA
// Guarda este archivo como "src/data.ts" en tu repositorio para fijar los cambios de manera definitiva.

export interface TimelineItem {
  year: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  infobox?: {
    [key: string]: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
}

export interface Song {
  id: string;
  title: string;
  author: string;
  genre: string;
  lyrics: string;
  youtubeId?: string;
  audioUrl?: string;
  duration: string;
  description: string;
}

export const biographyData = ${JSON.stringify(biography, null, 2)};

export const timelineItems: TimelineItem[] = ${JSON.stringify(timeline, null, 2)};

export const encyclopediaArticles: Article[] = ${JSON.stringify(articles, null, 2)};

export const galleryItems: GalleryItem[] = ${JSON.stringify(gallery, null, 2)};

export const songsData: Song[] = ${JSON.stringify(songs, null, 2)};
`;
  };

  // Generate serialized code for src/config/mediaConfig.ts
  const generateMediaConfigTSCode = (): string => {
    return `// ARCHIVO AUTO-GENERADO POR EL MODO EDICIÓN DE NICARAGUA INDÓMITA
// Guarda este archivo como "src/config/mediaConfig.ts" en tu repositorio para fijar los cambios de manera definitiva.

export interface StudentMember {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  email: string;
  phone?: string;
  github?: string;
  url: string;
}

export const studentGroupConfig: StudentMember[] = ${JSON.stringify(students, null, 2)};

// FACILIDAD DE EXTENSIÓN: Puedes duplicar o modificar los ítems de este arreglo según las necesidades de tu grupo escolar.
`;
  };

  const handleCopyCode = async (tab: "data" | "config") => {
    const code = tab === "data" ? generateDataTSCode() : generateMediaConfigTSCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      alert("No se pudo copiar el código automáticamente. Por favor selecciónalo manualmente.");
    }
  };

  const handleDownloadFile = (tab: "data" | "config") => {
    const code = tab === "data" ? generateDataTSCode() : generateMediaConfigTSCode();
    const filename = tab === "data" ? "data.ts" : "mediaConfig.ts";
    const blob = new Blob([code], { type: "text/typescript;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Floating Toggle Widget */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-3">
        {/* Expanded Options when Hub is clicked */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              className="bg-white rounded-2xl border border-colonial-sand shadow-2xl p-4 w-72 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-colonial-sand pb-2">
                <span className="font-display font-extrabold text-sm text-colonial-dark flex items-center space-x-1.5">
                  <Settings className="w-4 h-4 text-colonial-terracotta" />
                  <span>Configuración del Sitio</span>
                </span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-colonial-dark/40 hover:text-colonial-dark hover:bg-colonial-cream/50 p-1 rounded-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle Switch */}
              <div className="flex items-center justify-between bg-colonial-cream/30 p-3 rounded-xl border border-colonial-sand/40">
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wide text-colonial-dark">
                    Modo Edición
                  </p>
                  <p className="text-[10px] text-colonial-dark/60 font-sans">
                    Habilita botones para editar textos y subir imágenes.
                  </p>
                </div>
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                    isEditMode ? "bg-colonial-terracotta" : "bg-zinc-300"
                  }`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: isEditMode ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Advanced Utilities */}
              {isEditMode && (
                <div className="space-y-2">
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-colonial-terracotta-dark">
                    Herramientas del Editor
                  </p>
                  
                  {/* Export Trigger Button */}
                  <button
                    onClick={() => {
                      setShowExporter(true);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl border border-colonial-sand hover:border-colonial-terracotta/30 hover:bg-colonial-cream/30 text-xs font-sans text-colonial-dark font-medium flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-colonial-gold" />
                      <span>Exportar Archivos (.ts)</span>
                    </span>
                    <span className="bg-colonial-gold/10 text-colonial-gold-dark text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">Definitivo</span>
                  </button>

                  {/* Reset State Button */}
                  <button
                    onClick={resetAllData}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl border border-dashed border-red-200 hover:border-red-400 hover:bg-red-50 text-xs font-sans text-red-700 font-medium flex items-center space-x-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-red-500" />
                    <span>Restaurar Valores Iniciales</span>
                  </button>
                </div>
              )}

              {/* Instructions Guide Alert */}
              <div className="p-2.5 bg-colonial-cream/40 rounded-lg border border-colonial-sand/50 text-[10px] text-colonial-dark/70 font-sans flex items-start space-x-2">
                <HelpCircle className="w-3.5 h-3.5 text-colonial-terracotta mt-0.5 shrink-0" />
                <p className="leading-normal">
                  Los cambios se guardan localmente en tu navegador. Usa el botón <span className="font-bold">Exportar</span> para copiar los archivos a tu carpeta <span className="font-mono">src/</span> definitiva.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Control Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-5 py-3.5 rounded-full shadow-xl font-display font-bold text-sm tracking-wide cursor-pointer transition-colors border-2 ${
            isEditMode 
              ? "bg-colonial-terracotta text-white border-colonial-terracotta animate-pulse" 
              : "bg-colonial-dark text-colonial-beige border-colonial-gold/30 hover:bg-colonial-dark-light"
          }`}
        >
          {isEditMode ? (
            <>
              <Edit3 className="w-4 h-4" />
              <span>Modo Edición: ACTIVO</span>
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              <span>Ajustes & Editor</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Code Exporter Dialog / Modal Overlay */}
      <AnimatePresence>
        {showExporter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl border border-colonial-sand shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-colonial-sand bg-colonial-cream/40 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <FileCode className="w-5 h-5 text-colonial-terracotta" />
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-colonial-dark">
                    Exportar Configuración Definitiva (.ts)
                  </h3>
                </div>
                <button
                  onClick={() => setShowExporter(false)}
                  className="p-1.5 rounded-lg text-colonial-dark/50 hover:bg-colonial-sand hover:text-colonial-dark transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions Banner */}
              <div className="p-4 bg-amber-50 border-b border-amber-200/60 text-xs text-amber-900 font-sans flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">¿Cómo hacer permanentes tus cambios en GitHub Pages / Servidor Local?</p>
                  <p className="leading-relaxed opacity-90">
                    Las ediciones que realizas en la web se almacenan únicamente en el caché local (<code className="bg-amber-100 px-1 rounded font-mono text-[10px]">localStorage</code>) de tu navegador. Para que cualquier persona que visite tu sitio web las vea (tanto de forma offline como en internet), debes copiar el código generado a continuación y reemplazar el archivo físico correspondiente en tu repositorio de código.
                  </p>
                </div>
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-colonial-sand bg-colonial-cream/10 px-4 pt-2">
                <button
                  onClick={() => setActiveExportTab("data")}
                  className={`px-5 py-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeExportTab === "data"
                      ? "border-colonial-terracotta text-colonial-terracotta-dark bg-white rounded-t-lg border-t border-x border-colonial-sand"
                      : "border-transparent text-colonial-dark/50 hover:text-colonial-dark hover:bg-colonial-cream/30"
                  }`}
                >
                  📄 src/data.ts (Textos, Cronología, Canciones, Galería)
                </button>
                <button
                  onClick={() => setActiveExportTab("config")}
                  className={`px-5 py-3 text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
                    activeExportTab === "config"
                      ? "border-colonial-terracotta text-colonial-terracotta-dark bg-white rounded-t-lg border-t border-x border-colonial-sand"
                      : "border-transparent text-colonial-dark/50 hover:text-colonial-dark hover:bg-colonial-cream/30"
                  }`}
                >
                  ⚙️ src/config/mediaConfig.ts (Estudiantes y Autores)
                </button>
              </div>

              {/* Exporter Content */}
              <div className="p-6 flex-grow flex flex-col min-h-0 bg-zinc-950 text-zinc-100 font-mono text-xs overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 shrink-0">
                  <span className="text-[11px] text-zinc-400">
                    Previsualización del archivo de salida • {activeExportTab === "data" ? "src/data.ts" : "src/config/mediaConfig.ts"}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyCode(activeExportTab)}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-100 hover:text-white border border-zinc-700 flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      {copiedTab === activeExportTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" />
                          <span>Copiar Código</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(activeExportTab)}
                      className="px-3.5 py-1.5 rounded-lg bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Archivo</span>
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-auto mt-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] leading-relaxed scrollbar-thin select-all">
                  <pre className="whitespace-pre">
                    {activeExportTab === "data" ? generateDataTSCode() : generateMediaConfigTSCode()}
                  </pre>
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="p-4 border-t border-colonial-sand bg-colonial-cream/20 flex justify-end">
                <button
                  onClick={() => setShowExporter(false)}
                  className="px-5 py-2.5 rounded-xl bg-colonial-dark hover:bg-colonial-dark-light text-colonial-beige text-xs font-display font-bold shadow-md transition-all cursor-pointer"
                >
                  Entendido y Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
