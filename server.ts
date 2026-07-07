import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsers
  app.use(express.json({ limit: "50mb" }));

  // API routes FIRST
  app.post("/api/save-data", async (req, res) => {
    try {
      const { biography, timeline, articles, gallery, songs } = req.body;
      const fs = await import("fs/promises");
      
      const fileContent = `// ARCHIVO AUTO-GENERADO POR EL MODO EDICIÓN DE NICARAGUA INDÓMITA
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

      await fs.writeFile(path.join(process.cwd(), "src/data.ts"), fileContent, "utf-8");
      res.json({ success: true, message: "Datos guardados físicamente en src/data.ts" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/save-media", async (req, res) => {
    try {
      const { students } = req.body;
      const fs = await import("fs/promises");
      
      const fileContent = `// ARCHIVO AUTO-GENERADO POR EL MODO EDICIÓN DE NICARAGUA INDÓMITA
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
`;

      await fs.writeFile(path.join(process.cwd(), "src/config/mediaConfig.ts"), fileContent, "utf-8");
      res.json({ success: true, message: "Datos de estudiantes guardados en src/config/mediaConfig.ts" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
