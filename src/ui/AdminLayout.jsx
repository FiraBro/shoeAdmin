import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "../ui/AdminLayout.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.layout}>
      {/* Mobile header */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuToggle} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h2 className={styles.mobileLogo}>Admin Panel</h2>
      </header>

      <aside
        className={`${styles.sidebar} ${
          isMobileMenuOpen ? styles.sidebarOpen : ""
        }`}
      >
        <h2 className={styles.logo}>Admin Panel</h2>
        <nav>
          <ul className={styles.navList}>
            <li>
              <Link
                to="/admin/products"
                className={`${styles.navLink} ${
                  pathname === "/admin/products" ? styles.active : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Product Management
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reviews"
                className={`${styles.navLink} ${
                  pathname === "/admin/reviews" ? styles.active : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Review Management
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
