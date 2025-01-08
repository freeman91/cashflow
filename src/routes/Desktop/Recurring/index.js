import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Paychecks from './Paychecks';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';

export default function Recurring() {
  const allBills = useSelector((state) => state.bills.data);

  const [tab, setTab] = useState('Calendar');

  useEffect(() => {
    console.log('allBills: ', allBills);
  }, [allBills]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={1} my={1.5} px={2} sx={{ width: '100%' }}>
        <Typography variant='h5' fontWeight='bold' sx={{ flexGrow: 1, ml: 1 }}>
          Recurring
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        px={2}
        sx={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
      >
        <Grid item md={12} xs={12}>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              py: 1,
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            <Stack direction='row' sx={{ mx: 2 }} alignItems='center'>
              <StyledTabs value={tab} onChange={handleChange}>
                <StyledTab label='Calendar' value='Calendar' />
                <StyledTab label='List' value='List' />
              </StyledTabs>
            </Stack>
          </Box>
        </Grid>
        {tab === 'List' && <Paychecks />}

        <Grid item xs={12} mb={5} />
      </Grid>
    </Box>
  );
}
