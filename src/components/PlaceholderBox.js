import React from 'react';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function PlaceholderBox(props) {
  const { children, height = 250 } = props;
  return (
    <Box
      sx={{
        height,
        width: '100%',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.surface[200]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
}
