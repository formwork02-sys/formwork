import React, { useState, useEffect, FormEvent } from "react";
import { Project, Category } from "../types";
import { api } from "../services/api";
import { CATEGORIES as INITIAL_CATEGORIES } from "../constants";
import { Plus, Edit2, Trash2, X, Save, Lock, Folder, LayoutGrid, ChevronRight } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Admin component mounted");
    try {
      const adminAuth = sessionStorage.getItem("admin_auth");
      if (adminAuth === "true") {
        console.log("Admin authenticated from session");
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to access session storage", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Admin authenticated, loading projects...");
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      console.log("Projects loaded:", data);
      if (Array.isArray(data)) {
        setProjects(data);
        
        // Extract unique categories from projects if they are not in INITIAL_CATEGORIES
        const projectCategories = Array.from(new Set(data.map(p => p.category)));
        const allCategories = Array.from(new Set([...INITIAL_CATEGORIES, ...projectCategories]));
        setCategories(allCategories as Category[]);
      } else {
        console.error("API returned non-array data:", data);
        setProjects([]);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
      setProjects([]);
    }
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === "1111") {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem("admin_auth", "true");
      } catch (error) {
        console.error("Failed to set session storage", error);
      }
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem("admin_auth");
    } catch (error) {
      console.error("Failed to remove session storage", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await api.deleteProject(id);
        loadProjects();
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete project.");
      }
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      if (isAdding) {
        await api.createProject({
          ...editingProject,
          id: Date.now().toString(),
        } as Project);
      } else {
        await api.updateProject(editingProject as Project);
      }

      setEditingProject(null);
      setIsAdding(false);
      loadProjects();
    } catch (error) {
      console.error("Failed to save project", error);
      alert("Failed to save project. Check console for details.");
    }
  };

  const filteredProjects = (projects || []).filter(p => 
    p && (selectedCategory === "All" || p.category === selectedCategory)
  );

  // Group projects by category for the "All" view
  const groupedProjects: Record<string, Project[]> = categories.reduce((acc, cat) => {
    const catProjects = projects.filter(p => p.category === cat);
    if (catProjects.length > 0) {
      acc[cat] = catProjects;
    }
    return acc;
  }, {} as Record<string, Project[]>);

  if (renderError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-10 text-center">
        <h1 className="text-4xl font-black mb-4">Something went wrong.</h1>
        <p className="text-black/40 mb-8">{renderError}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-4 bg-black text-white rounded-2xl font-bold">Reload Page</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-gray flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gray px-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
              <Lock size={32} />
            </div>
          </div>
          
          <h1 className="text-[34.5px] font-black mb-1 tracking-normal">formwork</h1>
          <p className="text-black/40 text-xs mb-8 uppercase tracking-normal font-bold">Admin Access</p>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-brand-gray rounded-xl border-2 border-transparent focus:border-black transition-all outline-none text-center text-lg font-bold tracking-normal"
              autoFocus
              required
            />
            <button 
              type="submit"
              className="w-full py-4 bg-black text-white rounded-xl font-bold tracking-normal hover:bg-black/90 transition-all active:scale-[0.98]"
            >
              Login to Dashboard
            </button>
          </div>
          
          <p className="mt-12 text-[10px] text-black/20 uppercase tracking-normal font-bold">
            &copy; 2026 formwork. All Rights Reserved.
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 px-6 pb-24 max-w-7xl mx-auto bg-white font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20">
        <div>
          <h1 className="text-[64px] font-black leading-none mb-4 tracking-tight">Manage Portfolio</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <LayoutGrid size={14} className="opacity-40" />
              <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Dashboard</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[10px] uppercase font-bold opacity-20 hover:opacity-100 transition-opacity tracking-widest"
            >
              Logout
            </button>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingProject({
              title: "",
              category: categories[0] || "Logo Design",
              thumbnail: "",
              description: "",
              client: "",
              needs: "",
              solution: "",
              colorPalette: ["#000000", "#FFFFFF"],
              typography: [""],
              images: []
            });
            setIsAdding(true);
          }}
          className="flex items-center gap-3 bg-black text-white px-10 py-5 rounded-[24px] font-bold hover:opacity-80 transition-all active:scale-[0.98] whitespace-nowrap shadow-2xl shadow-black/10"
        >
          <Plus size={24} /> Add New Project
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-16 border-b border-black/5 pb-8">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all ${
            selectedCategory === "All" 
              ? "bg-black text-white shadow-lg" 
              : "bg-brand-gray text-black/40 hover:text-black"
          }`}
        >
          All Projects
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all ${
              selectedCategory === cat 
                ? "bg-black text-white shadow-lg" 
                : "bg-brand-gray text-black/40 hover:text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="space-y-16">
        {selectedCategory === "All" ? (
          Object.entries(groupedProjects).map(([cat, catProjects]) => (
            <div key={cat} className="space-y-8">
              <div className="flex items-center gap-4">
                <Folder size={20} className="opacity-20" />
                <h2 className="text-2xl font-black tracking-tight">{cat}</h2>
                <span className="bg-brand-gray px-3 py-1 rounded-full text-[10px] font-bold opacity-40">{catProjects.length}</span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {catProjects.map((p) => (
                  <ProjectRow 
                    key={p.id} 
                    project={p} 
                    onEdit={() => { setEditingProject(p); setIsAdding(false); }} 
                    onDelete={() => handleDelete(p.id)} 
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Folder size={20} className="opacity-20" />
              <h2 className="text-2xl font-black tracking-tight">{selectedCategory}</h2>
              <span className="bg-brand-gray px-3 py-1 rounded-full text-[10px] font-bold opacity-40">{filteredProjects.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {filteredProjects.length === 0 ? (
                <div className="py-32 text-center bg-brand-gray rounded-[32px] border-2 border-dashed border-black/5">
                  <p className="opacity-40 font-bold uppercase text-xs tracking-widest">No projects in this category</p>
                </div>
              ) : (
                filteredProjects.map((p) => (
                  <ProjectRow 
                    key={p.id} 
                    project={p} 
                    onEdit={() => { setEditingProject(p); setIsAdding(false); }} 
                    onDelete={() => handleDelete(p.id)} 
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal - Reusing the refined modal from previous turn */}
      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[40px] p-10 md:p-16 shadow-2xl relative">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-4xl font-black tracking-tight">{isAdding ? "Add Project" : "Edit Project"}</h2>
              <button 
                onClick={() => setEditingProject(null)} 
                className="p-2 hover:bg-brand-gray rounded-full transition-colors"
              >
                <X size={32} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {/* Left Column */}
              <div className="space-y-10">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Title</label>
                  <input
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full p-6 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium text-lg"
                    placeholder="Project Title"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Category</label>
                  <div className="relative">
                    <select
                      value={editingProject.category || "Logo Design"}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Category })}
                      className="w-full p-6 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium text-lg appearance-none cursor-pointer"
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Thumbnail</label>
                  <div className="space-y-6">
                    {editingProject.thumbnail && (
                      <div className="w-56 h-56 rounded-[32px] overflow-hidden border border-black/5 bg-brand-gray shadow-inner">
                        <img src={editingProject.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 bg-brand-gray p-2 rounded-2xl">
                      <label className="cursor-pointer bg-black text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-black/80 transition-colors">
                        파일 선택
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setEditingProject({ ...editingProject, thumbnail: reader.result as string });
                              };
                              reader.readAsDataURL(file as Blob);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <span className="text-xs opacity-40 font-medium">
                        {editingProject.thumbnail ? "이미지 선택됨" : "선택된 파일 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest whitespace-nowrap">Or URL:</span>
                      <input
                        value={editingProject.thumbnail || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-4 bg-brand-gray rounded-xl text-xs focus:outline-none focus:ring-2 ring-black/5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Project Images (Multiple)</label>
                  <div className="space-y-6">
                    {editingProject.images && editingProject.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-4">
                        {editingProject.images.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-black/5 bg-brand-gray">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(editingProject.images || [])];
                                newImages.splice(idx, 1);
                                setEditingProject({ ...editingProject, images: newImages });
                              }}
                              className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="cursor-pointer bg-black text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-black/80 transition-colors inline-block">
                      이미지 추가 선택
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          const newImages = [...(editingProject.images || [])];
                          
                          for (const file of files) {
                            const result = await new Promise<string>((resolve) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result as string);
                              reader.readAsDataURL(file as Blob);
                            });
                            newImages.push(result);
                          }
                          setEditingProject({ ...editingProject, images: newImages });
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Description</label>
                  <textarea
                    required
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full p-6 bg-brand-gray rounded-2xl h-64 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none text-lg"
                    placeholder="Describe the project..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-10">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Client</label>
                  <input
                    required
                    value={editingProject.client || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full p-6 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium text-lg"
                    placeholder="Client Name"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Needs</label>
                  <textarea
                    required
                    value={editingProject.needs || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, needs: e.target.value })}
                    className="w-full p-6 bg-brand-gray rounded-[32px] h-64 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none text-lg leading-relaxed"
                    placeholder="What were the client's requirements?"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-4 block tracking-[0.2em]">Solution</label>
                  <textarea
                    required
                    value={editingProject.solution || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full p-6 bg-brand-gray rounded-[32px] h-64 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none text-lg leading-relaxed"
                    placeholder="How did you solve the problem?"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-12 mt-6 border-t border-black/5 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-4 bg-black text-white px-12 py-6 rounded-[24px] font-bold text-lg hover:opacity-80 transition-all active:scale-[0.98] shadow-2xl shadow-black/20"
                >
                  <Save size={24} /> {isAdding ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProjectRowProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  key?: React.Key;
}

function ProjectRow({ project, onEdit, onDelete }: ProjectRowProps) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-black/5 flex items-center justify-between group hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-8">
        <div className="w-24 h-24 bg-brand-gray rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
          <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-black text-2xl mb-1 tracking-tight">{project.title}</h3>
          <p className="text-[10px] opacity-40 uppercase font-bold tracking-widest">{project.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onEdit}
          className="p-4 hover:bg-brand-gray rounded-2xl transition-colors text-black/40 hover:text-black"
          title="Edit"
        >
          <Edit2 size={24} />
        </button>
        <button
          onClick={onDelete}
          className="p-4 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-2xl transition-colors"
          title="Delete"
        >
          <Trash2 size={24} />
        </button>
      </div>
    </div>
  );
}
