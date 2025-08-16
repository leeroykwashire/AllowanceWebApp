
import React, { useState } from 'react';
import { useLoginMutation } from '../store/slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularProgress from '@mui/material/CircularProgress';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await login({ username, password }).unwrap();
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.access,
        refreshToken: result.refresh,
      }));
      navigate('/dashboard');
    } catch (err) {
      // Friendly error handling for various API error formats
      let message = 'Login failed. Please try again.';
      if (err?.data) {
        if (typeof err.data.detail === 'string') {
          message = err.data.detail;
        } else if (typeof err.data === 'string') {
          message = err.data;
        } else if (typeof err.data === 'object') {
          message = Object.entries(err.data)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join(' | ');
        }
      }
      setError(message);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          minWidth: '100%',
          minHeight: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.25,
          filter: 'blur(1px) grayscale(20%)',
          pointerEvents: 'none',
        }}
      >
        <source src="/gifs/students.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <div className="container" style={{ maxWidth: 480, marginTop: 48, position: 'relative', zIndex: 1 }}>
        <div className="text-center mb-4">
          <img src="/images/logo/allowance_logo.jpeg" alt="Allowance Logo" style={{ width: 90, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          <h2 className="fw-bold text-primary mt-3">Welcome Back</h2>
          <p className="text-secondary mb-5" style={{ fontSize: '1.1rem' }}>
            Log in to manage your international transfers and support your family with ease.
          </p>
        </div>
        <div className="card shadow p-4 rounded mb-4">
          <h4 className="text-center mb-3">Login</h4>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginUsername" className="form-label">Username</label>
              <input
                id="loginUsername"
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                id="loginPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
              disabled={isLoading}
              style={{ position: 'relative', minHeight: 40 }}
            >
              {isLoading ? (
                <>
                  <CircularProgress size={22} color="inherit" style={{ marginRight: 10 }} />
                  Logging in...
                </>
              ) : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
