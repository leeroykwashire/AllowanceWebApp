import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMoneyCheckAlt, FaHistory, FaExchangeAlt, FaBullhorn } from 'react-icons/fa';


const cardData = [
  {
    title: 'Send Money',
    text: 'Transfer funds quickly and securely to your loved ones.',
    icon: <FaMoneyCheckAlt size={40} color="#2563eb" style={{ marginBottom: 10 }} />,
    link: '/dashboard/transfer',
    btn: 'Go to Transfer',
    bg: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
  },
  {
    title: 'Transaction History',
    text: 'View your past transactions and track your payments.',
    icon: <FaHistory size={40} color="#16a34a" style={{ marginBottom: 10 }} />,
    link: '/dashboard/transactions',
    btn: 'View History',
    bg: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
  },
  {
    title: 'Exchange Rates',
    text: 'Check the latest rates and use our rate calculator.',
    icon: <FaExchangeAlt size={40} color="#eab308" style={{ marginBottom: 10 }} />,
    link: '/dashboard/rates',
    btn: 'Check Rates',
    bg: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  {
    title: 'Promotions & Ads',
    text: 'Explore current offers and promotions for your transfers.',
    icon: <FaBullhorn size={40} color="#db2777" style={{ marginBottom: 10 }} />,
    link: '/dashboard/ads',
    btn: 'View Promotions',
    bg: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
  },
];

const DashboardPage = () => (
  <div className="container-fluid" style={{ marginTop: 0, minHeight: '100vh', background: '#fff', padding: '0 0 48px 0' }}>
    <div className="row justify-content-center align-items-center" style={{ minHeight: 220, background: 'linear-gradient(90deg, #e0eafc 0%, #cfdef3 100%)', borderRadius: 0, marginBottom: 32 }}>
      <div className="col-12 text-center py-5">
        <h2 className="fw-bold text-primary" style={{ fontSize: '2.5rem', letterSpacing: 1 }}>Welcome to Your Dashboard</h2>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto' }}>
          Manage your transfers, view transaction history, check rates, and explore promotions. Everything you need in one place.
        </p>
      </div>
    </div>
    <div className="row g-4 justify-content-center">
      {cardData.map((card, idx) => (
        <div className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex" key={idx}>
          <Link to={card.link} style={{ textDecoration: 'none', width: '100%' }}>
            <div className="card shadow-lg h-100 w-100" style={{ borderRadius: 18, background: card.bg, border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
              <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
                {card.icon}
                <h5 className="card-title fw-bold mb-2" style={{ fontSize: '1.3rem', color: '#2563eb' }}>{card.title}</h5>
                <p className="card-text mb-3" style={{ color: '#334155', fontSize: '1.05rem', minHeight: 60 }}>{card.text}</p>
                <span className="btn btn-primary px-4 py-2" style={{ borderRadius: 12, fontWeight: 600, fontSize: '1rem', pointerEvents: 'none' }}>{card.btn}</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);

export default DashboardPage;
