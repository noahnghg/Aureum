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
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  Insights,
  CreditCard,
  AttachMoney,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Account, Transaction, FinancialInsight } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // For now, use mock data since backend services aren't fully implemented
        setAccounts([
          { id: '1', name: 'Chase Checking', type: 'checking', balance: 5420.50, currency: 'USD' },
          { id: '2', name: 'Savings Account', type: 'savings', balance: 12890.75, currency: 'USD' },
          { id: '3', name: 'Credit Card', type: 'credit', balance: -1250.00, currency: 'USD' },
        ]);

        setTransactions([
          { id: '1', accountId: '1', amount: -85.30, description: 'Grocery Store', category: 'Food', date: '2025-07-05', type: 'debit' },
          { id: '2', accountId: '1', amount: -45.00, description: 'Gas Station', category: 'Transportation', date: '2025-07-04', type: 'debit' },
          { id: '3', accountId: '2', amount: 2500.00, description: 'Salary Deposit', category: 'Income', date: '2025-07-01', type: 'credit' },
          { id: '4', accountId: '1', amount: -120.00, description: 'Utility Bill', category: 'Bills', date: '2025-06-30', type: 'debit' },
          { id: '5', accountId: '3', amount: -75.50, description: 'Restaurant', category: 'Food', date: '2025-06-29', type: 'debit' },
        ]);

        setInsights([
          { id: '1', type: 'spending', title: 'High Food Spending', description: 'You spent 15% more on food this month compared to last month.', actionable: true, priority: 'medium' },
          { id: '2', type: 'saving', title: 'Great Savings Rate', description: 'You saved 20% of your income this month!', actionable: false, priority: 'low' },
          { id: '3', type: 'investment', title: 'Consider Investment', description: 'Your emergency fund is sufficient. Consider investing surplus cash.', actionable: true, priority: 'high' },
        ]);
      } catch (err: any) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBalance = accounts
    .filter(acc => acc.type !== 'credit')
    .reduce((sum, acc) => sum + acc.balance, 0);

  const creditTotal = accounts
    .filter(acc => acc.type === 'credit')
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0);

  const spendingByCategory = transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      return acc;
    }, {} as Record<string, number>);

  const categoryData = Object.entries(spendingByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value * 100) / 100,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const recentTransactionsData = transactions.slice(0, 7).map((t, index) => ({
    day: `Day ${7 - index}`,
    amount: Math.abs(t.amount),
    type: t.type,
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Welcome back, {user?.firstName}! 👋
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Financial Overview Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance sx={{ color: 'primary.main', mr: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                Total Balance
              </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5, color: 'success.main' }} />
              +2.5% from last month
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CreditCard sx={{ color: 'warning.main', mr: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                Credit Used
              </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
              ${creditTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              25% of credit limit
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                Monthly Spending
              </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              ${Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This month
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
              <Typography color="text.secondary" gutterBottom>
                Savings Rate
              </Typography>
            </Box>
            <Typography variant="h5" component="div" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              20%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Of monthly income
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Spending by Category Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Spending by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity Chart */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transaction Activity
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentTransactionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Insights sx={{ mr: 1 }} />
              AI Insights
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {insights.map((insight) => (
                <Box key={insight.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {insight.title}
                    </Typography>
                    <Chip
                      label={insight.priority}
                      size="small"
                      color={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'success'}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {insight.description}
                  </Typography>
                  {insight.actionable && (
                    <Button size="small" variant="outlined">
                      Take Action
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Transactions
            </Typography>
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {transactions.slice(0, 5).map((transaction) => (
                <Box key={transaction.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {transaction.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                    }}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Button fullWidth sx={{ mt: 2 }} onClick={() => window.location.href = '/transactions'}>
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
