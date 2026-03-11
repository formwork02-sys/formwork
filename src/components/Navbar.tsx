import { useState } from "react";
import { CATEGORIES } from "../constants";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation } from "react-router-dom";
import { X, Menu } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-black tracking-tighter" onClick={closeMenu}>
          formwork
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          {CATEGORIES.map((cat) => {
            const path = `/category/${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                to={path}
                className={`text-xs font-bold transition-colors hover:text-black ${
                  currentPath === path ? "text-black" : "text-black/40"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="hidden lg:block text-xs uppercase font-bold">
            About
          </Link>
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-black/5 p-6 flex flex-col gap-6"
          >
            {CATEGORIES.map((cat) => {
              const path = `/category/${encodeURIComponent(cat)}`;
              return (
                <Link
                  key={cat}
                  to={path}
                  onClick={closeMenu}
                  className={`text-sm font-bold ${
                    currentPath === path ? "text-black" : "text-black/40"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
            <Link 
              to="/about" 
              onClick={closeMenu}
              className="text-sm uppercase font-bold border-t border-black/5 pt-6"
            >
              About
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
