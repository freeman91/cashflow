import React, { useState } from 'react';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { AppBarTab, AppBarTabs } from '../../components/AppBarTabs';
import RangeSelect from '../../components/Selector/RangeSelect';
import TransactionTypeSelect from '../../components/Selector/TransactionTypeSelect';
import DesktopTransactionsTable from './Table';
import DesktopTransactionsCalendar from './Calendar';

export default function DesktopTransactions() {
  const [tab, setTab] = useState('calendar');
  const [types, setTypes] = useState([]);
  const [month, setMonth] = useState(dayjs());
  const [range, setRange] = useState({
    id: 2,
    label: 'Custom Range',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(3, 'day'),
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
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
          Transactions
        </Typography>
        <AppBarTabs value={tab} onChange={handleTabChange} sx={{ flexGrow: 1 }}>
          <AppBarTab label='Calendar' value='calendar' />
          <AppBarTab label='List' value='list' />
        </AppBarTabs>
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        px={2}
        sx={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
      >
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              py: 1,
              boxShadow: (theme) => theme.shadows[4],
            }}
          >
            <Stack
              direction='row'
              sx={{ mx: 2 }}
              alignItems='center'
              divider={<Divider orientation='vertical' flexItem />}
            >
              <Box
                sx={{
                  width: 250,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {tab === 'list' ? (
                  <RangeSelect range={range} setRange={setRange} />
                ) : (
                  <DatePicker
                    openTo='month'
                    views={['year', 'month']}
                    value={month}
                    onChange={(newValue) => setMonth(newValue)}
                    slotProps={{
                      textField: {
                        variant: 'standard',
                        inputProps: {
                          readOnly: true,
                        },
                        InputProps: { disableUnderline: true },
                      },
                    }}
                    sx={{ pr: 2 }}
                  />
                )}
              </Box>
              <TransactionTypeSelect types={types} setTypes={setTypes} />
            </Stack>
          </Box>
        </Grid>

        {tab === 'calendar' ? (
          <DesktopTransactionsCalendar month={month} types={types} />
        ) : (
          <DesktopTransactionsTable range={range} types={types} />
        )}
        <Grid size={{ xs: 12 }} mb={5} />
      </Grid>
    </Box>
  );
}
