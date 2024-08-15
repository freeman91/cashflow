import React from 'react';
import Box from '@mui/material/Box';

export default function BoxFlexCenter({
  justifyContent = 'center',
  sx,
  children,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
