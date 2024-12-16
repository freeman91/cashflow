import React from 'react';

import Typography from '@mui/material/Typography';

import BoxFlexCenter from './BoxFlexCenter';
import BoxFlexColumn from './BoxFlexColumn';

export default function LabelPercentBox(props) {
  const { label, value, total } = props;

  return (
    <BoxFlexCenter
      sx={{ flexGrow: 1, gap: 0.5 }}
      justifyContent='space-between'
    >
      <BoxFlexColumn sx={{ alignItems: 'flex-start' }}>
        <Typography
          variant='body1'
          color='text.secondary'
          align='center'
          fontWeight='bold'
        >
          {label}
        </Typography>
      </BoxFlexColumn>

      <Typography variant='h6' color='white' fontWeight='bold'>
        {total === 0 ? '0%' : `${((value / total) * 100).toFixed(2)}%`}
      </Typography>
    </BoxFlexCenter>
  );
}
