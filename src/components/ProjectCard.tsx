import { Project } from "../types";
import { motion } from "motion/react";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  key?: string;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative aspect-[4/3] overflow-hidden bg-brand-gray cursor-pointer"
      onClick={() => onClick(project)}
    >
      <img
        src={project.thumbnail}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="hover-reveal">
        <span className="text-xs font-bold mb-2 opacity-70">
          {project.category}
        </span>
        <h3 className="text-3xl font-black leading-none">
          {project.title}
        </h3>
      </div>
    </motion.div>
  );
}
