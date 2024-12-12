import React from 'react';

import Box from '@mui/material/Box';

export default function FullBar({ children }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: 15,
        display: 'flex',
        alignItems: 'flex-start',
        my: 1,
        backgroundImage: (theme) =>
          `linear-gradient(to bottom, ${theme.palette.surface[250]}, ${theme.palette.surface[300]})`,
        borderRadius: 1,
        boxShadow: (theme) => `0 0 2px ${theme.palette.surface[400]}`,
      }}
    >
      {children}
    </Box>
  );
}
