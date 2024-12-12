import React from 'react';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

export default function MonthSelectButton(props) {
  const { Icon, onClick } = props;
  const theme = useTheme();
  const lightColor = alpha(theme.palette.primary.main, 0.2);
  return (
    <Box
      sx={{
        borderRadius: '50%',
        backgroundColor: lightColor,
      }}
    >
      <IconButton size='large' onClick={onClick} sx={{ p: 0.75 }}>
        <Icon />
      </IconButton>
    </Box>
  );
}
