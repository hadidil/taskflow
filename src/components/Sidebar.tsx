import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface Project {
  id: string;
  name: string;
  color: string;
}

interface SidebarProps {
  projects: Project[];
  isOpen: boolean;
  onRename?: (project: Project) => void;
  onDelete?: (id: string) => void;
}

export default function Sidebar({ projects, isOpen, onRename, onDelete }: SidebarProps) {
  console.log('Sidebar re-render');

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <h2 className={styles.title}>Mes Projets</h2>
      <ul className={styles.list}>
        {projects.map(p => (
          <li key={p.id}>
            <div className={styles.itemRow}>
              <NavLink
                to={`/projects/${p.id}`}
                className={({ isActive }) =>
                  `${styles.item} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.dot} style={{ background: p.color }} />
                {p.name}
              </NavLink>
              {(onRename || onDelete) && (
                <div className={styles.actions}>
                  {onRename && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onRename(p)}
                    >
                      Renommer
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className={styles.actionBtn}
                      onClick={() => onDelete(p.id)}
                    >
                      Suppr.
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
