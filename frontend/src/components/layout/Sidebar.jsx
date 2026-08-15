import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  FolderOpen,
  BarChart3,
  Settings,
} from "lucide-react";

import styles from "./Sidebar.module.css";

function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "History",
      path: "/history",
      icon: History,
    },
    {
      name: "Documents",
      path: "/documents",
      icon: FolderOpen,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>⚯</div>

        <div>
          <h1>ResearchOS</h1>
          <p>AI Research Platform</p>
        </div>
      </div>

      <nav className={styles.navigation}>
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `${styles.navItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Icon size={22} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      
    </aside>
  );
}

export default Sidebar;