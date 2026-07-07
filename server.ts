import express from "express";
import path from "path";
import crypto from "crypto";

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

  // Helper function to recursively find and sanitise base64 images and paths in any object
  async function sanitiseDataAndSaveImages(obj: any): Promise<any> {
    if (obj === null || obj === undefined) return obj;

    if (typeof obj === "string") {
      // 1. Check if it's base64 image
      if (obj.startsWith("data:image/")) {
        try {
          const matches = obj.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const mimeType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, "base64");

            let ext = "png";
            if (mimeType.includes("jpeg") || mimeType.includes("jpg")) ext = "jpg";
            else if (mimeType.includes("webp")) ext = "webp";
            else if (mimeType.includes("gif")) ext = "gif";
            else if (mimeType.includes("svg")) ext = "svg";

            const rand = crypto.randomBytes(4).toString("hex");
            const finalFilename = `auto_${Date.now()}_${rand}.${ext}`;
            const uploadPath = path.join(process.cwd(), "public/uploads", finalFilename);
            
            await fs.writeFile(uploadPath, buffer);
            const publicUrl = `/uploads/${finalFilename}`;
            console.log(`[Auto-Sanitiser] Saved base64 image to: ${publicUrl}`);
            return publicUrl;
          }
        } catch (err) {
          console.error("Failed to auto-save base64 image during sanitisation:", err);
        }
      }

      // 2. Check if it contains src/assets/ and replace with /assets/
      if (obj.includes("/src/assets/")) {
        return obj.replace("/src/assets/", "/assets/");
      }
      if (obj.includes("src/assets/")) {
        return obj.replace("src/assets/", "/assets/");
      }

      return obj;
    }

    if (Array.isArray(obj)) {
      const newArr = [];
      for (const item of obj) {
        newArr.push(await sanitiseDataAndSaveImages(item));
      }
      return newArr;
    }

    if (typeof obj === "object") {
      const newObj: any = {};
      for (const key of Object.keys(obj)) {
        newObj[key] = await sanitiseDataAndSaveImages(obj[key]);
      }
      return newObj;
    }

    return obj;
  }

  // Helper to extract JSON representation from a TS config file string
  function extractJsonFromTs(fileContent: string, variableName: string): any {
    const regex = new RegExp(`export\\s+const\\s+${variableName}(?:\\s*:\\s*[^=]+)?\\s*=\\s*([\\s\\S]*?);?\\s*(?:export|$)`);
    const match = fileContent.match(regex);
    if (match && match[1]) {
      try {
        let jsonStr = match[1].trim();
        if (jsonStr.endsWith(";")) {
          jsonStr = jsonStr.slice(0, -1);
        }
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error(`Error parsing variable ${variableName} from TS:`, e);
      }
    }
    return null;
  }

  // API routes FIRST
  app.post("/api/save-data", async (req, res) => {
    try {
      const { biography, timeline, articles, gallery, songs } = req.body;
      const fs = await import("fs/promises");

      const biographyClean = await sanitiseDataAndSaveImages(biography);
      const timelineClean = await sanitiseDataAndSaveImages(timeline);
      const articlesClean = await sanitiseDataAndSaveImages(articles);
      const galleryClean = await sanitiseDataAndSaveImages(gallery);
      const songsClean = await sanitiseDataAndSaveImages(songs);
      
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

export const biographyData = ${JSON.stringify(biographyClean, null, 2)};

export const timelineItems: TimelineItem[] = ${JSON.stringify(timelineClean, null, 2)};

export const encyclopediaArticles: Article[] = ${JSON.stringify(articlesClean, null, 2)};

export const galleryItems: GalleryItem[] = ${JSON.stringify(galleryClean, null, 2)};

export const songsData: Song[] = ${JSON.stringify(songsClean, null, 2)};
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
        const studentsClean = await sanitiseDataAndSaveImages(students);
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

export const studentGroupConfig: StudentMember[] = ${JSON.stringify(studentsClean, null, 2)};
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

  // Dynamic data loading API endpoint for other devices / initial load
  app.get("/api/get-data", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      
      let biography = null;
      let timeline = null;
      let articles = null;
      let gallery = null;
      let songs = null;
      
      try {
        const dataTsContent = await fs.readFile(path.join(process.cwd(), "src/data.ts"), "utf-8");
        biography = extractJsonFromTs(dataTsContent, "biographyData");
        timeline = extractJsonFromTs(dataTsContent, "timelineItems");
        articles = extractJsonFromTs(dataTsContent, "encyclopediaArticles");
        gallery = extractJsonFromTs(dataTsContent, "galleryItems");
        songs = extractJsonFromTs(dataTsContent, "songsData");
      } catch (err) {
        console.warn("Could not read src/data.ts, will use defaults:", err);
      }

      let students = null;
      try {
        const mediaConfigContent = await fs.readFile(path.join(process.cwd(), "src/config/mediaConfig.ts"), "utf-8");
        students = extractJsonFromTs(mediaConfigContent, "studentGroupConfig");
      } catch (err) {
        console.warn("Could not read src/config/mediaConfig.ts, will use defaults:", err);
      }

      res.json({
        success: true,
        data: {
          biography,
          timeline,
          articles,
          gallery,
          songs,
          students,
        }
      });
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
