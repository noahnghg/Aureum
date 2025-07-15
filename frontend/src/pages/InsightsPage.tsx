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
  LinearProgress,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingDown,
  Lightbulb,
  Warning,
  CheckCircle,
  Psychology,
  Savings,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FinancialInsight } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`insights-tabpanel-${index}`}
      aria-labelledby={`insights-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const InsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<FinancialInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        // Mock insights data
        setInsights([
          {
            id: '1',
            type: 'spending',
            title: 'High Food Spending Alert',
            description: 'You spent $285 on food this month, which is 23% more than your average. Consider meal planning or cooking at home more often to reduce expenses.',
            actionable: true,
            priority: 'high'
          },
          {
            id: '2',
            type: 'saving',
            title: 'Excellent Savings Progress',
            description: 'Congratulations! You saved $500 this month, reaching 20% of your income. You\'re on track to meet your annual savings goal.',
            actionable: false,
            priority: 'low'
          },
          {
            id: '3',
            type: 'investment',
            title: 'Investment Opportunity',
            description: 'Your emergency fund has reached 6 months of expenses. Consider investing your surplus cash in index funds or ETFs for long-term growth.',
            actionable: true,
            priority: 'medium'
          },
          {
            id: '4',
            type: 'spending',
            title: 'Subscription Optimization',
            description: 'You have 8 active subscriptions totaling $89/month. Review and cancel unused subscriptions to save money.',
            actionable: true,
            priority: 'medium'
          },
          {
            id: '5',
            type: 'saving',
            title: 'Budget Category Alert',
            description: 'You\'ve exceeded your entertainment budget by $45 this month. Consider adjusting your spending in this category.',
            actionable: true,
            priority: 'medium'
          },
        ]);
      } catch (err: any) {
        setError('Failed to load insights');
        console.error('Insights error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  // Mock data for charts
  const spendingTrends = [
    { month: 'Jan', amount: 2400 },
    { month: 'Feb', amount: 2100 },
    { month: 'Mar', amount: 2600 },
    { month: 'Apr', amount: 2300 },
    { month: 'May', amount: 2800 },
    { month: 'Jun', amount: 2650 },
  ];

  const budgetData = [
    { category: 'Food', spent: 285, budget: 300, percentage: 95 },
    { category: 'Transportation', spent: 180, budget: 250, percentage: 72 },
    { category: 'Entertainment', spent: 145, budget: 100, percentage: 145 },
    { category: 'Shopping', spent: 320, budget: 400, percentage: 80 },
    { category: 'Bills', spent: 850, budget: 900, percentage: 94 },
  ];

  const savingsGoals = [
    { goal: 'Emergency Fund', current: 12000, target: 15000, percentage: 80 },
    { goal: 'Vacation', current: 2500, target: 5000, percentage: 50 },
    { goal: 'New Car', current: 8000, target: 20000, percentage: 40 },
    { goal: 'Home Down Payment', current: 25000, target: 50000, percentage: 50 },
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      case 'saving':
        return <Savings sx={{ color: 'success.main' }} />;
      case 'investment':
        return <TrendingUpOutlined sx={{ color: 'primary.main' }} />;
      default:
        return <Psychology sx={{ color: 'info.main' }} />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Warning sx={{ color: 'error.main', fontSize: 20 }} />;
      case 'medium':
        return <Lightbulb sx={{ color: 'warning.main', fontSize: 20 }} />;
      case 'low':
        return <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />;
      default:
        return <Lightbulb sx={{ color: 'info.main', fontSize: 20 }} />;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Financial Insights & Analytics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="AI Insights" />
          <Tab label="Spending Analytics" />
          <Tab label="Savings Progress" />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        {/* AI Insights */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
          {insights.map((insight) => (
            <Card key={insight.id}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ mr: 2 }}>
                    {getInsightIcon(insight.type)}
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {insight.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getPriorityIcon(insight.priority)}
                        <Chip
                          label={insight.priority}
                          size="small"
                          color={insight.priority === 'high' ? 'error' : insight.priority === 'medium' ? 'warning' : 'success'}
                        />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {insight.description}
                    </Typography>
                    {insight.actionable && (
                      <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                        Take Action
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        {/* Spending Analytics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Spending Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={spendingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Spending']} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Budget vs Actual Spending
              </Typography>
              <Box sx={{ mt: 2 }}>
                {budgetData.map((item) => (
                  <Box key={item.category} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {item.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.spent} / ${item.budget}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(item.percentage, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.percentage > 100 ? 'error.main' : 
                                         item.percentage > 80 ? 'warning.main' : 'success.main'
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {item.percentage}% of budget
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        {/* Savings Progress */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
          {savingsGoals.map((goal) => (
            <Card key={goal.goal}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {goal.goal}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    ${goal.current.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Goal: ${goal.target.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={goal.percentage}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    mb: 1,
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    {goal.percentage}% complete
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${(goal.target - goal.current).toLocaleString()} remaining
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default InsightsPage;
