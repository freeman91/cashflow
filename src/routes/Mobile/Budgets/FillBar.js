import React from 'react';

import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function FillBar({ fillValue, goalSum, color, barMax = null }) {
  const _barMax = barMax || Math.max(fillValue, goalSum, 100);
  return (
    <Box
      sx={{
        width: `${(fillValue / _barMax) * 100}%`,
        height: '100%',
        backgroundImage: `linear-gradient(to bottom, ${color}, ${darken(
          color,
          0.4
        )})`,
      }}
    />
  );
}
