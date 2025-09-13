import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';

import AccountBalance from '@mui/icons-material/AccountBalance';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import Assessment from '@mui/icons-material/Assessment';
import AttachMoney from '@mui/icons-material/AttachMoney';
import CreditCard from '@mui/icons-material/CreditCard';
import Home from '@mui/icons-material/Home';
import PieChart from '@mui/icons-material/PieChart';
import Savings from '@mui/icons-material/Savings';
import Schedule from '@mui/icons-material/Schedule';
import Security from '@mui/icons-material/Security';
import Timeline from '@mui/icons-material/Timeline';
import TrendingUp from '@mui/icons-material/TrendingUp';

const FeatureCard = ({ icon: Icon, title, description, color = 'primary' }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}.main`,
              color: 'white',
              mr: 2,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant='h6' component='h3' fontWeight='bold'>
            {title}
          </Typography>
        </Box>
        <Typography variant='body2' color='text.secondary' lineHeight={1.6}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ value, label, color = 'primary' }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 3,
        textAlign: 'center',
        bgcolor: 'surface.150',
        border: `1px solid ${theme.palette.surface[300]}`,
      }}
    >
      <Typography
        variant='h4'
        component='div'
        fontWeight='bold'
        color={`${color}.main`}
        mb={1}
      >
        {value}
      </Typography>
      <Typography variant='body2' color='text.secondary'>
        {label}
      </Typography>
    </Paper>
  );
};

export default function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: AccountBalance,
      title: 'Comprehensive Account Management',
      description:
        'Track checking, savings, investments, real estate, vehicles, and more. Support for all major account types including 401k, Roth IRA, crypto, and digital wallets.',
      color: 'primary',
    },
    {
      icon: TrendingUp,
      title: 'Real-time Investment Tracking',
      description:
        'Monitor stocks, crypto, mutual funds, and ETFs with automatic price updates. Track your portfolio performance and investment gains.',
      color: 'success',
    },
    {
      icon: Assessment,
      title: 'Advanced Reporting & Analytics',
      description:
        'Generate detailed financial reports, expense breakdowns, income analysis, and net worth tracking with beautiful charts and visualizations.',
      color: 'orange',
    },
    {
      icon: Schedule,
      title: 'Automated Recurring Transactions',
      description:
        'Set up recurring expenses, incomes, paychecks, and loan payments. Automatically generate transactions for predictable cash flow.',
      color: 'primary',
    },
    {
      icon: PieChart,
      title: 'Smart Budgeting Tools',
      description:
        'Create monthly budgets, track spending by category, and monitor your financial progress with intuitive budget management.',
      color: 'success',
    },
    {
      icon: Timeline,
      title: 'Net Worth Tracking',
      description:
        'Monitor your financial growth over time with comprehensive net worth calculations and historical value tracking.',
      color: 'orange',
    },
  ];

  const accountTypes = [
    {
      icon: AccountBalanceWallet,
      label: 'Checking & Savings',
      color: 'primary',
    },
    { icon: CreditCard, label: 'Credit Cards', color: 'error' },
    { icon: Savings, label: 'Investment Accounts', color: 'success' },
    { icon: Home, label: 'Real Estate', color: 'orange' },
    { icon: AttachMoney, label: 'Loans & Mortgages', color: 'warning' },
    { icon: Security, label: 'Crypto & Securities', color: 'info' },
  ];

  const handleGetStarted = () => {
    navigate('/app/dashboard');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={4} alignItems='center'>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant='h2'
                component='h1'
                fontWeight='bold'
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                }}
              >
                Take Control of Your
                <Box component='span' sx={{ color: 'yellow.main', ml: 1 }}>
                  Financial Future
                </Box>
              </Typography>
              <Typography
                variant='h6'
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                }}
              >
                Comprehensive personal finance management with real-time
                tracking, automated transactions, and powerful analytics to help
                you achieve your financial goals.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mb: 4 }}
              >
                <Button
                  variant='contained'
                  size='large'
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: 'yellow.main',
                    color: 'black',
                    fontWeight: 'bold',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'yellow.dark',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  variant='outlined'
                  size='large'
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  View Demo
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: { xs: 300, md: 400 },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 500,
                    height: '100%',
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant='h4' sx={{ opacity: 0.8 }}>
                    📊 Dashboard Preview
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth='lg' sx={{ py: 6 }}>
        <Typography
          variant='h4'
          component='h2'
          textAlign='center'
          fontWeight='bold'
          mb={4}
        >
          Trusted by Thousands of Users
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard value='$2.5M+' label='Assets Tracked' color='success' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              value='50K+'
              label='Transactions Processed'
              color='primary'
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard value='99.9%' label='Uptime' color='success' />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard value='24/7' label='Support' color='orange' />
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'surface.100', py: 8 }}>
        <Container maxWidth='lg'>
          <Typography
            variant='h4'
            component='h2'
            textAlign='center'
            fontWeight='bold'
            mb={2}
          >
            Everything You Need to Manage Your Finances
          </Typography>
          <Typography
            variant='h6'
            textAlign='center'
            color='text.secondary'
            mb={6}
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            From basic budgeting to advanced investment tracking, CashFlow
            provides all the tools you need for comprehensive financial
            management.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
                <FeatureCard {...feature} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Account Types Section */}
      <Container maxWidth='lg' sx={{ py: 8 }}>
        <Typography
          variant='h4'
          component='h2'
          textAlign='center'
          fontWeight='bold'
          mb={2}
        >
          Support for All Account Types
        </Typography>
        <Typography
          variant='h6'
          textAlign='center'
          color='text.secondary'
          mb={6}
        >
          Track every aspect of your financial life
        </Typography>
        <Grid container spacing={3}>
          {accountTypes.map((account, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${account.color}.main`,
                      color: 'white',
                    }}
                  >
                    <account.icon sx={{ fontSize: 32 }} />
                  </Box>
                </Box>
                <Typography variant='h6' fontWeight='bold'>
                  {account.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.surface[200]} 0%, ${theme.palette.surface[300]} 100%)`,
          py: 8,
        }}
      >
        <Container maxWidth='md'>
          <Box textAlign='center'>
            <Typography variant='h3' component='h2' fontWeight='bold' mb={3}>
              Ready to Transform Your Financial Life?
            </Typography>
            <Typography
              variant='h6'
              color='text.secondary'
              mb={4}
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Join thousands of users who have taken control of their finances
              with CashFlow. Start tracking, budgeting, and growing your wealth
              today.
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent='center'
            >
              <Button
                variant='contained'
                size='large'
                onClick={handleGetStarted}
                sx={{
                  bgcolor: 'primary.main',
                  fontWeight: 'bold',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                }}
              >
                Start Your Free Account
              </Button>
              <Button
                variant='outlined'
                size='large'
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: 'surface.100',
          py: 4,
          borderTop: `1px solid ${theme.palette.surface[300]}`,
        }}
      >
        <Container maxWidth='lg'>
          <Grid container spacing={4} alignItems='center'>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant='h6' fontWeight='bold' mb={1}>
                CashFlow
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Personal finance management made simple and powerful.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                  gap: 2,
                }}
              >
                <Chip label='Secure' color='success' size='small' />
                <Chip label='Real-time' color='primary' size='small' />
                <Chip label='Automated' color='orange' size='small' />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
