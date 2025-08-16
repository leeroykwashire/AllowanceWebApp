import React from 'react';
import { Card, CardContent, Typography, Grid, Box, CircularProgress } from '@mui/material';
import { FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';
import { useGetRatesQuery } from '../store/slices/ratesApiSlice';


const RatesPage = () => {
  const { data: rates, isLoading } = useGetRatesQuery();

  return (
    <Box sx={{ p: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', minHeight: '100vh' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
        Exchange Rates
      </Typography>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          {Array.isArray(rates) && rates.length > 0 ? rates.map((rateObj, idx) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={rateObj.currency_code || idx}>
              <Card sx={{
                borderRadius: 5,
                boxShadow: 6,
                background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.045)',
                  boxShadow: 12,
                  background: 'linear-gradient(135deg, #f8ffae 0%, #43c6ac 100%)',
                },
                minHeight: 170,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <CardContent sx={{ width: '100%', p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <FaMoneyBillWave size={36} color="#38a169" style={{ marginRight: 14 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#2b6cb0', letterSpacing: 1 }}>
                      USD <FaArrowRight style={{ margin: '0 10px', verticalAlign: 'middle', color: '#718096' }} /> {rateObj.currency_code}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', mt: 1 }}>
                    <Typography variant="body2" sx={{ color: '#718096', fontSize: 15, mb: 0.5 }}>
                      1 USD =
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#38a169', fontSize: 28, mb: 0.5 }}>
                      {rateObj.rate_to_usd} <span style={{ color: '#2b6cb0', fontWeight: 700 }}>{rateObj.currency_code}</span>
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
              No rates available.
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default RatesPage;
