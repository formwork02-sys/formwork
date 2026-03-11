import { Project } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

interface ProjectDetailProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="fixed top-8 right-8 z-[110] p-2 bg-black text-white rounded-full hover:scale-110 transition-transform"
        >
          <X size={24} />
        </button>

        <div className="max-w-5xl mx-auto px-6 py-24">
          <header className="mb-20">
            <span className="text-sm font-bold text-black/40 mb-4 block">
              {project.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-12 leading-none">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-black/60 max-w-3xl">
              {project.description}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24 border-y border-black/10 py-12">
            <div>
              <h4 className="text-xs uppercase font-bold mb-4 opacity-40">Client</h4>
              <p className="font-bold">{project.client}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold mb-4 opacity-40">Needs</h4>
              <p className="text-sm leading-relaxed">{project.needs}</p>
            </div>
            <div>
              <h4 className="text-xs uppercase font-bold mb-4 opacity-40">Solution</h4>
              <p className="text-sm leading-relaxed">{project.solution}</p>
            </div>
          </div>

          <div className="space-y-12 mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xs uppercase font-bold mb-6 opacity-40">Visual System</h4>
                <div className="flex gap-4 mb-8">
                  {project.colorPalette.map((color) => (
                    <div key={color} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-12 h-12 rounded-full border border-black/5" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[10px] font-mono uppercase">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase font-bold mb-6 opacity-40">Typography</h4>
                <div className="space-y-2">
                  {project.typography.map((typo) => (
                    <p key={typo} className="text-xl font-bold">{typo}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xs uppercase font-bold opacity-40">Mock-ups & Results</h4>
            {project.images.map((img, idx) => (
              <motion.img
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src={img}
                alt={`${project.title} view ${idx + 1}`}
                className="w-full aspect-video object-cover bg-brand-gray"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>

          <footer className="mt-24 pt-12 border-t border-black/10 text-center">
            <button 
              onClick={onClose}
              className="text-sm uppercase font-black hover:underline"
            >
              Back to Projects
            </button>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
