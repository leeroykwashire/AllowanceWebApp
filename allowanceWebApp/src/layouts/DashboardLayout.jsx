import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsHouseDoor, BsArrowLeftRight, BsClockHistory, BsCurrencyExchange, BsMegaphone, BsList, BsBoxArrowRight } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';


const navItems = [
  { to: '.', label: 'Dashboard Home', icon: <BsHouseDoor size={20} className="me-2" />, end: true },
  { to: 'transfer', label: 'Send Money', icon: <BsArrowLeftRight size={20} className="me-2" /> },
  { to: 'transactions', label: 'Transaction History', icon: <BsClockHistory size={20} className="me-2" /> },
  { to: 'rates', label: 'Exchange Rates', icon: <BsCurrencyExchange size={20} className="me-2" /> },
  { to: 'ads', label: 'Promotions & Ads', icon: <BsMegaphone size={20} className="me-2" /> },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Responsive sidebar toggle
  const handleToggleSidebar = () => setSidebarOpen((open) => !open);
  const handleLogoutClick = () => setShowLogoutModal(true);
  const handleLogoutCancel = () => setShowLogoutModal(false);
  const handleLogoutConfirm = () => {
    dispatch(logout());
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav
        className={`bg-light border-end position-sticky top-0 ${sidebarOpen ? '' : 'd-none d-md-block'}`}
        style={{ width: sidebarOpen ? 220 : 60, minHeight: '100vh', transition: 'width 0.2s' }}
      >
        <div className="p-4 text-center" style={{ paddingLeft: sidebarOpen ? 24 : 0, paddingRight: sidebarOpen ? 24 : 0 }}>
          <img src="/images/logo/allowance_logo.jpeg" alt="Logo" style={{ width: sidebarOpen ? 60 : 40, borderRadius: 12, marginBottom: 24 }} />
          <ul className="nav flex-column gap-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    'nav-link d-flex align-items-center justify-content-center' + (isActive ? ' active fw-bold text-primary' : '')
                  }
                  style={{ cursor: 'pointer', paddingLeft: sidebarOpen ? 0 : 0 }}
                >
                  {item.icon}
                  {sidebarOpen && <span className="ms-2">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {/* Main content */}
      <div className="flex-grow-1">
        {/* Top Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4" style={{ minHeight: 64 }}>
          <span className="navbar-brand fw-bold text-primary">Allowance Dashboard</span>
          <button
            className="btn btn-outline-secondary ms-3 d-md-inline"
            type="button"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <BsList size={24} />
          </button>
          <div className="ms-auto">
            <button className="btn btn-outline-danger" title="Logout" style={{ borderColor: 'black', color: 'black' }} onClick={handleLogoutClick}>
              <BsBoxArrowRight size={22} />
            </button>
          </div>
        </nav>
        <main className="p-4">
          <Outlet />
        </main>
        {/* Modern Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.35)', zIndex: 1050 }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content" style={{ borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                <div className="modal-header border-0 pb-0" style={{ justifyContent: 'center' }}>
                  <div className="bg-danger bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, boxShadow: '0 2px 8px rgba(220,53,69,0.18)' }}>
                    <BsBoxArrowRight size={32} />
                  </div>
                </div>
                <div className="modal-body text-center pt-0">
                  <h5 className="fw-bold mb-2 mt-2">Confirm Logout</h5>
                  <p className="text-secondary mb-3" style={{ fontSize: '1.08rem' }}>Are you sure you want to log out?</p>
                </div>
                <div className="modal-footer border-0 d-flex justify-content-center gap-2 pb-4">
                  <button type="button" className="btn btn-light px-4" style={{ borderRadius: 24, fontWeight: 500 }} onClick={handleLogoutCancel}>Cancel</button>
                  <button type="button" className="btn btn-danger px-4" style={{ borderRadius: 24, fontWeight: 500 }} onClick={handleLogoutConfirm}>Logout</button>
                </div>
                <button type="button" className="btn-close position-absolute top-0 end-0 m-3" aria-label="Close" onClick={handleLogoutCancel}></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardLayout;
