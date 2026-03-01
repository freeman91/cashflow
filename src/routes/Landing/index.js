import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';

export default function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/app/dashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      }}
    >
      <Container maxWidth='sm'>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <Typography
            variant='h2'
            component='h1'
            fontWeight='bold'
            mb={3}
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            CashFlow
          </Typography>

          <Typography
            variant='h6'
            sx={{
              mb: 4,
              opacity: 0.95,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              lineHeight: 1.6,
            }}
          >
            Comprehensive personal finance management with real-time tracking,
            automated transactions, and powerful analytics to help you take
            control of your financial future.
          </Typography>

          <Button
            variant='contained'
            size='large'
            onClick={handleGetStarted}
            sx={{
              bgcolor: 'yellow.main',
              color: 'black',
              fontWeight: 'bold',
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'yellow.dark',
              },
            }}
          >
            Enter the App
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
