import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// import { filter, get, map, reduce, sortBy } from 'lodash';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import Month from '../../components/Calendar/Month';

function Year() {
  return <div>Year</div>;
}

function Search() {
  return <div>Search</div>;
}

const VIEWS = [
  { id: 'month', component: Month },
  { id: 'year', component: Year },
  { id: 'search', component: Search },
];

export default function Expenses() {
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);

  const [expenses, setExpenses] = useState({});
  const [selectedView, setSelectedView] = useState(VIEWS[0]);

  useEffect(() => {
    setExpenses(allExpenses);
  }, [allExpenses]);

  console.log('expenses: ', expenses);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', justifyContent: 'flex-start' }}
        >
          <TextField
            fullWidth
            variant='standard'
            id='view-select'
            select
            label='view'
            value={selectedView}
            sx={{ width: 100 }}
            onChange={(e) => setSelectedView(e.target.value)}
          >
            {VIEWS.map((view) => (
              <MenuItem key={view.id} value={view}>
                {view.id}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          {React.createElement(selectedView.component)}
        </Grid>
      </Grid>
    </Box>
  );
}
