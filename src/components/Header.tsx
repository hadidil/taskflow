import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { logout } from "../features/auth/authSlice";

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  const authState = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          ☰
        </button>
        <h1 className={styles.logo}>{title}</h1>
      </div>
      <div className={styles.right}>
        {authState.user && (
          <span className={styles.userName}>{authState.user.name}</span>
        )}
        {authState.user && (
          <button
            className={styles.logoutBtn}
            onClick={() => dispatch(logout())}
          >
            Déconnexion
          </button>
        )}
      </div>
    </header>
  );
}
