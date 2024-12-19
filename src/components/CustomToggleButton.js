import React from 'react';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import ToggleButton from '@mui/material/ToggleButton';

export default function CustomToggleButton(props) {
  const theme = useTheme();

  const selectedColor1 = alpha(theme.palette.primary.main, 0.3);
  const selectedColor2 = alpha(theme.palette.primary.main, 0.1);
  const unselectedColor1 = alpha(theme.palette.surface[250], 0.8);
  const unselectedColor2 = alpha(theme.palette.surface[250], 0.4);
  return (
    <ToggleButton
      {...props}
      sx={{
        py: 0.5,
        color: 'text.secondary',
        borderColor: theme.palette.surface[250],
        fontWeight: 'bold',
        fontSize: '1rem',
        backgroundImage: (theme) =>
          `linear-gradient(to top, ${unselectedColor1}, ${unselectedColor2})`,
        '&.Mui-selected': {
          backgroundImage: `linear-gradient(to bottom, ${selectedColor1}, ${selectedColor2})`,
        },
      }}
    />
  );
}
