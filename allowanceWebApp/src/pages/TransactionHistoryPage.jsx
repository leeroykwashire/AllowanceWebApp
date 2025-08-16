import React, { useState } from 'react';
import { useHistoryQuery } from '../store/slices/transactionApiSlice';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import dayjs from "dayjs";

const TransactionHistoryPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useHistoryQuery(page);
  const transactions = data?.transactions || [];
  const totalPages = data?.total_pages || 1;
  const currentPage = data?.current_page || page;
  const hasNext = data?.has_next || false;
  const hasPrevious = data?.has_previous || false;



  return (
    <Container maxWidth="md" style={{ marginTop: 48 }}>
      <Card style={{ borderRadius: 24, boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Transaction History
          </Typography>
          {isLoading && <div className="text-center my-4"><CircularProgress size={32} /></div>}
          {error && <Alert severity="error" className="mb-3">Failed to load transactions.</Alert>}
          {!isLoading && !error && transactions.length === 0 && (
            <Typography variant="body1" color="textSecondary" align="center" className="my-4">
              No transactions found.
            </Typography>
          )}
          {!isLoading && transactions.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
                <thead style={{ background: '#f5f5f5' }}>
                  <tr>
                    <th style={{ minWidth: 120 }}>Date</th>
                    <th style={{ minWidth: 120 }}>Recipient</th>
                    <th style={{ minWidth: 110 }}>Amount (USD)</th>
                    <th style={{ minWidth: 90 }}>Currency</th>
                    <th style={{ minWidth: 120 }}>Exchange Rate</th>
                    <th style={{ minWidth: 130 }}>Final Amount</th>
                    <th style={{ minWidth: 100 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => {
                    const rawDate = tx.date || tx.created_at;
                    const formattedDate = rawDate ? dayjs(rawDate).format('MMM D, YYYY, HH:mm') : '-';
                    return (
                      <tr key={tx.id || tx.transaction_id} style={{ verticalAlign: 'middle' }}>
                        <td>{formattedDate}</td>
                        <td>{tx.recipient_name || '-'}</td>
                        <td><span style={{ fontWeight: 500 }}>${tx.amount_usd || '-'}</span></td>
                        <td>{tx.target_currency || '-'}</td>
                        <td>{tx.exchange_rate || '-'}</td>
                        <td>{tx.final_amount ? `${tx.final_amount} ${tx.target_currency}` : '-'}</td>
                        <td>
                          <span className={`badge bg-${tx.status === 'Completed' ? 'success' : 'secondary'}`}>{tx.status || 'Completed'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
              <Button
                variant="outlined"
                color="primary"
                disabled={!hasPrevious}
                onClick={() => setPage(currentPage - 1)}
                style={{ borderRadius: 18 }}
              >
                Previous
              </Button>
              <Typography variant="body2" color="textSecondary" style={{ minWidth: 60, textAlign: 'center' }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                disabled={!hasNext}
                onClick={() => setPage(currentPage + 1)}
                style={{ borderRadius: 18 }}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TransactionHistoryPage;
