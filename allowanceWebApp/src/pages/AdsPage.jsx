import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress, CardMedia } from '@mui/material';
import { FaBullhorn } from 'react-icons/fa';
import { useGetAdsQuery } from '../store/slices/adsApiSlice';

const AdsPage = () => {
  const { data: ads, isLoading } = useGetAdsQuery();

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }} className='m-5'>
        Promotions & Ads
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2, flexWrap: 'wrap' }}>
          {Array.isArray(ads) && ads.length > 0 ? ads.map((ad, idx) => (
            <Grid
              key={ad.id || idx}
              style={{
                flex: '1 1 320px',
                maxWidth: '400px',
                minWidth: '260px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'stretch',
                margin: '0 auto',
              }}
            >
              <Card sx={{
                borderRadius: 5,
                boxShadow: 6,
                background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.045)',
                  boxShadow: 12,
                  background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                },
                minHeight: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
                {ad.image_url && (
                  <CardMedia
                    component="img"
                    image={ad.image_url}
                    alt={ad.title || 'Ad'}
                    sx={{ height: 120, objectFit: 'cover', borderRadius: 3, mb: 2, width: '100%' }}
                  />
                )}
                <CardContent sx={{ width: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <FaBullhorn size={28} color="#2b6cb0" style={{ marginRight: 10 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2b6cb0', letterSpacing: 1 }}>
                      {ad.title || 'Promotion'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: '#4a5568', fontSize: 17, mb: 1 }}>
                    {ad.description || 'No description provided.'}
                  </Typography>
                  {ad.link && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <Typography variant="button" sx={{ color: '#38a169', fontWeight: 700, fontSize: 16 }}>
                          Learn More
                        </Typography>
                      </a>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
              No ads available.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AdsPage;
