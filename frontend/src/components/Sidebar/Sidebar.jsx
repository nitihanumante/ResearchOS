import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  FolderOpen,
  BarChart3,
  Settings,
  BrainCircuit,
} from "lucide-react";

import styles from "./Sidebar.module.css";

function Sidebar() {
  const menuItems = [
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

      {/* Logo */}
      <div className={styles.logo}>
        <BrainCircuit size={28} />

        <span>ResearchOS</span>
      </div>

      {/* Navigation */}
      <nav className={styles.navigation}>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${
                  isActive ? styles.active : ""
                }`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}

      </nav>

    </aside>
  );
}

export default Sidebar;