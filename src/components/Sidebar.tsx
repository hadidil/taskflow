import { useState } from "react";
import styles from "./Sidebar.module.css";

interface Project {
  id: string;
  name: string;
  color: string;
}
interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
}

export default function Sidebar({ projects, isOpen }: SidebarProps) {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className={`${styles.item} ${activeProjectId === p.id ? styles.active : ""}`}
              onClick={() => setActiveProjectId(p.id)}
            >
              <span className={styles.dot} style={{ background: p.color }} />
              {p.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
