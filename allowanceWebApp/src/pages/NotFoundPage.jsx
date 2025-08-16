import React from 'react';
import { Link } from 'react-router-dom';
import { BsExclamationTriangle } from 'react-icons/bs';

const NotFoundPage = () => (
  <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
    <div className="bg-white p-5 rounded shadow text-center">
      <BsExclamationTriangle size={64} className="text-warning mb-3" />
      <h1 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>404 - Page Not Found</h1>
      <p className="text-secondary mb-4" style={{ fontSize: '1.15rem' }}>
        Sorry, the page you are looking for does not exist.<br />
        Please check the URL or return to the homepage.
      </p>
      <Link to="/" className="btn btn-primary px-4 py-2" style={{ borderRadius: 24, fontWeight: 500 }}>
        Go to Homepage
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
