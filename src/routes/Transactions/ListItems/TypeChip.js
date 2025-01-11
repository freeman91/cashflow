import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Chip from '@mui/material/Chip';
import { findColor } from '../../../helpers/transactions';

export default function TypeChip(props) {
  const { type } = props;
  const theme = useTheme();
  return (
    <Chip
      label={type}
      sx={{
        width: '100%',
        fontWeight: 'bold',
        backgroundColor: findColor(type, theme),
      }}
    />
  );
}
