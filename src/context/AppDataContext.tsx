import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  updateTimelineItem: (year: string, val: TimelineItem) => void;
  addTimelineItem: (val: TimelineItem) => void;
  deleteTimelineItem: (year: string) => void;
  
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

  // Track if a state change was caused by user action to prevent auto-overwriting files with stale localStorage
  const isUserEditDataRef = useRef<boolean>(false);
  const isUserEditMediaRef = useRef<boolean>(false);

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

  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load latest data from the server API immediately upon mount (syncs other devices on load)
  useEffect(() => {
    const fetchServerData = async () => {
      try {
        const response = await fetch("/api/get-data");
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            const { biography: sBio, timeline: sTime, articles: sArt, gallery: sGal, songs: sSong, students: sStud, thanks: sThanks } = res.data;
            if (sBio) setBiographyState(sBio);
            if (sTime) setTimelineState(sTime);
            if (sArt) setArticlesState(sArt);
            if (sGal) setGalleryState(sGal);
            if (sSong) setSongsState(sSong);
            if (sStud) setStudentsState(sStud);
            if (sThanks) setThanksState(sThanks);
            console.log("Datos cargados del servidor y sincronizados.");
          }
        }
      } catch (error) {
        console.warn("No se pudieron inicializar los datos del servidor:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    fetchServerData();
  }, []);

  // Persist edits to localStorage automatically on state changes
  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_biographyData", JSON.stringify(biography));
  }, [biography, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_timelineItems", JSON.stringify(timeline));
  }, [timeline, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_encyclopediaArticles", JSON.stringify(articles));
  }, [articles, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_galleryItems", JSON.stringify(gallery));
  }, [gallery, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_songsData", JSON.stringify(songs));
  }, [songs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_studentGroupConfig", JSON.stringify(students));
  }, [students, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem("diriangen_thanksData", JSON.stringify(thanks));
  }, [thanks, isInitialized]);

  // Sync changes to the server filesystem (API) so they are committed on GitHub sync
  useEffect(() => {
    if (!isInitialized) return;
    if (!isUserEditDataRef.current) return; // ONLY save if triggered by a user edit!
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
          isUserEditDataRef.current = false; // reset flag on successful save
          console.log("Cambios guardados exitosamente en el servidor (src/data.ts). Listo para sincronizar con GitHub.");
        }
      } catch (error) {
        console.warn("No se pudo guardar la información en el disco del servidor.", error);
      }
    };

    const timer = setTimeout(saveDataToServer, 1000);
    return () => clearTimeout(timer);
  }, [biography, timeline, articles, gallery, songs, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!isUserEditMediaRef.current) return; // ONLY save if triggered by a user edit!
    if (students.length === 0 && !thanks) return;

    const saveMediaToServer = async () => {
      try {
        const response = await fetch("/api/save-media", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ students, thanks }),
        });
        if (response.ok) {
          isUserEditMediaRef.current = false; // reset flag on successful save
          console.log("Cambios de estudiantes y agradecimientos guardados exitosamente en el servidor (src/config/mediaConfig.ts). Listo para sincronizar con GitHub.");
        }
      } catch (error) {
        console.warn("No se pudo guardar la información de estudiantes e institucional en el disco del servidor.", error);
      }
    };

    const timer = setTimeout(saveMediaToServer, 1000);
    return () => clearTimeout(timer);
  }, [students, thanks, isInitialized]);

  const setBiography = (val: typeof defaultBiographyData) => {
    isUserEditDataRef.current = true;
    setBiographyState(val);
  };
  const setTimeline = (val: TimelineItem[]) => {
    isUserEditDataRef.current = true;
    setTimelineState(val);
  };
  const setArticles = (val: Article[]) => {
    isUserEditDataRef.current = true;
    setArticlesState(val);
  };
  const setGallery = (val: GalleryItem[]) => {
    isUserEditDataRef.current = true;
    setGalleryState(val);
  };
  const setSongs = (val: Song[]) => {
    isUserEditDataRef.current = true;
    setSongsState(val);
  };
  const setStudents = (val: StudentMember[]) => {
    isUserEditMediaRef.current = true;
    setStudentsState(val);
  };
  const setThanks = (val: ThanksData) => {
    isUserEditMediaRef.current = true;
    setThanksState(val);
  };

  // Individual update utilities
  const updateTimelineItem = (year: string, val: TimelineItem) => {
    isUserEditDataRef.current = true;
    setTimelineState(timeline.map(item => item.year === year ? val : item));
  };
  const addTimelineItem = (val: TimelineItem) => {
    isUserEditDataRef.current = true;
    setTimelineState([...timeline, val]);
  };
  const deleteTimelineItem = (year: string) => {
    isUserEditDataRef.current = true;
    setTimelineState(timeline.filter(item => item.year !== year));
  };

  const updateArticle = (id: string, val: Article) => {
    isUserEditDataRef.current = true;
    setArticlesState(articles.map(art => art.id === id ? val : art));
  };
  const addArticle = (val: Article) => {
    isUserEditDataRef.current = true;
    setArticlesState([...articles, val]);
  };
  const deleteArticle = (id: string) => {
    isUserEditDataRef.current = true;
    setArticlesState(articles.filter(art => art.id !== id));
  };

  const updateGalleryItem = (id: string, val: GalleryItem) => {
    isUserEditDataRef.current = true;
    setGalleryState(gallery.map(item => item.id === id ? val : item));
  };
  const addGalleryItem = (val: GalleryItem) => {
    isUserEditDataRef.current = true;
    setGalleryState([...gallery, val]);
  };
  const deleteGalleryItem = (id: string) => {
    isUserEditDataRef.current = true;
    setGalleryState(gallery.filter(item => item.id !== id));
  };

  const updateSong = (id: string, val: Song) => {
    isUserEditDataRef.current = true;
    setSongsState(songs.map(song => song.id === id ? val : song));
  };
  const addSong = (val: Song) => {
    isUserEditDataRef.current = true;
    setSongsState([...songs, val]);
  };
  const deleteSong = (id: string) => {
    isUserEditDataRef.current = true;
    setSongsState(songs.filter(song => song.id !== id));
  };

  const updateStudent = (id: string | number, val: StudentMember) => {
    isUserEditMediaRef.current = true;
    setStudentsState(students.map(std => std.id === id ? val : std));
  };
  const addStudent = (val: StudentMember) => {
    isUserEditMediaRef.current = true;
    setStudentsState([...students, val]);
  };
  const deleteStudent = (id: string | number) => {
    isUserEditMediaRef.current = true;
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
