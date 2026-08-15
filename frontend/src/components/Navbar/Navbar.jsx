import styles from "./Navbar.module.css";

import {
  Bell,
  Search,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div>

        <h2>Dashboard</h2>

        <p>
          Welcome back 👋
        </p>

      </div>

      <div className={styles.right}>

        <Search />

        <Bell />

        <div className={styles.avatar}>
          N
        </div>

      </div>
    </header>
  );
}