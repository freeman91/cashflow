import React from 'react';

import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';

export default function CategorySummary({ category, updateGoal }) {
  const handleChange = (e) => {
    let value = e.target.value;
    value = Number(value);
    if (!isNaN(value)) {
      value = Number(value).toFixed(0);
      updateGoal(category.category, value);
    }
  };

  return (
    <>
      <ListItem disableGutters>
        <ListItemText
          secondary={category.category}
          secondaryTypographyProps={{
            align: 'left',
            fontWeight: 'bold',
            variant: 'body1',
          }}
        />
        <TextField
          variant='standard'
          inputProps={{ style: { textAlign: 'right' } }}
          value={category.goal}
          onChange={handleChange}
          sx={{ width: '35%' }}
          InputProps={{
            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
          }}
        />
      </ListItem>
    </>
  );
}
