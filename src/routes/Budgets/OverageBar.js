import React from 'react';

import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function OverageBar({ expenseSum, goal, barMax = null }) {
  const diff = goal - expenseSum;
  const _barMax = barMax || Math.max(expenseSum, goal, 100);
  if (diff >= 0) return null;
  return (
    <Box
      sx={{
        width: `${((diff * -1) / _barMax) * 100}%`,
        height: 15,
        backgroundImage: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.error.main}, ${darken(
            theme.palette.error.main,
            0.4
          )})`,
        borderRadius: !goal ? '4px' : '0 4px 4px 0',
      }}
    />
  );
}
