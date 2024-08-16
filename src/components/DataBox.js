import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';

export default function DataBox(props) {
  const { label, value, onClick = null } = props;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: '4px',
        width: '100%',
        px: 1,
        cursor: onClick ? 'pointer' : 'unset',
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
        <BoxFlexCenter>
          <Typography variant='body1' color='text.secondary'>
            {label}
          </Typography>
        </BoxFlexCenter>
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
