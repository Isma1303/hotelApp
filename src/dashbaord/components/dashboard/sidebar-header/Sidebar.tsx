import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar as PrimeSidebar } from 'primereact/sidebar';
import { Ripple } from 'primereact/ripple';
import { useStore } from '../../../../shared/store/store';
import { AuthService } from '../../../../auth/auth.service';
import './sidebar.css';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const authService = new AuthService();

  const menuItems = [
    { icon: 'bi-grid-1x2', label: 'Dashboard', path: '/dashboard' },
    { icon: 'bi-calendar-check', label: 'Reservas', path: '/dashboard/reservas' },
    { icon: 'bi-door-closed', label: 'Habitaciones', path: '/dashboard/habitaciones' },
    { icon: 'bi-people', label: 'Huéspedes', path: '/dashboard/huespedes' },
    { icon: 'bi-credit-card', label: 'Finanzas', path: '/dashboard/finanzas' },
    { icon: 'bi-gear', label: 'Configuración', path: '/dashboard/configuracion' },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error durante logout:', error);
      logout();
      navigate('/login', { replace: true });
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-toggle d-lg-none"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        <i className={`bi ${isMobileOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {isMobileOpen && (
        <div className="sidebar-overlay d-lg-none" onClick={() => setIsMobileOpen(false)}></div>
      )}


      <PrimeSidebar
        visible={true}
        modal={false}
        dismissable={false}
        showCloseIcon={false}
        onHide={() => setIsMobileOpen(false)}
        className={`sidebar ${isMobileOpen ? 'mobile-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        baseZIndex={1030}
        style={{ width: isCollapsed ? 'var(--sb-w-collapsed)' : 'var(--sb-w)' }}
      >

        <button
          className="sidebar-collapse-btn d-none d-lg-flex"
          onClick={toggleCollapse}
          aria-label="Toggle sidebar collapse"
          title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>

        <div className="sidebar-logo">
          <div className="logo-circle">
            <i className="bi bi-building"></i>
          </div>
          {!isCollapsed && (
            <div className="logo-text">
              <h3>Hotel Admin</h3>
              <p>Management</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <button
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigation(item.path)}
                  aria-label={item.label}
                  title={isCollapsed ? item.label : ''}
                >
                  <i className={`bi ${item.icon}`}></i>
                  {!isCollapsed && <span className="nav-label">{item.label}</span>}
                  <Ripple />
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Cerrar Sesión"
            title={isCollapsed ? 'Cerrar Sesión' : ''}
          >
            <i className="bi bi-box-arrow-left"></i>
            {!isCollapsed && <span>Cerrar Sesión</span>}
            <Ripple />
          </button>
        </div>
      </PrimeSidebar>
    </>
  );
};
