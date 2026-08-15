import { Search, Bell } from "lucide-react";

import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <h1>Dashboard</h1>
        <p>Welcome back 👋</p>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconButton}>
          <Search size={25} />
        </button>

        <button className={styles.iconButton}>
          <Bell size={25} />
        </button>

        <div className={styles.avatar}>
          N
        </div>
      </div>
    </header>
  );
}

export default Header;