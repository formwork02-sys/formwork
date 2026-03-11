import { useState, useEffect, FormEvent } from "react";
import { Project, Category } from "../types";
import { api } from "../services/api";
import { CATEGORIES } from "../constants";
import { Plus, Edit2, Trash2, X, Save, Lock } from "lucide-react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    const data = await api.getProjects();
    setProjects(data);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === "1111") {
      setIsAuthenticated(true);
    } else {
      alert("Wrong password");
    }
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
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-black">Manage Portfolio</h1>
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
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold hover:opacity-80 transition-opacity"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-6 rounded-2xl border border-black/5 flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <img src={p.thumbnail} alt="" className="w-20 h-20 object-cover rounded-lg bg-brand-gray" />
              <div>
                <h3 className="font-bold text-lg">{p.title}</h3>
                <p className="text-sm opacity-40 uppercase font-bold">{p.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditingProject(p);
                  setIsAdding(false);
                }}
                className="p-2 hover:bg-brand-gray rounded-lg transition-colors"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProject && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black">{isAdding ? "Add Project" : "Edit Project"}</h2>
              <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-brand-gray rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Title</label>
                  <input
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full p-4 bg-brand-gray rounded-xl focus:outline-none focus:ring-2 ring-black/5"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as Category })}
                    className="w-full p-4 bg-brand-gray rounded-xl focus:outline-none focus:ring-2 ring-black/5"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Thumbnail</label>
                  <div className="space-y-4">
                    {editingProject.thumbnail && (
                      <img src={editingProject.thumbnail} alt="Thumbnail preview" className="w-32 h-32 object-cover rounded-xl border border-black/5" />
                    )}
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
                      className="w-full p-4 bg-brand-gray rounded-xl focus:outline-none focus:ring-2 ring-black/5 text-sm"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-40 uppercase font-bold">Or URL:</span>
                      <input
                        value={editingProject.thumbnail}
                        onChange={(e) => setEditingProject({ ...editingProject, thumbnail: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 p-2 bg-brand-gray rounded-lg text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Project Images (Multiple)</label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      {editingProject.images?.map((img, idx) => (
                        <div key={idx} className="relative group aspect-video">
                          <img src={img} alt="" className="w-full h-full object-cover rounded-lg border border-black/5" />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...(editingProject.images || [])];
                              newImages.splice(idx, 1);
                              setEditingProject({ ...editingProject, images: newImages });
                            }}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
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
                      className="w-full p-4 bg-brand-gray rounded-xl focus:outline-none focus:ring-2 ring-black/5 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Description</label>
                  <textarea
                    required
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full p-4 bg-brand-gray rounded-xl h-32 focus:outline-none focus:ring-2 ring-black/5"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Client</label>
                  <input
                    required
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full p-4 bg-brand-gray rounded-xl focus:outline-none focus:ring-2 ring-black/5"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Needs</label>
                  <textarea
                    required
                    value={editingProject.needs}
                    onChange={(e) => setEditingProject({ ...editingProject, needs: e.target.value })}
                    className="w-full p-4 bg-brand-gray rounded-xl h-24 focus:outline-none focus:ring-2 ring-black/5"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase font-bold opacity-40 mb-2 block">Solution</label>
                  <textarea
                    required
                    value={editingProject.solution}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    className="w-full p-4 bg-brand-gray rounded-xl h-24 focus:outline-none focus:ring-2 ring-black/5"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-6 border-t border-black/5 flex justify-end">
                <button className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:opacity-80 transition-opacity">
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
