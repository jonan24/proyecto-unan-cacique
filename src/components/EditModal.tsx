import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, FileImage, Clipboard, Check, Info, RefreshCw } from "lucide-react";
import { resolveImageUrl } from "../config/imageHelper";
import { compressImage } from "../utils/imageCompressor";

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "image" | "audio";
  placeholder?: string;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldConfig[];
  initialValues: Record<string, any>;
  onSave: (values: Record<string, any>) => void;
}

export default function EditModal({
  isOpen,
  onClose,
  title,
  fields,
  initialValues,
  onSave,
}: EditModalProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setValues({ ...initialValues });
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleChange = (name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File, fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    const isAudioField = field?.type === "audio";

    if (isAudioField) {
      if (!file.type.startsWith("audio/") && !file.name.endsWith(".mp3") && !file.name.endsWith(".wav") && !file.name.endsWith(".ogg") && !file.name.endsWith(".m4a")) {
        alert("Por favor selecciona únicamente archivos de audio (MP3, WAV, OGG, M4A, etc.).");
        return;
      }

      setIsUploading(true);
      try {
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        try {
          const response = await fetch("/api/save-media", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              audio: base64Data,
              filename: file.name,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.url) {
              handleChange(fieldName, data.url);
              setIsUploading(false);
              return;
            }
          }
          handleChange(fieldName, base64Data);
        } catch (error) {
          console.error("Error uploading audio to server:", error);
          handleChange(fieldName, base64Data);
        }
      } catch (err) {
        console.error("Error reading audio file:", err);
        alert("No se pudo procesar el archivo de audio. Por favor intenta de nuevo.");
      } finally {
        setIsUploading(false);
      }
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona únicamente archivos de imagen (PNG, JPG, JPEG, WEBP, etc.).");
      return;
    }

    setIsUploading(true);
    try {
      // Compress image to ensure it's under typical file upload sizes and loads incredibly fast!
      const base64Data = await compressImage(file, 1200, 1200, 0.85);
      
      try {
        const response = await fetch("/api/save-media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Data,
            filename: file.name,
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.url) {
            handleChange(fieldName, data.url);
            setIsUploading(false);
            return;
          }
        }
        // Fallback if server response is not successful
        handleChange(fieldName, base64Data);
      } catch (error) {
        console.error("Error uploading image to server:", error);
        // Fallback to local Base64
        handleChange(fieldName, base64Data);
      }
    } catch (compressErr) {
      console.error("Error compressing image:", compressErr);
      alert("No se pudo procesar la imagen seleccionada. Por favor intenta con otra.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], fieldName);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], fieldName);
    }
  };

  const triggerFileInput = (fieldName: string) => {
    document.getElementById(`file-input-${fieldName}`)?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl border border-colonial-sand shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-colonial-sand bg-colonial-cream/40 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">🛠️</span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-colonial-dark">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-colonial-dark/50 hover:bg-colonial-sand hover:text-colonial-dark transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-grow">
            {fields.map((field) => {
              const currentValue = values[field.name] || "";

              return (
                <div key={field.name} className="space-y-2">
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-colonial-terracotta">
                    {field.label}
                  </label>

                  {field.type === "text" && (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ""}
                      className="w-full px-4 py-2.5 rounded-xl border border-colonial-sand focus:outline-none focus:ring-2 focus:ring-colonial-terracotta/40 bg-colonial-cream/10 text-sm"
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      value={currentValue}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ""}
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-xl border border-colonial-sand focus:outline-none focus:ring-2 focus:ring-colonial-terracotta/40 bg-colonial-cream/10 text-sm font-sans resize-y"
                    />
                  )}

                  {field.type === "image" && (
                    <div className="space-y-3">
                      {/* Drag & Drop zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={(e) => handleDrop(e, field.name)}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all ${
                          dragActive
                            ? "border-colonial-terracotta bg-colonial-cream"
                            : currentValue
                            ? "border-colonial-gold/50 bg-colonial-cream/10 hover:border-colonial-terracotta/50"
                            : "border-colonial-sand hover:border-colonial-terracotta bg-white"
                        }`}
                        onClick={() => triggerFileInput(field.name)}
                      >
                        <input
                          id={`file-input-${field.name}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, field.name)}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center space-y-2 text-colonial-terracotta">
                            <RefreshCw className="w-6 h-6 animate-spin text-colonial-terracotta" />
                            <p className="text-xs font-sans font-bold">Subiendo imagen al servidor...</p>
                            <p className="text-[10px] text-colonial-dark/50">Por favor espera un momento</p>
                          </div>
                        ) : currentValue ? (
                          <div className="flex items-center space-x-3 text-colonial-dark">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-colonial-sand shrink-0 shadow-sm bg-white">
                              <img
                                src={resolveImageUrl(currentValue)}
                                alt="Previsualización"
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-mono font-bold text-emerald-600 flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>¡Imagen Cargada!</span>
                              </p>
                              <p className="text-[11px] text-colonial-dark/60 font-sans mt-1">
                                Clic o arrastra para cambiar el archivo.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 bg-colonial-cream text-colonial-terracotta rounded-full border border-colonial-terracotta/15">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-sans font-medium text-colonial-dark">
                                <span className="text-colonial-terracotta hover:underline font-bold">Selecciona un archivo</span> o arrástralo aquí
                              </p>
                              <p className="text-[10px] text-colonial-dark/50 font-mono mt-1">
                                PNG, JPG, JPEG, WEBP (guardado físico automático)
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Manual Path input with guideline tooltip */}
                      <div className="bg-colonial-cream/40 p-4 rounded-xl border border-colonial-sand/50 space-y-2">
                        <div className="flex items-start space-x-2 text-colonial-dark/80">
                          <Info className="w-4 h-4 text-colonial-terracotta mt-0.5 shrink-0" />
                          <div className="text-xs font-sans leading-relaxed">
                            <span className="font-bold block text-colonial-terracotta-dark">
                              // REFERENCIA DE RUTA (Guardado definitivo fuera de línea):
                            </span>
                            1. Copia tu archivo físico en la carpeta: <code className="bg-white/80 px-1 py-0.5 rounded border border-colonial-sand text-[10px] font-mono">public/assets/images/</code>
                            <br />
                            2. Escribe la ruta exacta en este campo para que compile correctamente con Vite:
                          </div>
                        </div>

                        <input
                          type="text"
                          value={currentValue.startsWith("data:") ? "" : currentValue}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder="Ejemplo: /assets/images/mi_imagen.jpg"
                          className="w-full px-3 py-1.5 rounded-lg border border-colonial-sand bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-colonial-terracotta/40"
                        />
                        {currentValue.startsWith("data:") && (
                          <p className="text-[10px] text-colonial-dark/50 italic font-sans pl-1">
                            * Actualmente usando imagen subida (Base64). Si escribes una ruta física, se usará esa ruta.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {field.type === "audio" && (
                    <div className="space-y-3">
                      {/* Drag & Drop zone for audio */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={(e) => handleDrop(e, field.name)}
                        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all ${
                          dragActive
                            ? "border-colonial-terracotta bg-colonial-cream"
                            : currentValue
                            ? "border-colonial-gold/50 bg-colonial-cream/10 hover:border-colonial-terracotta/50"
                            : "border-colonial-sand hover:border-colonial-terracotta bg-white"
                        }`}
                        onClick={() => triggerFileInput(field.name)}
                      >
                        <input
                          id={`file-input-${field.name}`}
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileChange(e, field.name)}
                          className="hidden"
                        />

                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center space-y-2 text-colonial-terracotta">
                            <RefreshCw className="w-6 h-6 animate-spin text-colonial-terracotta" />
                            <p className="text-xs font-sans font-bold">Subiendo archivo de audio...</p>
                            <p className="text-[10px] text-colonial-dark/50">Por favor espera un momento</p>
                          </div>
                        ) : currentValue ? (
                          <div className="flex items-center space-x-3 text-colonial-dark w-full max-w-md">
                            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl shrink-0 shadow-sm text-lg">
                              🎵
                            </div>
                            <div className="text-left overflow-hidden flex-grow">
                              <p className="text-xs font-mono font-bold text-emerald-600 flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>¡Audio Cargado!</span>
                              </p>
                              <p className="text-[11px] text-colonial-dark/80 font-mono truncate mt-0.5">
                                {currentValue}
                              </p>
                              <p className="text-[10px] text-colonial-dark/50 font-sans">
                                Clic o arrastra para cambiar el audio.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="p-3 bg-colonial-cream text-colonial-terracotta rounded-full border border-colonial-terracotta/15">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-sans font-medium text-colonial-dark">
                                <span className="text-colonial-terracotta hover:underline font-bold">Selecciona un audio local</span> o arrástralo aquí
                              </p>
                              <p className="text-[10px] text-colonial-dark/50 font-mono mt-1">
                                MP3, WAV, OGG, M4A (guardado físico automático)
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Manual Path or URL input */}
                      <div className="bg-colonial-cream/40 p-4 rounded-xl border border-colonial-sand/50 space-y-2">
                        <div className="flex items-start space-x-2 text-colonial-dark/80">
                          <Info className="w-4 h-4 text-colonial-terracotta mt-0.5 shrink-0" />
                          <div className="text-xs font-sans leading-relaxed">
                            <span className="font-bold block text-colonial-terracotta-dark">
                              // RUTA LOCAL O ENLACE EXTERNO:
                            </span>
                            1. Puedes usar la subida automática de arriba para guardar el archivo en el servidor.
                            <br />
                            2. O puedes copiar tu archivo físico en <code className="bg-white/80 px-1 py-0.5 rounded border border-colonial-sand text-[10px] font-mono">public/assets/audio/</code> y escribir la ruta manual abajo:
                          </div>
                        </div>

                        <input
                          type="text"
                          value={currentValue.startsWith("data:") ? "" : currentValue}
                          onChange={(e) => handleChange(field.name, e.target.value)}
                          placeholder="Ejemplo: /assets/audio/mi_cancion.mp3"
                          className="w-full px-3 py-1.5 rounded-lg border border-colonial-sand bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-colonial-terracotta/40"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </form>

          {/* Footer Controls */}
          <div className="p-5 border-t border-colonial-sand bg-colonial-cream/20 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-colonial-sand text-colonial-dark text-sm hover:bg-colonial-cream transition-colors font-sans cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-display font-bold shadow-md transition-all flex items-center space-x-2 ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed opacity-70"
                  : "bg-colonial-terracotta hover:bg-colonial-terracotta-dark hover:shadow-lg cursor-pointer"
              }`}
            >
              {isUploading && <RefreshCw className="w-4 h-4 animate-spin text-white" />}
              <span>{isUploading ? "Subiendo..." : "Guardar Cambios"}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
