import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../../shared/store/store';
import './header.css';

export const Header = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleViewProfile = () => {
    navigate('/dashboard/perfil');
    setShowUserMenu(false);
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="header-left">
          <h1 className="page-title">Dashboard Overview</h1>
        </div>

        <div className="header-right">
          <button className="btn-new-reservation">
            <span>Nueva Reserva</span>
          </button>

          <button className="btn-icon notifications-btn" aria-label="Notificaciones">
            <i className="bi bi-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu">
            <button
              className="user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              aria-label="Menú de usuario"
            >
              <div className="avatar">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'user'}`}
                  alt="User avatar"
                />
              </div>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <h4>{user?.user_nm || 'Usuario'}</h4>
                  <p className="user-email">{user?.email || 'email@example.com'}</p>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleViewProfile}>
                  <i className="bi bi-person"></i>
                  <span>Mi Perfil</span>
                </button>
                <button className="dropdown-item">
                  <i className="bi bi-gear"></i>
                  <span>Configuración</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
