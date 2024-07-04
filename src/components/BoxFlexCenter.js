import React from 'react';
import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';

export default function BoxFlexCenter({
  bgDark,
  justifyContent = 'center',
  sx,
  children,
}) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent,
        background: bgDark
          ? `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`
          : 'unset',
        boxShadow: bgDark ? 6 : 'unset',
        borderRadius: bgDark ? '5px' : 'unset',
        p: bgDark ? 1 : 'unset',
        px: bgDark ? 2 : 'unset',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
