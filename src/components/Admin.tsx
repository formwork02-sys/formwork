import { useState, useEffect, FormEvent } from "react";
import { Project, Category } from "../types";
import { api } from "../services/api";
import { CATEGORIES } from "../constants";
import { Plus, Edit2, Trash2, X, Save, Lock } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const adminAuth = sessionStorage.getItem("admin_auth");
    if (adminAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      if (Array.isArray(data)) {
        setProjects(data);
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
      sessionStorage.setItem("admin_auth", "true");
    } else {
      alert("Wrong password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      await api.deleteProject(id);
      loadProjects();
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

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
  };

  const filteredProjects = (projects || []).filter(p => 
    selectedCategory === "All" || p.category === selectedCategory
  );

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
            />
            <button className="w-full py-4 bg-black text-white rounded-xl font-bold tracking-normal hover:bg-black/90 transition-all active:scale-[0.98]">
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
    <div className="min-h-screen pt-32 px-6 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black mb-2">Manage Portfolio</h1>
          <div className="flex items-center gap-4">
            <p className="text-sm opacity-40 uppercase font-bold tracking-wider">Dashboard</p>
            <button 
              onClick={handleLogout}
              className="text-[10px] uppercase font-bold opacity-20 hover:opacity-100 transition-opacity"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 md:flex-none bg-white border border-black/10 px-4 py-3 rounded-xl font-bold text-sm focus:outline-none focus:border-black"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={() => {
              setEditingProject({
                title: "",
                category: "Logo Design",
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
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            <Plus size={20} /> Add Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-black/10">
            <p className="opacity-40 font-bold uppercase text-sm">No projects found in this category</p>
          </div>
        ) : (
          filteredProjects.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-2xl border border-black/5 flex items-center justify-between group hover:shadow-lg transition-all">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-brand-gray rounded-xl overflow-hidden border border-black/5">
                  <img src={p.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{p.title}</h3>
                  <p className="text-xs opacity-40 uppercase font-bold tracking-wider">{p.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProject(p);
                    setIsAdding(false);
                  }}
                  className="p-3 hover:bg-brand-gray rounded-xl transition-colors"
                  title="Edit"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-3 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[32px] p-8 md:p-12 shadow-2xl relative">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black tracking-tight">{isAdding ? "Add Project" : "Edit Project"}</h2>
              <button 
                onClick={() => setEditingProject(null)} 
                className="p-2 hover:bg-brand-gray rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Left Column */}
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Title</label>
                  <input
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full p-5 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium"
                    placeholder="Project Title"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Category</label>
                  <select
                    value={editingProject.category || "Logo Design"}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Category })}
                    className="w-full p-5 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium appearance-none cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Thumbnail</label>
                  <div className="space-y-4">
                    {editingProject.thumbnail && (
                      <div className="w-40 h-40 rounded-2xl overflow-hidden border border-black/5 bg-brand-gray">
                        <img src={editingProject.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="relative">
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
                        className="w-full p-5 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-black/80 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest whitespace-nowrap">Or URL:</span>
                      <input
                        value={editingProject.thumbnail || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-3 bg-brand-gray rounded-xl text-xs focus:outline-none focus:ring-2 ring-black/5"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Project Images (Multiple)</label>
                  <div className="space-y-4">
                    {editingProject.images && editingProject.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-3">
                        {editingProject.images.map((img, idx) => (
                          <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-black/5 bg-brand-gray">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...(editingProject.images || [])];
                                newImages.splice(idx, 1);
                                setEditingProject({ ...editingProject, images: newImages });
                              }}
                              className="absolute top-1 right-1 p-1 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                      className="w-full p-5 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-black/80 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Description</label>
                  <textarea
                    required
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full p-5 bg-brand-gray rounded-2xl h-48 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none"
                    placeholder="Describe the project..."
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Client</label>
                  <input
                    required
                    value={editingProject.client || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full p-5 bg-brand-gray rounded-2xl focus:outline-none focus:ring-2 ring-black/5 font-medium"
                    placeholder="Client Name"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Needs</label>
                  <textarea
                    required
                    value={editingProject.needs || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, needs: e.target.value })}
                    className="w-full p-5 bg-brand-gray rounded-2xl h-48 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none"
                    placeholder="What were the client's requirements?"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 mb-3 block tracking-widest">Solution</label>
                  <textarea
                    required
                    value={editingProject.solution || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full p-5 bg-brand-gray rounded-2xl h-48 focus:outline-none focus:ring-2 ring-black/5 font-medium resize-none"
                    placeholder="How did you solve the problem?"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-10 mt-4 border-t border-black/5 flex justify-end">
                <button 
                  type="submit"
                  className="flex items-center gap-3 bg-black text-white px-10 py-5 rounded-2xl font-bold hover:opacity-80 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                >
                  <Save size={22} /> {isAdding ? "Create Project" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
