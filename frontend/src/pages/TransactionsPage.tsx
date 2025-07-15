import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { Transaction } from '../services/api';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // Mock data for demonstration
        const mockTransactions: Transaction[] = [
          { id: '1', accountId: '1', amount: -85.30, description: 'Whole Foods Market', category: 'Food', date: '2025-07-05', type: 'debit' },
          { id: '2', accountId: '1', amount: -45.00, description: 'Shell Gas Station', category: 'Transportation', date: '2025-07-04', type: 'debit' },
          { id: '3', accountId: '2', amount: 2500.00, description: 'Salary Deposit - ABC Corp', category: 'Income', date: '2025-07-01', type: 'credit' },
          { id: '4', accountId: '1', amount: -120.00, description: 'Pacific Gas & Electric', category: 'Bills', date: '2025-06-30', type: 'debit' },
          { id: '5', accountId: '3', amount: -75.50, description: 'Olive Garden', category: 'Food', date: '2025-06-29', type: 'debit' },
          { id: '6', accountId: '1', amount: -25.99, description: 'Netflix', category: 'Entertainment', date: '2025-06-28', type: 'debit' },
          { id: '7', accountId: '1', amount: -12.50, description: 'Starbucks', category: 'Food', date: '2025-06-27', type: 'debit' },
          { id: '8', accountId: '2', amount: 500.00, description: 'Transfer from Checking', category: 'Transfer', date: '2025-06-26', type: 'credit' },
          { id: '9', accountId: '1', amount: -500.00, description: 'Transfer to Savings', category: 'Transfer', date: '2025-06-26', type: 'debit' },
          { id: '10', accountId: '1', amount: -89.99, description: 'Target', category: 'Shopping', date: '2025-06-25', type: 'debit' },
          { id: '11', accountId: '1', amount: -35.00, description: 'Uber', category: 'Transportation', date: '2025-06-24', type: 'debit' },
          { id: '12', accountId: '3', amount: -150.00, description: 'Amazon Purchase', category: 'Shopping', date: '2025-06-23', type: 'debit' },
          { id: '13', accountId: '1', amount: -8.50, description: 'Subway', category: 'Food', date: '2025-06-22', type: 'debit' },
          { id: '14', accountId: '1', amount: -65.00, description: 'Gym Membership', category: 'Health', date: '2025-06-21', type: 'debit' },
          { id: '15', accountId: '1', amount: -42.30, description: 'Chevron', category: 'Transportation', date: '2025-06-20', type: 'debit' },
        ];
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
      } catch (err: any) {
        setError('Failed to load transactions');
        console.error('Transactions error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.category === categoryFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === typeFilter);
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchTerm, categoryFilter, typeFilter]);

  const categories = Array.from(new Set(transactions.map(t => t.category)));
  
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'orange',
      'Transportation': 'blue',
      'Bills': 'red',
      'Entertainment': 'purple',
      'Shopping': 'green',
      'Income': 'success',
      'Transfer': 'info',
      'Health': 'warning',
    };
    return colors[category] || 'default';
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV file
    alert('Export functionality would be implemented here');
  };

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
          Transactions
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
        >
          Export
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Total Transactions
            </Typography>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {filteredTransactions.length}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
              Total Income
            </Typography>
            <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
              ${filteredTransactions
                .filter(t => t.type === 'credit')
                .reduce((sum, t) => sum + t.amount, 0)
                .toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingDown sx={{ mr: 1, color: 'error.main' }} />
              Total Expenses
            </Typography>
            <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 'bold' }}>
              ${Math.abs(filteredTransactions
                .filter(t => t.type === 'debit')
                .reduce((sum, t) => sum + t.amount, 0))
                .toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ minWidth: 250 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                label="Type"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="credit">Income</MenuItem>
                <MenuItem value="debit">Expenses</MenuItem>
              </Select>
            </FormControl>
            
            <Button
              startIcon={<FilterList />}
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {transaction.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={transaction.category}
                        size="small"
                        color={getCategoryColor(transaction.category) as any}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'bold',
                          color: transaction.type === 'credit' ? 'success.main' : 'error.main',
                        }}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionsPage;
