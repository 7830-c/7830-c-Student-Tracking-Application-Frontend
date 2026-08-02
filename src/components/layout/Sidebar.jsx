import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Sidebar({ title, links }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <h2 className={styles.title}>{title} Menu</h2>
        <button className={styles.toggleBtn} aria-label="Toggle sidebar menu">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? `${styles.link} ${styles.active}`
                : styles.link
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;