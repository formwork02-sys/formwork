import { Project } from "../types";

export const api = {
  getProjects: async (): Promise<Project[]> => {
    const res = await fetch("/api/projects");
    return res.json();
  },
  createProject: async (project: Project) => {
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
  },
  updateProject: async (project: Project) => {
    await fetch(`/api/projects/${project.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
  },
  deleteProject: async (id: string) => {
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });
  },
  verifyPassword: async (password: string): Promise<boolean> => {
    const res = await fetch("/api/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  },
};
