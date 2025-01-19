import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import _range from 'lodash/range';

import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import useTransactionsInRange from '../../store/hooks/useTransactions';
import Day from './Day';
import TransactionTypeSelect from '../../components/Selector/TransactionTypeSelect';

export default function TransactionsCalendar() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [month, setMonth] = useState(dayjs());
  const [range, setRange] = useState({ start: null, end: null });
  const [types, setTypes] = useState([]);
  const days = useTransactionsInRange(types, range);

  useEffect(() => {
    let firstDayOfMonth = month.date(1).hour(12).minute(0).second(0);
    setRange({
      start: firstDayOfMonth.day(0).hour(12).minute(0).second(0),
      end: firstDayOfMonth.add(1, 'month').subtract(1, 'day').day(6),
    });
  }, [month]);

  const numWeeks = Math.ceil(days.length / 7);
  return (
    <>
      <Grid
        container
        columns={7}
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          width: '100%',
        }}
      >
        <Grid
          size={{ xs: 12 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            px: 2,
          }}
        >
          <DatePicker
            openTo='month'
            views={['year', 'month']}
            sx={{ flexGrow: 1 }}
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
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <TransactionTypeSelect types={types} setTypes={setTypes} />
          <Box sx={{ display: 'flex', gap: 2, ml: 4 }}>
            <IconButton onClick={() => setMonth(month.subtract(1, 'month'))}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => setMonth(month.add(1, 'month'))}>
              <ArrowForward />
            </IconButton>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Divider />
        </Grid>
        {_range(7).map((idx) => (
          <Grid
            key={`week-day-letter-${idx}`}
            size={{ xs: 1 }}
            py={0.5}
            sx={{
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography align='center' variant='body2'>
              {dayjs()
                .day(idx)
                .format(isMobile ? 'ddd' : 'dddd')}
            </Typography>
          </Grid>
        ))}
        {days.map((day, idx) => {
          return (
            <Grid
              key={`day-${day.date.format('YYYY-MM-DD')}`}
              size={{ xs: 1 }}
              sx={{
                borderRight: (theme) =>
                  idx % 7 !== 6 ? `1px solid ${theme.palette.divider}` : '',
                borderBottom: (theme) =>
                  idx / 7 < numWeeks - 1
                    ? `1px solid ${theme.palette.divider}`
                    : '',
              }}
            >
              <Day
                month={month}
                date={day.date}
                transactions={day.transactions}
              />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}
