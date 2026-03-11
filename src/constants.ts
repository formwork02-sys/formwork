import { Project, Category } from "./types";

export const CATEGORIES: Category[] = [
  "Logo Design",
  "Illustration",
  "CX Design",
  "Print Design",
  "Ad Design",
  "Package Design",
  "Business Card"
];

export const PROJECTS: Project[] = [
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
