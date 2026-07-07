import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppData } from "../context/AppDataContext";
import EditModal, { FieldConfig } from "./EditModal";
import { Song } from "../data";
import { resolveImageUrl } from "../config/imageHelper";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  Disc,
  Headphones,
  Maximize2,
  FileText,
  Download,
  Edit3,
  Trash2,
  Plus
} from "lucide-react";

export default function Cancionero() {
  const { isEditMode, songs, updateSong, addSong, deleteSong } = useAppData();

  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [expandedSongId, setExpandedSongId] = useState<string | null>("song-1");

  // States for Editing/Adding songs
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const songFields: FieldConfig[] = [
    { name: "title", label: "Título de la Canción", type: "text", placeholder: "Ej. Nicaragua, Nicaragüita" },
    { name: "author", label: "Autor / Intérprete", type: "text", placeholder: "Ej. Carlos Mejía Godoy" },
    { name: "genre", label: "Género / Estilo", type: "text", placeholder: "Ej. Música Testimonial" },
    { name: "duration", label: "Duración (Minutos:Segundos)", type: "text", placeholder: "Ej. 3:45" },
    { name: "audioUrl", label: "Ruta del Archivo de Audio (MP3)", type: "text", placeholder: "Ej. /assets/audio/nicaraguita.mp3" },
    { name: "description", label: "Contexto Histórico / Social", type: "textarea", placeholder: "Explica cuándo se compuso y qué representa..." },
    { name: "lyrics", label: "Letra Completa", type: "textarea", placeholder: "Escribe la letra de la canción organizada en estrofas..." }
  ];

  // Safeguard if songs list is empty
  const currentSong = songs[currentSongIndex] || {
    id: "empty",
    title: "Sin canciones",
    author: "N/A",
    genre: "General",
    duration: "0:00",
    audioUrl: "",
    description: "Por favor agrega una canción para reproducir.",
    lyrics: "Letra no disponible."
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number>(180);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Parse duration "MM:SS" string to total seconds
  const parseDuration = (durStr: string): number => {
    const parts = durStr.split(":");
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    return 180; // default 3 minutes
  };

  // Format seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Sync volume and muting on the actual audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Handle source changing
  useEffect(() => {
    if (audioRef.current && currentSong.audioUrl) {
      audioRef.current.src = currentSong.audioUrl || "";
      audioRef.current.load();
      
      const defaultDur = parseDuration(currentSong.duration);
      setDuration(defaultDur);
      setCurrentTime(0);

      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay prevented or failed:", err);
          setIsPlaying(false);
        });
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentSongIndex, currentSong.audioUrl]);

  // Handle play/pause toggles
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && currentSong.audioUrl) {
        audioRef.current.play().catch((err) => {
          console.warn("Playback prevented or failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong.audioUrl]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectSong = (index: number) => {
    if (index === currentSongIndex) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
    setExpandedSongId(songs[index].id);
  };

  const handleNextSong = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handlePrevSong = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    handleNextSong();
  };

  const toggleLyrics = (songId: string) => {
    setExpandedSongId(expandedSongId === songId ? null : songId);
  };

  const handleDownloadSong = async (song: Song) => {
    if (!song.audioUrl) return;
    setDownloadingId(song.id);
    try {
      const response = await fetch(song.audioUrl);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${song.author} - ${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn("Failed to fetch blob for download, falling back to direct link", error);
      const a = document.createElement("a");
      a.href = song.audioUrl;
      a.target = "_blank";
      a.download = `${song.title}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloadingId(null);
    }
  };

  // Editing and Adding mechanisms
  const handleEditClick = (e: React.MouseEvent, song: Song) => {
    e.stopPropagation();
    setEditingSong(song);
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`¿Estás seguro de que deseas eliminar la canción "${title}"?`)) {
      deleteSong(id);
      setCurrentSongIndex(0);
    }
  };

  const handleSaveSong = (values: Record<string, any>) => {
    if (isAdding) {
      const newSong: Song = {
        id: `song-${Date.now()}`,
        title: values.title || "Nueva Canción",
        author: values.author || "Autor Desconocido",
        genre: values.genre || "Música Testimonial",
        duration: values.duration || "3:30",
        audioUrl: values.audioUrl || "",
        description: values.description || "Sin descripción histórica.",
        lyrics: values.lyrics || "Letra no registrada."
      };
      addSong(newSong);
      setIsAdding(false);
    } else if (editingSong) {
      updateSong(editingSong.id, {
        ...editingSong,
        ...values
      } as Song);
      setEditingSong(null);
    }
  };

  const handleAddClick = () => {
    setIsAdding(true);
  };

  return (
    <div className="space-y-12">
      {/* Elemento de audio HTML5 real */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-colonial-dark">
          Cancionero de la Revolución y Patria
        </h2>
        <p className="text-sm sm:text-base text-colonial-dark/70 font-sans leading-relaxed">
          Siente el latido de la historia nicaragüense a través de sus canciones más emblemáticas. Un homenaje sonoro al patriotismo, el heroísmo indómito y la cultura de resistencia campesina.
        </p>
        <div className="w-16 h-1 bg-colonial-terracotta mx-auto rounded" />
      </div>

      {/* Admin control bar inside component */}
      {isEditMode && (
        <div className="max-w-7xl mx-auto flex justify-center sm:justify-end">
          <button
            onClick={handleAddClick}
            className="px-4 py-2 bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white rounded-xl text-xs font-display font-bold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Nueva Canción</span>
          </button>
        </div>
      )}

      {/* Main Music Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Modern Simulated Audio Player (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-colonial-dark text-colonial-beige rounded-3xl border-2 border-colonial-gold/40 shadow-xl overflow-hidden lg:sticky lg:top-28">
          
          {/* Decorative Player Top Vinyl Disc */}
          <div className="relative bg-colonial-dark-light h-56 flex items-center justify-center p-6 border-b border-colonial-gold/10 overflow-hidden">
            {/* Ambient abstract visual overlay */}
            <div className="absolute inset-0 opacity-15">
              <img
                src={resolveImageUrl("/assets/images/revolutionary_music_guitar_1783307397450.jpg")}
                alt="Guitarra Colonial de León"
                className="w-full h-full object-cover filter sepia blur-xs scale-110"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Simulated spinning Vinyl Disc */}
            <div className="relative z-10">
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : {}}
                className="w-36 h-36 rounded-full bg-zinc-950 border-4 border-zinc-800 flex items-center justify-center shadow-2xl relative"
              >
                {/* Vinyl Grooves */}
                <div className="absolute inset-2 rounded-full border border-zinc-800/80" />
                <div className="absolute inset-4 rounded-full border border-zinc-800/50" />
                <div className="absolute inset-8 rounded-full border border-zinc-800/80" />
                <div className="absolute inset-12 rounded-full border border-zinc-800/40" />

                {/* Album Cover Center */}
                <div className="w-12 h-12 rounded-full bg-colonial-terracotta border-2 border-colonial-gold-light flex items-center justify-center overflow-hidden">
                  <Disc className={`w-6 h-6 text-colonial-gold-light ${isPlaying ? "animate-spin" : ""}`} />
                </div>
              </motion.div>
              
              {/* Tone-arm needle overlay */}
              <div className="absolute right-[-15px] top-[-10px] w-12 h-20 origin-top-left transform rotate-[15deg] transition-transform duration-500 hidden sm:block">
                <div className="w-2 h-16 bg-zinc-400 rounded-full shadow-md" />
                <div className="w-4 h-4 bg-zinc-600 rounded-sm mt-[-4px] ml-[-1px]" />
              </div>
            </div>

            {/* Audio Waveform Simulation */}
            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-center space-x-0.5 h-8">
              {Array.from({ length: 32 }).map((_, i) => {
                const heightValue = isPlaying
                  ? Math.sin(i * 0.5 + currentTime) * 15 + 18
                  : 4;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: heightValue }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="w-1 bg-colonial-gold/70 rounded-t-xs"
                    style={{ height: `${heightValue}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Player controls & text metadata */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-colonial-gold-light uppercase bg-colonial-terracotta/40 px-3 py-1 rounded-full border border-colonial-gold/20">
                {currentSong.genre}
              </span>
              <h3 className="font-display font-extrabold text-2xl text-white tracking-wide pt-2">
                {currentSong.title}
              </h3>
              <p className="text-sm font-serif italic text-colonial-sand">
                {currentSong.author}
              </p>
            </div>

            {/* Timeline Progress Slider */}
            <div className="space-y-1">
              <div
                onClick={handleProgressBarClick}
                className="w-full h-2.5 bg-zinc-800/80 rounded-full cursor-pointer overflow-hidden relative group border border-zinc-700/50"
              >
                {/* Filled portion */}
                <div
                  className="h-full bg-linear-to-r from-colonial-terracotta to-colonial-gold rounded-full transition-all duration-300 relative"
                  style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                >
                  {/* Glowing Slider Head */}
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-colonial-terracotta shadow-md hidden group-hover:block" />
                </div>
              </div>
              <div className="flex justify-between text-xs font-mono text-colonial-sand/80">
                <span>{formatTime(currentTime)}</span>
                <span className="flex items-center space-x-1">
                  <Headphones className="w-3.5 h-3.5 text-colonial-clay" />
                  <span>{currentSong.duration}</span>
                </span>
              </div>
            </div>

            {/* Core Action Buttons */}
            <div className="flex items-center justify-center space-x-4">
              {/* Download Active Track Button */}
              <button
                onClick={() => handleDownloadSong(currentSong)}
                disabled={downloadingId === currentSong.id || !currentSong.audioUrl}
                className="p-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-colonial-sand hover:text-white transition-colors cursor-pointer disabled:opacity-30"
                title="Descargar canción actual"
              >
                <Download className={`w-5 h-5 text-colonial-gold-light ${downloadingId === currentSong.id ? "animate-bounce" : ""}`} />
              </button>

              {/* Back Button */}
              <button
                onClick={handlePrevSong}
                className="p-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-colonial-sand hover:text-white transition-colors cursor-pointer"
                title="Canción anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play / Pause Toggle Big Button */}
              <button
                onClick={handlePlayPause}
                disabled={!currentSong.audioUrl}
                className="p-5 rounded-full bg-colonial-terracotta hover:bg-colonial-terracotta-dark text-white shadow-lg shadow-colonial-terracotta/20 border-2 border-colonial-gold-light/40 transform active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                title={isPlaying ? "Pausar" : "Reproducir"}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-white" />
                ) : (
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                )}
              </button>

              {/* Forward Button */}
              <button
                onClick={handleNextSong}
                className="p-3.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-colonial-sand hover:text-white transition-colors cursor-pointer"
                title="Siguiente canción"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume & Additional Indicators */}
            <div className="flex items-center justify-between border-t border-colonial-gold/15 pt-5 text-sm">
              <div className="flex items-center space-x-3 w-1/2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-colonial-sand hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4.5 h-4.5" />
                  ) : (
                    <Volume2 className="w-4.5 h-4.5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value));
                    setIsMuted(false);
                  }}
                  className="w-20 sm:w-24 accent-colonial-terracotta bg-zinc-800 h-1 rounded-lg cursor-pointer"
                />
              </div>

              <div className="text-[11px] font-mono text-colonial-sand/70 flex items-center space-x-1.5 font-bold">
                <span className={`w-2 h-2 rounded-full ${currentSong.audioUrl ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span>{currentSong.audioUrl ? "CON RECURSO LOCAL" : "SIN ARCHIVO MP3"}</span>
              </div>
            </div>

            {/* Description blurb of selected track */}
            <div className="bg-colonial-dark-light/50 border border-colonial-gold/10 p-4 rounded-xl text-xs text-colonial-sand/90 leading-relaxed whitespace-pre-line">
              <span className="font-bold text-colonial-gold-light block mb-1">Contexto Histórico:</span>
              {currentSong.description}
            </div>

          </div>
        </div>

        {/* Right Side: Scrollable Library list & Lyrics expansion (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-display font-bold text-xl text-colonial-dark border-b-2 border-colonial-sand pb-2 flex items-center space-x-2">
            <Music className="w-5 h-5 text-colonial-terracotta" />
            <span>Biblioteca de Canciones Revolucionarias</span>
          </h3>

          <div className="space-y-4">
            {songs.map((song: Song, index: number) => {
              const isActive = index === currentSongIndex;
              const isLyricsExpanded = expandedSongId === song.id;
              
              return (
                <div
                  key={song.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 shadow-xs overflow-hidden ${
                    isActive
                      ? "border-colonial-terracotta ring-1 ring-colonial-terracotta/30 shadow-md"
                      : "border-colonial-sand hover:border-colonial-gold/50 hover:shadow-md"
                  }`}
                >
                  {/* Card Header clickable to select song */}
                  <div className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative">
                    <div
                      onClick={() => handleSelectSong(index)}
                      className="flex items-start space-x-4 flex-1 cursor-pointer"
                    >
                      {/* Play badge circle */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-colors shrink-0 ${
                        isActive
                          ? "bg-colonial-terracotta text-white border-colonial-gold"
                          : "bg-colonial-cream text-colonial-clay border-colonial-sand group-hover:bg-colonial-terracotta"
                      }`}>
                        {isActive && isPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </div>

                      {/* Song Info details */}
                      <div className="pr-16">
                        <h4 className="font-display font-extrabold text-base sm:text-lg text-colonial-dark hover:text-colonial-terracotta transition-colors">
                          {song.title}
                        </h4>
                        <p className="text-xs sm:text-sm font-serif text-colonial-dark/60 mt-0.5">
                          {song.author} • <span className="font-mono text-xs">{song.duration}</span>
                        </p>
                      </div>
                    </div>

                    {/* Admin editing overlay when in edit mode */}
                    {isEditMode && (
                      <div className="absolute top-4 right-4 z-10 flex items-center space-x-1.5 bg-white/95 backdrop-blur p-1 rounded-lg border border-colonial-sand/60 shadow-md">
                        <button
                          onClick={(e) => handleEditClick(e, song)}
                          className="p-1 text-colonial-terracotta hover:bg-colonial-cream rounded"
                          title="Editar detalles de la canción"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <div className="w-px h-3 bg-colonial-sand" />
                        <button
                          onClick={(e) => handleDeleteClick(e, song.id, song.title)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Eliminar de la biblioteca"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Actions button group (Toggle Lyrics / Load / Download) */}
                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-colonial-sand/50">
                      <button
                        onClick={() => toggleLyrics(song.id)}
                        className="px-3 py-1.5 rounded-lg border border-colonial-sand bg-colonial-cream/40 text-colonial-dark/80 hover:bg-colonial-cream text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer"
                        title="Ver letra"
                      >
                        <FileText className="w-3.5 h-3.5 text-colonial-clay" />
                        <span>Letra</span>
                        {isLyricsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDownloadSong(song)}
                        disabled={downloadingId === song.id || !song.audioUrl}
                        className="px-3 py-1.5 rounded-lg border border-colonial-sand bg-white text-colonial-dark/80 hover:bg-colonial-cream text-xs font-mono font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-30"
                        title="Descargar audio"
                      >
                        <Download className={`w-3.5 h-3.5 text-colonial-terracotta ${downloadingId === song.id ? "animate-bounce" : ""}`} />
                        <span>{downloadingId === song.id ? "..." : "Descargar"}</span>
                      </button>

                      <button
                        onClick={() => handleSelectSong(index)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 cursor-pointer ${
                          isActive
                            ? "bg-colonial-terracotta/10 text-colonial-terracotta border border-colonial-terracotta/20"
                            : "bg-colonial-dark text-white hover:bg-colonial-dark-light border border-transparent"
                        }`}
                      >
                        <span>{isActive ? "Escuchando" : "Cargar"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Lyrics Block */}
                  <AnimatePresence>
                    {isLyricsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="bg-colonial-cream/35 border-t border-colonial-sand"
                      >
                        <div className="p-5 sm:p-6 space-y-4">
                          <h5 className="text-xs font-mono font-bold text-colonial-clay uppercase tracking-widest border-b border-colonial-sand/50 pb-1.5 flex items-center space-x-1.5">
                            <FileText className="w-4 h-4" />
                            <span>Letra de la Canción</span>
                          </h5>
                          
                          {/* Structured preformatted text box */}
                          <div className="bg-white/80 rounded-xl p-5 border border-colonial-sand/50 shadow-inner">
                            <pre className="font-serif italic text-sm sm:text-base text-colonial-dark-light leading-relaxed whitespace-pre-wrap font-sans text-center max-w-lg mx-auto">
                              {song.lyrics}
                            </pre>
                          </div>
                          
                          <div className="flex justify-center text-[11px] font-mono text-colonial-dark/50">
                            ❖ Orgullo de la Identidad Revolucionaria Nicaragüense ❖
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Editing Modal */}
      <EditModal
        isOpen={!!editingSong || isAdding}
        onClose={() => {
          setEditingSong(null);
          setIsAdding(false);
        }}
        title={isAdding ? "Agregar Nueva Canción al Cancionero" : `Editar Canción: ${editingSong?.title}`}
        fields={songFields}
        initialValues={
          isAdding
            ? { title: "", author: "", genre: "", duration: "", audioUrl: "", description: "", lyrics: "" }
            : (editingSong || {})
        }
        onSave={handleSaveSong}
      />
    </div>
  );
}
