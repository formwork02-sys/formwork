import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("portfolio.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT,
    category TEXT,
    thumbnail TEXT,
    description TEXT,
    client TEXT,
    needs TEXT,
    solution TEXT,
    colorPalette TEXT,
    typography TEXT,
    images TEXT
  )
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (count.count === 0) {
  const initialProjects = [
    {
      id: "1",
      title: "EcoSphere Identity",
      category: "Logo Design",
      thumbnail: "https://picsum.photos/seed/logo1/1200/800",
      description: "Sustainable tech brand identity focusing on circular economy.",
      client: "EcoSphere Systems",
      needs: "A modern, trust-inspiring logo that conveys sustainability without using clichéd green leaves.",
      solution: "Developed a geometric 'E' symbol that doubles as an infinity loop, representing the circular nature of their business.",
      colorPalette: ["#000000", "#FFFFFF", "#2D5A27"],
      typography: ["Montserrat Bold", "Inter Regular"],
      images: [
        "https://picsum.photos/seed/logo1-1/1200/800",
        "https://picsum.photos/seed/logo1-2/1200/800",
        "https://picsum.photos/seed/logo1-3/1200/800"
      ]
    },
    {
      id: "2",
      title: "Urban Flora Series",
      category: "Illustration",
      thumbnail: "https://picsum.photos/seed/illu1/1200/800",
      description: "A series of digital illustrations for a boutique hotel chain.",
      client: "The Grand Urban",
      needs: "Unique graphic motifs to be used across room wallpaper and digital touchpoints.",
      solution: "Created a series of minimalist botanical illustrations using high-contrast black and white lines.",
      colorPalette: ["#000000", "#FFFFFF"],
      typography: ["Playfair Display"],
      images: [
        "https://picsum.photos/seed/illu1-1/1200/800",
        "https://picsum.photos/seed/illu1-2/1200/800"
      ]
    },
    {
      id: "3",
      title: "Zenith App Interface",
      category: "CX Design",
      thumbnail: "https://picsum.photos/seed/cx1/1200/800",
      description: "Next-gen productivity app focusing on deep work.",
      client: "Zenith Labs",
      needs: "An interface that reduces cognitive load and promotes focus.",
      solution: "A minimalist UI with plenty of white space and subtle micro-interactions to guide the user.",
      colorPalette: ["#F2F2F2", "#000000", "#FFFFFF"],
      typography: ["Montserrat", "Pretendard"],
      images: [
        "https://picsum.photos/seed/cx1-1/1200/800",
        "https://picsum.photos/seed/cx1-2/1200/800"
      ]
    },
    {
      id: "4",
      title: "Annual Report 2025",
      category: "Print Design",
      thumbnail: "https://picsum.photos/seed/print1/1200/800",
      description: "Comprehensive annual report design for a global logistics firm.",
      client: "LogiCorp Global",
      needs: "Transforming complex data into a readable and visually engaging document.",
      solution: "Used a strict grid system and bold typography to create a clear hierarchy of information.",
      colorPalette: ["#000000", "#FFFFFF", "#E5E5E5"],
      typography: ["Montserrat Bold", "Noto Sans KR"],
      images: [
        "https://picsum.photos/seed/print1-1/1200/800",
        "https://picsum.photos/seed/print1-2/1200/800"
      ]
    },
    {
      id: "5",
      title: "Summer Campaign 2025",
      category: "Ad Design",
      thumbnail: "https://picsum.photos/seed/ad1/1200/800",
      description: "Social media and OOH campaign for a luxury fashion brand.",
      client: "Aura Couture",
      needs: "High-impact visuals that stand out in a crowded digital landscape.",
      solution: "Cinematic photography paired with oversized, minimalist typography.",
      colorPalette: ["#000000", "#FFFFFF"],
      typography: ["Montserrat Black"],
      images: [
        "https://picsum.photos/seed/ad1-1/1200/800",
        "https://picsum.photos/seed/ad1-2/1200/800"
      ]
    },
    {
      id: "6",
      title: "Pure Essence Skincare",
      category: "Package Design",
      thumbnail: "https://picsum.photos/seed/pack1/1200/800",
      description: "Minimalist packaging for an organic skincare line.",
      client: "Pure Essence",
      needs: "Packaging that reflects the purity and simplicity of the ingredients.",
      solution: "Matte white containers with clean black typography and a unique structural fold.",
      colorPalette: ["#FFFFFF", "#000000"],
      typography: ["Montserrat Light"],
      images: [
        "https://picsum.photos/seed/pack1-1/1200/800",
        "https://picsum.photos/seed/pack1-2/1200/800"
      ]
    },
    {
      id: "7",
      title: "Formwork Stationery",
      category: "Business Card",
      thumbnail: "https://picsum.photos/seed/card1/1200/800",
      description: "Personal branding and stationery for formwork.",
      client: "Self",
      needs: "A business card that feels like a piece of architecture.",
      solution: "Heavyweight 600gsm cotton paper with letterpress printing and a custom grid pattern.",
      colorPalette: ["#000000", "#FFFFFF"],
      typography: ["Montserrat Bold"],
      images: [
        "https://picsum.photos/seed/card1-1/1200/800",
        "https://picsum.photos/seed/card1-2/1200/800"
      ]
    }
  ];

  const insert = db.prepare(`
    INSERT INTO projects (id, title, category, thumbnail, description, client, needs, solution, colorPalette, typography, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of initialProjects) {
    insert.run(
      p.id, p.title, p.category, p.thumbnail, p.description, p.client, p.needs, p.solution,
      JSON.stringify(p.colorPalette), JSON.stringify(p.typography), JSON.stringify(p.images)
    );
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Routes
  app.post("/api/verify-password", (req, res) => {
    const { password } = req.body;
    const sitePassword = (process.env.SITE_PASSWORD || "180919").trim();
    if (password && password.trim() === sitePassword) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Incorrect password" });
    }
  });

  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects.map(p => ({
      ...p,
      colorPalette: JSON.parse(p.colorPalette as string),
      typography: JSON.parse(p.typography as string),
      images: JSON.parse(p.images as string)
    })));
  });

  app.post("/api/projects", (req, res) => {
    const { id, title, category, thumbnail, description, client, needs, solution, colorPalette, typography, images } = req.body;
    const stmt = db.prepare(`
      INSERT INTO projects (id, title, category, thumbnail, description, client, needs, solution, colorPalette, typography, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, title, category, thumbnail, description, client, needs, solution, JSON.stringify(colorPalette), JSON.stringify(typography), JSON.stringify(images));
    res.status(201).json({ message: "Project created" });
  });

  app.put("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    const { title, category, thumbnail, description, client, needs, solution, colorPalette, typography, images } = req.body;
    const stmt = db.prepare(`
      UPDATE projects SET 
        title = ?, category = ?, thumbnail = ?, description = ?, client = ?, 
        needs = ?, solution = ?, colorPalette = ?, typography = ?, images = ?
      WHERE id = ?
    `);
    stmt.run(title, category, thumbnail, description, client, needs, solution, JSON.stringify(colorPalette), JSON.stringify(typography), JSON.stringify(images), id);
    res.json({ message: "Project updated" });
  });

  app.delete("/api/projects/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    res.json({ message: "Project deleted" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
