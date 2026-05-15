import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [projectsResponse, columnsResponse] = await Promise.all([
          api.get("/projects"),
          api.get("/columns"),
        ]);

        if (!active) {
          return;
        }

        setProjects(projectsResponse.data);
        setColumns(columnsResponse.data);
      } catch (err) {
        if (!active) {
          return;
        }

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message || `Erreur ${err.response?.status}`,
          );
        } else {
          setError("Erreur inconnue");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  async function addProject(name: string, color: string) {
    setError(null);

    try {
      const { data } = await api.post("/projects", { name, color });
      setProjects((currentProjects) => [...currentProjects, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || `Erreur ${err.response?.status}`,
        );
      } else {
        setError("Erreur inconnue");
      }
    }
  }

  async function renameProject(project: Project) {
    const nextName = window.prompt("Nouveau nom du projet", project.name);

    if (!nextName || nextName.trim() === project.name) {
      return;
    }

    setError(null);

    try {
      const { data } = await api.patch(`/projects/${project.id}`, {
        name: nextName.trim(),
      });
      setProjects((currentProjects) =>
        currentProjects.map((currentProject) =>
          currentProject.id === project.id ? data : currentProject,
        ),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || `Erreur ${err.response?.status}`,
        );
      } else {
        setError("Erreur inconnue");
      }
    }
  }

  async function deleteProject(id: string) {
    const shouldDelete = window.confirm("Supprimer ce projet ?");

    if (!shouldDelete) {
      return;
    }

    setError(null);

    try {
      await api.delete(`/projects/${id}`);
      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== id),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || `Erreur ${err.response?.status}`,
        );
      } else {
        setError("Erreur inconnue");
      }
    }
  }

  return {
    projects,
    columns,
    loading,
    error,
    addProject,
    renameProject,
    deleteProject,
  };
}
