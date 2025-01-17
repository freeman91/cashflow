import React from 'react';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Chip from '@mui/material/Chip';
import { findColor } from '../../../helpers/transactions';

export default function TypeChip(props) {
  const { type } = props;
  const theme = useTheme();
  const color = findColor(type, theme);
  return (
    <Chip
      label={type}
      sx={{
        width: 100,
        fontWeight: 'bold',
        backgroundImage: `linear-gradient(to bottom, ${alpha(
          color,
          0.5
        )}, ${alpha(color, 1)})`,
        color: 'white',
      }}
    />
  );
}
