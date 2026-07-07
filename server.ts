import express from "express";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Body parsers
  app.use(express.json({ limit: "50mb" }));

  // Ensure dynamic uploads folder exists for physical persistence
  const fs = await import("fs/promises");
  try {
    await fs.mkdir(path.join(process.cwd(), "public/uploads"), { recursive: true });
  } catch (err) {
    console.warn("Could not create public/uploads directory:", err);
  }

  // Serve static uploaded images across the local network
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

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
      const fs = await import("fs/promises");

      // Case 1: Image Upload / Base64 processing
      if (req.body.image) {
        const { image, filename } = req.body;

        // If it's already a clean relative URL on the server, return as is
        if (typeof image === "string" && image.startsWith("/uploads/")) {
          return res.json({ success: true, url: image });
        }

        // If it is a base64 data URL, decode and save physically
        if (typeof image === "string" && image.startsWith("data:")) {
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (!matches || matches.length !== 3) {
            return res.status(400).json({ success: false, error: "Formato base64 de imagen inválido" });
          }

          const mimeType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");

          // Determine extension
          let ext = "png";
          if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
          else if (mimeType.includes("webp")) ext = "webp";
          else if (mimeType.includes("gif")) ext = "gif";
          else if (mimeType.includes("svg")) ext = "svg";

          // Generate a clean filename with timestamp
          const cleanBaseName = filename 
            ? filename.replace(/[^a-z0-9]/gi, '_').toLowerCase() 
            : "upload";
          const finalFilename = `${cleanBaseName}_${Date.now()}.${ext}`;

          const uploadPath = path.join(process.cwd(), "public/uploads", finalFilename);
          await fs.writeFile(uploadPath, buffer);

          const publicUrl = `/uploads/${finalFilename}`;
          console.log(`Imagen guardada físicamente en: ${uploadPath} -> URL: ${publicUrl}`);
          return res.json({ success: true, url: publicUrl });
        }

        // If it's just some other string (like an external URL or existing assets image), return as is
        return res.json({ success: true, url: image });
      }

      // Case 2: Save students configuration (original behavior)
      const { students } = req.body;
      if (students) {
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
        return res.json({ success: true, message: "Datos de estudiantes guardados en src/config/mediaConfig.ts" });
      }

      return res.status(400).json({ success: false, error: "Cuerpo de solicitud inválido" });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Auto-detect production mode based on env or filename
  const isProduction = process.env.NODE_ENV === "production" || 
                       (typeof process.argv[1] === "string" && !process.argv[1].endsWith("server.ts"));

  // Vite middleware for development
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
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

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running in ${isProduction ? "production" : "development"} mode on port ${PORT}`);
  });
}

startServer();
