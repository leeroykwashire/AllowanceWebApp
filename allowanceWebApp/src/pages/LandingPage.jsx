import { Link } from 'react-router-dom';
import { useGetAdsQuery } from '../store/slices/adsApiSlice';
import { useSelector } from 'react-redux';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { data: ads, isLoading } = useGetAdsQuery();
  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Ensure background video covers entire page, even on scroll */}
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
        <source src="/gifs/techno_globe.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Container maxWidth="md" style={{ background: 'white', borderRadius: 24, boxShadow: '0 4px 32px rgba(0,0,0,0.10)', marginTop: 48, padding: 48, position: 'relative', zIndex: 1 }}>
      <div className="text-center mb-5">
        <img src="/images/logo/allowance_logo.jpeg" alt="Allowance Logo" style={{ width: 140, borderRadius: 20, marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
        <Typography variant="h2" component="h1" color="primary" gutterBottom fontWeight={700}>
          Welcome to Allowance
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Empowering Zimbabwean families to support their loved ones abroad.
        </Typography>
        <Typography variant="body1" color="textSecondary" style={{ margin: '24px 0', fontSize: '1.15rem' }}>
          Allowance is your trusted partner for sending money to children studying in the UK or South Africa. Enjoy fast, secure transfers, competitive rates, and transparent fees. Our platform is designed for simplicity and peace of mind, so you can focus on what matters most—your family.
        </Typography>
        <Typography variant="body1" color="primary" style={{ marginBottom: 16, fontWeight: 500 }}>
          Join thousands of Zimbabwean parents who rely on Allowance for safe, reliable international payments.
        </Typography>
      </div>
      <Card style={{ marginBottom: 40, background: '#f8f9fa', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-5">
              <span className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <Carousel interval={4000}>
              {Array.isArray(ads) && ads.length > 0 ? ads.map((ad, idx) => (
                <Carousel.Item key={idx}>
                  <img src={ad.image_url} alt={ad.title} className="d-block w-100" style={{ maxHeight: 220, objectFit: 'cover', borderRadius: 12 }} />
                  <Carousel.Caption>
                    <h5 style={{ color: '#212121', background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '6px 16px', display: 'inline-block', fontWeight: 600 }}>{ad.title}</h5>
                    <p style={{ color: '#212121', background: 'rgba(255,255,255,0.85)', borderRadius: 8, padding: '4px 12px', display: 'inline-block', fontWeight: 400 }}>{ad.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              )) : (
                <Carousel.Item>
                  <div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
                    <Typography variant="h6" color="textSecondary">No promotions available.</Typography>
                  </div>
                </Carousel.Item>
              )}
            </Carousel>
          )}
        </CardContent>
      </Card>
      <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 mb-4">
        {!isAuthenticated && (
          <>
            <Button component={Link} to="/signup" variant="contained" color="primary" size="large" style={{ borderRadius: 28, minWidth: 160, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              Get Started
            </Button>
            <Button component={Link} to="/login" variant="outlined" color="primary" size="large" style={{ borderRadius: 28, minWidth: 160, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              Login
            </Button>
          </>
        )}
        {isAuthenticated && (
          <Button component={Link} to="/dashboard" variant="contained" color="success" size="large" style={{ borderRadius: 28, minWidth: 200, fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Go to Dashboard
          </Button>
        )}
      </div>
      <div className="mt-5 text-center">
        <Typography variant="body2" color="textSecondary" style={{ fontSize: '1rem' }}>
          <span style={{ color: '#1976d2', fontWeight: 500 }}>Allowance</span> is built for families, by families. Experience the difference today.
        </Typography>
      </div>
    </Container>
  </div>
  );
};

export default LandingPage;
