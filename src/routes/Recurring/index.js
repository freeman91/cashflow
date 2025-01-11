import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { AppBarTab, AppBarTabs } from '../../components/AppBarTabs';
import RecurringCalendar from './Calendar';
import RecurringList from './List';

export default function Recurring() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('calendar');

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const createRecurring = () => {
    dispatch(openDialog({ type: 'recurring', mode: 'create' }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction='row'
        spacing={4}
        my={1.5}
        px={2}
        sx={{ width: '100%' }}
        alignItems='center'
      >
        <Typography variant='h5' fontWeight='bold' sx={{ mx: 1 }}>
          Recurring
        </Typography>
        <AppBarTabs value={tab} onChange={handleTabChange} sx={{ flexGrow: 1 }}>
          <AppBarTab label='Calendar' value='calendar' />
          <AppBarTab label='List' value='list' />
        </AppBarTabs>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={createRecurring}
        >
          Add Recurring
        </Button>
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        px={2}
        sx={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
      >
        {tab === 'list' && <RecurringList />}
        {tab === 'calendar' && <RecurringCalendar />}
        <Grid size={{ xs: 12 }} mb={5} />
      </Grid>
    </Box>
  );
}
