import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCalculateMutation, useSendMutation } from '../store/slices/transactionApiSlice';
import { useGetRatesQuery } from '../store/slices/ratesApiSlice';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

const currencyOptions = [
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'ZAR', label: 'South African Rand (ZAR)' },
];

const TransferPage = () => {
  const accessToken = useSelector(state => state.auth.accessToken);
  const [amountUsd, setAmountUsd] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('GBP');
  const [recipientName, setRecipientName] = useState('');
  const [calcResult, setCalcResult] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [calculate, { isLoading: isCalculating }] = useCalculateMutation();
  const [send, { isLoading: isSending }] = useSendMutation();
  const { data: rates, isLoading: isRatesLoading } = useGetRatesQuery();

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setCalcResult(null);
    try {
      const result = await calculate({
        amount_usd: amountUsd,
        target_currency: targetCurrency,
        recipient_name: recipientName,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).unwrap();
      setCalcResult(result);
    } catch (err) {
      setError(err?.data?.detail || 'Calculation failed. Please check your input.');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const result = await send({
        amount_usd: amountUsd,
        target_currency: targetCurrency,
        recipient_name: recipientName,
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).unwrap();
      setSuccess('Transaction successful!');
      setCalcResult(null);
      setAmountUsd('');
      setRecipientName('');
    } catch (err) {
      setError(err?.data?.detail || 'Transaction failed. Please try again.');
    }
  };

  // Helper to render all rates
  const renderRates = () => {
    if (isRatesLoading) {
      return <div className="text-center mb-3"><CircularProgress size={24} /></div>;
    }
    if (!rates || !Array.isArray(rates)) return null;
    return (
      <Card style={{ borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <CardContent>
          <Typography variant="h6" color="primary" align="center" gutterBottom>
            Current Exchange Rates
          </Typography>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            {rates.map((rateObj) => (
              <div key={rateObj.currency_code} style={{ background: '#f8f9fa', borderRadius: 12, padding: '12px 24px', minWidth: 120, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                {/* Only show currency_code and rate_to_usd, no id */}
                <Typography variant="subtitle1" color="textSecondary" style={{ fontWeight: 600 }}>{rateObj.currency_code}</Typography>
                <Typography variant="h6" color="primary" style={{ fontWeight: 700 }}>{rateObj.rate_to_usd}</Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: 48 }}>
      {renderRates()}
      <Card style={{ borderRadius: 24, boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Send Money
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" gutterBottom>
            Transfer funds securely to your loved ones in the UK or South Africa.
          </Typography>
          {error && <Alert severity="error" className="mb-3">{error}</Alert>}
          {success && <Alert severity="success" className="mb-3">{success}</Alert>}
          <form onSubmit={calcResult ? handleSend : handleCalculate} className="mt-4">
            <div className="mb-3">
              <label htmlFor="amountUsd" className="form-label">Amount (USD)</label>
              <input
                id="amountUsd"
                type="number"
                className="form-control"
                value={amountUsd}
                onChange={e => setAmountUsd(e.target.value)}
                required
                min={1}
                step={0.01}
                placeholder="Enter amount in USD"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="targetCurrency" className="form-label">Target Currency</label>
              <select
                id="targetCurrency"
                className="form-control"
                value={targetCurrency}
                onChange={e => setTargetCurrency(e.target.value)}
                required
              >
                {currencyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="recipientName" className="form-label">Recipient Name</label>
              <input
                id="recipientName"
                type="text"
                className="form-control"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                required
                placeholder="Full name of recipient"
              />
            </div>

            {calcResult && (
              <div className="mb-3 p-3 bg-light rounded">
                <Typography variant="body2" color="textSecondary">
                  <strong>Fee:</strong> {calcResult.fee_amount} USD<br />
                  <strong>Exchange Rate:</strong> {calcResult.exchange_rate}<br />
                  <strong>Final Amount:</strong> {calcResult.final_amount} {targetCurrency}
                </Typography>
              </div>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={isCalculating || isSending}
              style={{ borderRadius: 24, fontWeight: 600, fontSize: '1.1rem', minHeight: 48, marginTop: 8 }}
              startIcon={(isCalculating || isSending) ? <CircularProgress size={22} color="inherit" /> : null}
            >
              {calcResult ? (isSending ? 'Sending...' : 'Send Money') : (isCalculating ? 'Calculating...' : 'Calculate')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TransferPage;
