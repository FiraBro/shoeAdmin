import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "../ui/AdminLayout.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

const AdminLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove auth token
    navigate("/admin/login"); // Redirect to login page
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
                to="/products"
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
                to="/reviews"
                className={`${styles.navLink} ${
                  pathname === "/admin/reviews" ? styles.active : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Review Management
              </Link>
            </li>
            <li>
              {/* Logout is a button since it performs an action */}
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
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
