import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogoImg from '../../components/LogoImg';
import topo from './topography.svg';

// Combined layout to reduce duplication for mobile and desktop
const LandingContent = ({ theme, handleGetStarted, isMobile }) => {
  // fall back to gradientBackground if provided, otherwise original linear gradient
  // Use svg mask for color overlay if gradientBackground not provided
  const commonButton = {
    bgcolor: 'green.400',
    color: 'black',
    fontWeight: 'bold',
    px: 6,
    py: 1.5,
    fontSize: isMobile ? '1rem' : '1.1rem',
    '&:hover': {
      bgcolor: 'green.600',
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        position: 'relative',
        backgroundColor: theme.palette.surface[200],
        overflow: 'hidden',
      }}
    >
      {/* green mask layer using svg */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: theme.palette.green[600],
          maskImage: `url(${topo})`,
          WebkitMaskImage: `url(${topo})`,
          maskSize: 'cover',
          WebkitMaskSize: 'cover',
          maskRepeat: 'no-repeat',
          WebkitMaskRepeat: 'no-repeat',
          maskPosition: 'center',
          WebkitMaskPosition: 'center',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? 0 : 0,
          width: '100%',
          height: '100%',
        }}
      >
        {isMobile && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
            <LogoImg />
          </Box>
        )}
        <Box
          sx={{
            textAlign: 'center',
            color: 'white',
            px: isMobile ? 2 : 4,
            maxWidth: isMobile ? '90%' : 600,
            mx: 'auto',
          }}
        >
        <Typography
          variant='h2'
          component='h1'
          fontWeight='bold'
          mb={3}
          sx={{
            fontSize: isMobile ? '2.5rem' : '3.5rem',
          }}
        >
          CashFlow
        </Typography>

        <Typography
          variant='h6'
          sx={{
            mb: 4,
            opacity: 0.95,
            fontSize: isMobile ? '1.1rem' : '1.25rem',
            lineHeight: 1.6,
            maxWidth: isMobile ? '90%' : 600,
            mx: isMobile ? 'auto' : 'auto',
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
          sx={commonButton}
        >
          Login
        </Button>

        </Box>
      </Box>
    </Box>
  );
};

export default function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleGetStarted = () => {
    navigate('/app/dashboard');
  };

  return (
    <LandingContent
      theme={theme}
      handleGetStarted={handleGetStarted}
      isMobile={isMobile}
    />
  );
}
