import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  biographyData as defaultBiographyData, 
  timelineItems as defaultTimelineItems, 
  encyclopediaArticles as defaultEncyclopediaArticles, 
  galleryItems as defaultGalleryItems, 
  songsData as defaultSongsData,
  TimelineItem,
  Article,
  GalleryItem,
  Song
} from "../data";
import { studentGroupConfig as defaultStudentGroupConfig, StudentMember } from "../config/mediaConfig";

export interface ThanksData {
  danielOrtegaPortrait: string;
  fslnFlagEmblem: string;
  quoteText: string;
  thanksParagraphs: string[];
}

const defaultThanksData: ThanksData = {
  danielOrtegaPortrait: "/assets/images/daniel_ortega_portrait_1783401868995.jpg",
  fslnFlagEmblem: "/assets/images/fsln_flag_emblem_1783401857230.jpg",
  quoteText: "La educación es un derecho sagrado del pueblo, conquistado por la Revolución para abrir las puertas del porvenir, del desarrollo y de la libertad a toda la juventud nicaragüense.",
  thanksParagraphs: [
    "Expresamos nuestro más profundo agradecimiento y reconocimiento revolucionario al Gobierno de Reconciliación y Unidad Nacional, liderado por el Comandante Daniel Ortega y la Compañera Rosario Murillo, por hacer realidad el derecho inalienable a una educación superior totalmente gratuita, inclusiva y con calidez humana.",
    "Como estudiantes de la Escuela Preparatoria de la UNAN-Managua, esta grandiosa plataforma interactiva offline es un testimonio del fruto del presupuesto constitucional del 6%, que garantiza laboratorios, docentes capacitados y recursos tecnológicos de primer nivel para los hijos de los obreros y campesinos.",
    "Inspirados en la valentía indómita del Cacique Diriangén y la mística de nuestros héroes y mártires, reafirmamos nuestro compromiso de honrar la patria a través de la excelencia académica, la innovación tecnológica y el servicio solidario al pueblo."
  ]
};

interface AppDataContextProps {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  
  // Data States
  biography: typeof defaultBiographyData;
  setBiography: (val: typeof defaultBiographyData) => void;
  
  timeline: TimelineItem[];
  setTimeline: (val: TimelineItem[]) => void;
  updateTimelineItem: (index: number, val: TimelineItem) => void;
  addTimelineItem: (val: TimelineItem) => void;
  deleteTimelineItem: (index: number) => void;
  
  articles: Article[];
  setArticles: (val: Article[]) => void;
  updateArticle: (id: string, val: Article) => void;
  addArticle: (val: Article) => void;
  deleteArticle: (id: string) => void;
  
  gallery: GalleryItem[];
  setGallery: (val: GalleryItem[]) => void;
  updateGalleryItem: (id: string, val: GalleryItem) => void;
  addGalleryItem: (val: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  
  songs: Song[];
  setSongs: (val: Song[]) => void;
  updateSong: (id: string, val: Song) => void;
  addSong: (val: Song) => void;
  deleteSong: (id: string) => void;
  
  students: StudentMember[];
  setStudents: (val: StudentMember[]) => void;
  updateStudent: (id: string | number, val: StudentMember) => void;
  addStudent: (val: StudentMember) => void;
  deleteStudent: (id: string | number) => void;
  
  thanks: ThanksData;
  setThanks: (val: ThanksData) => void;
  
  resetAllData: () => void;
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Load initial state with local storage fallback
  const [biography, setBiographyState] = useState<typeof defaultBiographyData>(() => {
    const local = localStorage.getItem("diriangen_biographyData");
    return local ? JSON.parse(local) : defaultBiographyData;
  });

  const [timeline, setTimelineState] = useState<TimelineItem[]>(() => {
    const local = localStorage.getItem("diriangen_timelineItems");
    return local ? JSON.parse(local) : defaultTimelineItems;
  });

  const [articles, setArticlesState] = useState<Article[]>(() => {
    const local = localStorage.getItem("diriangen_encyclopediaArticles");
    return local ? JSON.parse(local) : defaultEncyclopediaArticles;
  });

  const [gallery, setGalleryState] = useState<GalleryItem[]>(() => {
    const local = localStorage.getItem("diriangen_galleryItems");
    return local ? JSON.parse(local) : defaultGalleryItems;
  });

  const [songs, setSongsState] = useState<Song[]>(() => {
    const local = localStorage.getItem("diriangen_songsData");
    return local ? JSON.parse(local) : defaultSongsData;
  });

  const [students, setStudentsState] = useState<StudentMember[]>(() => {
    const local = localStorage.getItem("diriangen_studentGroupConfig");
    return local ? JSON.parse(local) : defaultStudentGroupConfig;
  });

  const [thanks, setThanksState] = useState<ThanksData>(() => {
    const local = localStorage.getItem("diriangen_thanksData");
    return local ? JSON.parse(local) : defaultThanksData;
  });

  // Persist edits to localStorage automatically on state changes
  useEffect(() => {
    localStorage.setItem("diriangen_biographyData", JSON.stringify(biography));
  }, [biography]);

  useEffect(() => {
    localStorage.setItem("diriangen_timelineItems", JSON.stringify(timeline));
  }, [timeline]);

  useEffect(() => {
    localStorage.setItem("diriangen_encyclopediaArticles", JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem("diriangen_galleryItems", JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem("diriangen_songsData", JSON.stringify(songs));
  }, [songs]);

  useEffect(() => {
    localStorage.setItem("diriangen_studentGroupConfig", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem("diriangen_thanksData", JSON.stringify(thanks));
  }, [thanks]);

  // Sync changes to the server filesystem (API) so they are committed on GitHub sync
  useEffect(() => {
    if (!biography || timeline.length === 0) return;

    const saveDataToServer = async () => {
      try {
        const response = await fetch("/api/save-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            biography,
            timeline,
            articles,
            gallery,
            songs,
          }),
        });
        if (response.ok) {
          console.log("Cambios guardados exitosamente en el servidor (src/data.ts). Listo para sincronizar con GitHub.");
        }
      } catch (error) {
        console.warn("No se pudo guardar la información en el disco del servidor.", error);
      }
    };

    const timer = setTimeout(saveDataToServer, 1000);
    return () => clearTimeout(timer);
  }, [biography, timeline, articles, gallery, songs]);

  useEffect(() => {
    if (students.length === 0) return;

    const saveMediaToServer = async () => {
      try {
        const response = await fetch("/api/save-media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ students }),
        });
        if (response.ok) {
          console.log("Cambios de estudiantes guardados exitosamente en el servidor (src/config/mediaConfig.ts). Listo para sincronizar con GitHub.");
        }
      } catch (error) {
        console.warn("No se pudo guardar la información de estudiantes en el disco del servidor.", error);
      }
    };

    const timer = setTimeout(saveMediaToServer, 1000);
    return () => clearTimeout(timer);
  }, [students]);

  const setBiography = (val: typeof defaultBiographyData) => setBiographyState(val);
  const setTimeline = (val: TimelineItem[]) => setTimelineState(val);
  const setArticles = (val: Article[]) => setArticlesState(val);
  const setGallery = (val: GalleryItem[]) => setGalleryState(val);
  const setSongs = (val: Song[]) => setSongsState(val);
  const setStudents = (val: StudentMember[]) => setStudentsState(val);
  const setThanks = (val: ThanksData) => setThanksState(val);

  // Individual update utilities
  const updateTimelineItem = (index: number, val: TimelineItem) => {
    const updated = [...timeline];
    updated[index] = val;
    setTimelineState(updated);
  };
  const addTimelineItem = (val: TimelineItem) => {
    setTimelineState([...timeline, val]);
  };
  const deleteTimelineItem = (index: number) => {
    setTimelineState(timeline.filter((_, i) => i !== index));
  };

  const updateArticle = (id: string, val: Article) => {
    setArticlesState(articles.map(art => art.id === id ? val : art));
  };
  const addArticle = (val: Article) => {
    setArticlesState([...articles, val]);
  };
  const deleteArticle = (id: string) => {
    setArticlesState(articles.filter(art => art.id !== id));
  };

  const updateGalleryItem = (id: string, val: GalleryItem) => {
    setGalleryState(gallery.map(item => item.id === id ? val : item));
  };
  const addGalleryItem = (val: GalleryItem) => {
    setGalleryState([...gallery, val]);
  };
  const deleteGalleryItem = (id: string) => {
    setGalleryState(gallery.filter(item => item.id !== id));
  };

  const updateSong = (id: string, val: Song) => {
    setSongsState(songs.map(song => song.id === id ? val : song));
  };
  const addSong = (val: Song) => {
    setSongsState([...songs, val]);
  };
  const deleteSong = (id: string) => {
    setSongsState(songs.filter(song => song.id !== id));
  };

  const updateStudent = (id: string | number, val: StudentMember) => {
    setStudentsState(students.map(std => std.id === id ? val : std));
  };
  const addStudent = (val: StudentMember) => {
    setStudentsState([...students, val]);
  };
  const deleteStudent = (id: string | number) => {
    setStudentsState(students.filter(std => std.id !== id));
  };

  const resetAllData = () => {
    if (window.confirm("¿Estás seguro de que deseas restaurar todos los textos, imágenes y canciones a sus valores por defecto? Se perderán las modificaciones locales.")) {
      localStorage.removeItem("diriangen_biographyData");
      localStorage.removeItem("diriangen_timelineItems");
      localStorage.removeItem("diriangen_encyclopediaArticles");
      localStorage.removeItem("diriangen_galleryItems");
      localStorage.removeItem("diriangen_songsData");
      localStorage.removeItem("diriangen_studentGroupConfig");
      localStorage.removeItem("diriangen_thanksData");
      
      setBiographyState(defaultBiographyData);
      setTimelineState(defaultTimelineItems);
      setArticlesState(defaultEncyclopediaArticles);
      setGalleryState(defaultGalleryItems);
      setSongsState(defaultSongsData);
      setStudentsState(defaultStudentGroupConfig);
      setThanksState(defaultThanksData);
    }
  };

  return (
    <AppDataContext.Provider value={{
      isEditMode,
      setIsEditMode,
      biography,
      setBiography,
      timeline,
      setTimeline,
      updateTimelineItem,
      addTimelineItem,
      deleteTimelineItem,
      articles,
      setArticles,
      updateArticle,
      addArticle,
      deleteArticle,
      gallery,
      setGallery,
      updateGalleryItem,
      addGalleryItem,
      deleteGalleryItem,
      songs,
      setSongs,
      updateSong,
      addSong,
      deleteSong,
      students,
      setStudents,
      updateStudent,
      addStudent,
      deleteStudent,
      thanks,
      setThanks,
      resetAllData
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error("useAppData debe usarse dentro de un AppDataProvider");
  }
  return context;
};
