import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  Savings,
  Add,
  Visibility,
} from '@mui/icons-material';
import { Account } from '../services/api';

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration
        setAccounts([
          { id: '1', name: 'Chase Total Checking', type: 'checking', balance: 5420.50, currency: 'USD' },
          { id: '2', name: 'Chase Savings', type: 'savings', balance: 12890.75, currency: 'USD' },
          { id: '3', name: 'Chase Freedom Credit Card', type: 'credit', balance: -1250.00, currency: 'USD' },
          { id: '4', name: 'Wells Fargo Checking', type: 'checking', balance: 2180.25, currency: 'USD' },
          { id: '5', name: 'Discover Credit Card', type: 'credit', balance: -650.00, currency: 'USD' },
        ]);
      } catch (err: any) {
        setError('Failed to load accounts');
        console.error('Accounts error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <AccountBalance sx={{ color: 'primary.main', fontSize: 40 }} />;
      case 'savings':
        return <Savings sx={{ color: 'success.main', fontSize: 40 }} />;
      case 'credit':
        return <CreditCard sx={{ color: 'warning.main', fontSize: 40 }} />;
      default:
        return <AccountBalance sx={{ color: 'primary.main', fontSize: 40 }} />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return 'primary';
      case 'savings':
        return 'success';
      case 'credit':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getBalanceColor = (balance: number, type: string) => {
    if (type === 'credit') {
      return balance < 0 ? 'warning.main' : 'success.main';
    }
    return balance >= 0 ? 'success.main' : 'error.main';
  };

  const formatBalance = (balance: number, type: string) => {
    const absBalance = Math.abs(balance);
    if (type === 'credit') {
      return balance < 0 ? `$${absBalance.toFixed(2)}` : `$0.00`;
    }
    return `$${balance.toFixed(2)}`;
  };

  const handleConnectBank = () => {
    setConnectDialogOpen(true);
  };

  const handleConnectDialogClose = () => {
    setConnectDialogOpen(false);
  };

  const totalAssets = accounts
    .filter(acc => acc.type !== 'credit')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const totalDebt = Math.abs(accounts
    .filter(acc => acc.type === 'credit')
    .reduce((sum, acc) => sum + Math.min(acc.balance, 0), 0));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          My Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleConnectBank}
          sx={{ px: 3 }}
        >
          Connect Bank Account
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Assets
            </Typography>
            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across {accounts.filter(acc => acc.type !== 'credit').length} accounts
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Debt
            </Typography>
            <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
              ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across {accounts.filter(acc => acc.type === 'credit').length} credit accounts
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Account Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
        {accounts.map((account) => (
          <Card key={account.id} sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ pb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getAccountIcon(account.type)}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                      {account.name}
                    </Typography>
                    <Chip
                      label={account.type.charAt(0).toUpperCase() + account.type.slice(1)}
                      size="small"
                      color={getAccountTypeColor(account.type) as any}
                      sx={{ mt: 0.5 }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {account.type === 'credit' ? 'Outstanding Balance' : 'Available Balance'}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: getBalanceColor(account.balance, account.type),
                  }}
                >
                  {formatBalance(account.balance, account.type)}
                </Typography>
                {account.type === 'credit' && account.balance < 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Credit limit: $5,000.00
                  </Typography>
                )}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  startIcon={<Visibility />}
                  onClick={() => window.location.href = `/transactions?account=${account.id}`}
                >
                  View Transactions
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Connect Bank Dialog */}
      <Dialog open={connectDialogOpen} onClose={handleConnectDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Connect Your Bank Account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Connect your bank account securely through our Open Banking integration powered by Plaid.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Your data is encrypted and secure<br />
            • We never store your banking credentials<br />
            • You can disconnect at any time<br />
            • Supports 11,000+ financial institutions
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConnectDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleConnectDialogClose}>
            Connect with Plaid
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
