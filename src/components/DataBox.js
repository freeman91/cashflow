import React from 'react';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';

export default function DataBox(props) {
  const { label, value, onClick } = props;
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        background: `linear-gradient(0deg, ${theme.palette.surface[250]}, ${theme.palette.surface[300]})`,
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: '4px',
        width: '100%',
        px: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <BoxFlexCenter>{label}</BoxFlexCenter>
        <BoxFlexCenter>
          <Typography variant='h6' color='grey.10'>
            $
          </Typography>
          <Typography variant='h6' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    </Box>
  );
}
