import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import RangeSelect from '../../components/Selector/RangeSelect';
import TransactionTypeSelect from '../../components/Selector/TransactionTypeSelect';
import TransactionsTable from './Table';
import TransactionsCalendar from './Calendar';

export default function Transactions() {
  const tab = useSelector((state) => state.appSettings.transactions.tab);
  const [types, setTypes] = useState([]);
  const [month, setMonth] = useState(dayjs());
  const [range, setRange] = useState({
    id: 2,
    label: 'Custom Range',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(3, 'day'),
  });

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', maxWidth: '1500px', margin: 'auto', px: 1, mb: 5 }}
    >
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            py: 1,
          }}
        >
          <Stack
            direction='row'
            sx={{ mx: 2 }}
            alignItems='center'
            justifyContent='space-between'
          >
            <Box
              sx={{
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
                  sx={{ ml: 1 }}
                  slotProps={{
                    textField: {
                      variant: 'standard',
                      inputProps: {
                        readOnly: true,
                      },
                      InputProps: { disableUnderline: true },
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                  }}
                />
              )}
            </Box>
            <TransactionTypeSelect types={types} setTypes={setTypes} />
          </Stack>
        </Box>
      </Grid>

      {tab === 'calendar' ? (
        <TransactionsCalendar month={month} types={types} />
      ) : (
        <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
          <TransactionsTable range={range} types={types} />
        </Grid>
      )}
    </Grid>
  );
}
