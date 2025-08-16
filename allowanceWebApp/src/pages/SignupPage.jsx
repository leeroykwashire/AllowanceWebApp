
import React, { useState } from 'react';
import { useRegisterMutation } from '../store/slices/authApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CircularProgress from '@mui/material/CircularProgress';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const result = await register({
        username,
        email,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: passwordConfirm,
      }).unwrap();
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.access,
        refreshToken: result.refresh,
      }));
      navigate('/login');
    } catch (err) {
      // Friendly error handling for various API error formats
      let message = 'Signup failed. Please try again.';
      if (err?.data) {
        if (typeof err.data.detail === 'string') {
          message = err.data.detail;
        } else if (typeof err.data === 'string') {
          message = err.data;
        } else if (typeof err.data === 'object') {
          // Django REST may return field errors as {field: [msg]}
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
      <video
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
        <source src="/gifs/send_recieve.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container" style={{ maxWidth: 480, marginTop: 48, position: 'relative', zIndex: 1 }}>
        <div className="text-center mb-4">
          <img src="/images/logo/allowance_logo.jpeg" alt="Allowance Logo" style={{ width: 90, borderRadius: 16, marginBottom: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
          <h2 className="fw-bold text-primary">Create Your Allowance Account</h2>
          <p className="text-secondary mb-2" style={{ fontSize: '1.1rem' }}>
            Join thousands of Zimbabwean families sending money safely and easily to loved ones abroad.
          </p>
        </div>
        <div className="card shadow p-4 rounded mb-4">
          <h4 className="text-center mb-3">Sign Up</h4>
          {error && <div className="alert alert-danger mb-3">{error}</div>}
          {success && <div className="alert alert-success mb-3">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="signupUsername" className="form-label">Username<span className="text-danger">*</span></label>
              <input
                id="signupUsername"
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupEmail" className="form-label">Email<span className="text-danger">*</span></label>
              <input
                id="signupEmail"
                type="email"
                className="form-control"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupFirstName" className="form-label">First Name<span className="text-danger">*</span></label>
              <input
                id="signupFirstName"
                type="text"
                className="form-control"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                autoComplete="given-name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupLastName" className="form-label">Last Name<span className="text-danger">*</span></label>
              <input
                id="signupLastName"
                type="text"
                className="form-control"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                autoComplete="family-name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupPassword" className="form-label">Password<span className="text-danger">*</span></label>
              <input
                id="signupPassword"
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="signupPasswordConfirm" className="form-label">Confirm Password<span className="text-danger">*</span></label>
              <input
                id="signupPasswordConfirm"
                type="password"
                className="form-control"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                required
                autoComplete="new-password"
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
                  Signing up...
                </>
              ) : 'Sign Up'}
            </button>
          </form>
        </div>
        <div className="mb-4">
          <h5 className="fw-bold text-dark mb-2">Why Choose Allowance?</h5>
          <ul className="list-group list-group-flush mb-3">
            <li className="list-group-item bg-transparent border-0 ps-0"><span className="text-success fw-bold">✔</span> Fast, secure money transfers</li>
            <li className="list-group-item bg-transparent border-0 ps-0"><span className="text-success fw-bold">✔</span> Competitive exchange rates</li>
            <li className="list-group-item bg-transparent border-0 ps-0"><span className="text-success fw-bold">✔</span> Transparent, low fees</li>
            <li className="list-group-item bg-transparent border-0 ps-0"><span className="text-success fw-bold">✔</span> Trusted by Zimbabwean families worldwide</li>
          </ul>
          <div className="alert alert-info text-center" style={{ fontSize: '1rem' }}>
            <strong>New to Allowance?</strong> Signing up is quick and easy. Your information is always kept private and secure.
          </div>
        </div>
        <div className="text-center text-secondary" style={{ fontSize: '0.95rem' }}>
          By creating an account, you agree to our <a href="#" className="text-primary">Terms of Service</a> and <a href="#" className="text-primary">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
