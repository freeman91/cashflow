import React from 'react';

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
      size='small'
      sx={{
        width: 100,
        fontWeight: 'bold',
        border: `1px solid ${color}`,
        backgroundColor: 'transparent',
        color,
      }}
    />
  );
}
