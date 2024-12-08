import React from 'react';

import { useTheme } from '@emotion/react';
import IconButton from '@mui/material/IconButton';

export default function CustomIconButton(props) {
  const { color, orientation, children } = props;
  const theme = useTheme();
  const deg = orientation === 'left' ? '-45deg' : '45deg';
  return (
    <IconButton
      sx={{
        color: color,
        background: `linear-gradient(${deg}, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
        boxShadow: 6,
        borderRadius: '50%',
        p: '4px',
      }}
    >
      {children}
    </IconButton>
  );
}
