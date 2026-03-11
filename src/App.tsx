import { useState, useMemo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectCard from "./components/ProjectCard";
import ProjectDetail from "./components/ProjectDetail";
import Footer from "./components/Footer";
import FloatingCallButton from "./components/FloatingCallButton";
import Admin from "./components/Admin";
import PasswordGate from "./components/PasswordGate";
import { api } from "./services/api";
import { Project } from "./types";
import { motion, AnimatePresence } from "motion/react";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProjectGrid({ category }: { category?: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(data);
      } else {
        // Fallback to constants if API returns empty or invalid data
        const { PROJECTS } = await import("./constants");
        setProjects(PROJECTS);
      }
    } catch (error) {
      console.error("Failed to load projects, using fallback", error);
      try {
        const { PROJECTS } = await import("./constants");
        setProjects(PROJECTS);
      } catch (e) {
        console.error("Critical: Fallback also failed", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    if (!category) return projects;
    return projects.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }, [category, projects]);

  return (
    <section className="px-6 pb-24">
      <div className="max-w-[1920px] mx-auto">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={category || "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="behance-grid"
            >
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={setSelectedProject}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <ProjectDetail 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </section>
  );
}

function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <ProjectGrid />
    </main>
  );
}

function CategoryPage() {
  const { categoryName } = useParams();
  return (
    <main className="min-h-screen pt-32">
      <div className="px-6 mb-12">
        <h1 className="text-4xl md:text-6xl font-black">{categoryName}</h1>
      </div>
      <ProjectGrid category={categoryName} />
    </main>
  );
}

function About() {
  return (
    <main className="min-h-screen pt-40 px-6 pb-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-[51px] md:text-[81px] font-black mb-12">About.</h1>
        <div className="space-y-6 text-lg md:text-xl leading-snug text-black/60 font-normal">
          <p>
            "우리는 화려한 껍데기가 아닌, 브랜드가 서 있을 수 있는 단단한 거푸집(<span className="font-bold text-black">formwork</span>)을 만듭니다."
          </p>
          <p>
            디자인은 단순한 장식이 아닙니다. 브랜드가 세상에 존재하기 위한 가장 본질적인 '뼈대'입니다.
          </p>
          <p>
            <span className="text-black font-bold">formwork</span>는 거푸집이라는 뜻처럼, 
            브랜드가 단단하게 굳어지고 성장할 수 있도록 가장 기초가 되는<br />
            디자인 가이드라인과 아이덴티티를 설계합니다.
          </p>
          <p>
            우리는 화려한 트렌드에 휩쓸리기보다, 시간이 흘러도 변하지 않는 정교함과 
            지속 가능한 가치를 추구합니다.
          </p>
        </div>
        
        <div className="mt-32 space-y-20">
          <div>
            <h4 className="text-xs uppercase font-bold mb-8 opacity-40">Process</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { num: "01", en: "Context & Research", ko: "맥락과 리서치" },
                { num: "02", en: "Core Concept Design", ko: "핵심 컨셉 디자인" },
                { num: "03", en: "Visual System Building", ko: "비주얼 시스템 구축" },
                { num: "04", en: "Prototype & Mock-up", ko: "프로토타입 및 목업" },
                { num: "05", en: "Final Delivery", ko: "최종 결과물 전달" }
              ].map((item) => (
                <div key={item.num} className="border border-black/10 p-6 rounded-xl hover:bg-black hover:text-white transition-colors group">
                  <span className="text-xs font-bold opacity-40 group-hover:opacity-100 block mb-4">{item.num}</span>
                  <h5 className="font-bold text-base mb-3">{item.ko}</h5>
                  <p className="text-[10px] font-normal opacity-60 group-hover:opacity-80 uppercase tracking-wider">{item.en}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold mb-8 opacity-40">Principles</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { en: "Essence over Decoration", ko: "장식보다 본질" },
                { en: "Logic-driven Design", ko: "논리 중심 디자인" },
                { en: "Sustainable Identity", ko: "지속 가능한 아이덴티티" }
              ].map((item) => (
                <div key={item.en} className="bg-brand-gray p-8 rounded-2xl border border-black/5">
                  <h5 className="font-bold text-xl mb-4">{item.ko}</h5>
                  <p className="text-sm font-normal opacity-60">{item.en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <PasswordGate>
      <Router>
        <ScrollToTop />
        <div className="relative">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <FloatingCallButton />
        </div>
      </Router>
    </PasswordGate>
  );
}
