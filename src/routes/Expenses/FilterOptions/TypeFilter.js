import React from 'react';

import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export default function TypeFilter(props) {
  const { typeFilter, setTypeFilter, options } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant='body1' sx={{ width: '50%' }} align='left'>
        type
      </Typography>
      <Select
        variant='standard'
        sx={{ width: '50%' }}
        value={typeFilter}
        onChange={(e) => {
          setTypeFilter(e.target.value);
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
