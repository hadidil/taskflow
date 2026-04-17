import { memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HeaderMUI from "../components/HeaderMUI";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import ProjectForm from "../components/ProjectForm";
import { logout } from "../features/auth/authSlice";
import type { AppDispatch, RootState } from "../store";
import { useProjects, type Project } from "../hooks/useProjects";
import styles from "./Dashboard.module.css";

const MemoizedSidebar = memo(Sidebar);

export default function Dashboard() {
  const authState = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const {
    projects,
    columns,
    loading,
    error,
    addProject,
    renameProject,
    deleteProject,
  } = useProjects();

  const dangerousName = '<img src=x onerror=alert("HACK")>';

  const handleRename = useCallback(
    (project: Project) => renameProject(project),
    [renameProject],
  );

  const handleDelete = useCallback(
    (id: string) => deleteProject(id),
    [deleteProject],
  );

  async function handleAddProject(name: string, color: string) {
    setSaving(true);
    try {
      await addProject(name, color);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <HeaderMUI
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch(logout())}
      />
      <div className={styles.body}>
        <MemoizedSidebar
          projects={projects}
          isOpen={sidebarOpen}
          onRename={handleRename}
          onDelete={handleDelete}
        />
        <div className={styles.content}>
          <div className={styles.xssDemo}>
            <p>{dangerousName}</p>
          </div>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => setShowForm(true)}
                disabled={saving}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Créer"
                onSubmit={async (name: string, color: string) => {
                  await handleAddProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}
