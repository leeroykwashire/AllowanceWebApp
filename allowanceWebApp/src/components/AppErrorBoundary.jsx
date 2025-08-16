import React from 'react';

const AppErrorBoundary = ({ error }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8d7da' }}>
      <div style={{ background: 'white', padding: 32, borderRadius: 18, boxShadow: '0 4px 24px rgba(220,53,69,0.12)', maxWidth: 480, textAlign: 'center' }}>
        <h2 style={{ color: '#dc3545', fontWeight: 700 }}>Something went wrong</h2>
        <p style={{ color: '#212529', fontSize: '1.1rem', marginTop: 16 }}>
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <pre style={{ color: '#6c757d', background: '#f8f9fa', padding: 12, borderRadius: 8, marginTop: 16, fontSize: '0.95rem', maxHeight: 200, overflow: 'auto' }}>
          {error?.stack}
        </pre>
        <button className="btn btn-danger mt-4" onClick={() => window.location.reload()} style={{ borderRadius: 24, fontWeight: 500 }}>
          Reload App
        </button>
      </div>
    </div>
  );
};

export default AppErrorBoundary;
