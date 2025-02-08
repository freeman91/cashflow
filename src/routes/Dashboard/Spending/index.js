import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import range from 'lodash/range';
import reduce from 'lodash/reduce';
import startCase from 'lodash/startCase';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';

import {
  Bar,
  ComposedChart,
  Label,
  Line,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from 'recharts';

import { numberToCurrency } from '../../../helpers/currency';
import { findAmount } from '../../../helpers/transactions';

function CustomTooltip({ compareType, active, payload, label }) {
  const [currentLabel, setCurrentLabel] = useState({});
  const [compareLabel, setCompareLabel] = useState({});
  const [currentDayPending, setCurrentDayPending] = useState({});

  useEffect(() => {
    if (!label) return;
    const currentMonthDate = dayjs().date(label);
    const lastMonthDate = dayjs().subtract(1, 'month').date(label);

    const value = payload.find((item) => item.dataKey === 'currentMonth');
    const lastValue = payload.find((item) => item.dataKey === 'lastMonth');
    const currentDayPendingValue = payload.find(
      (item) => item.dataKey === 'currentDayPending'
    );

    setCurrentDayPending({
      color: currentDayPendingValue?.color,
      value: currentDayPendingValue?.value,
    });
    setCurrentLabel({
      color: value?.color,
      value: value?.value,
      date: currentMonthDate,
    });
    setCompareLabel({
      color: 'textSecondary',
      value: lastValue?.value,
      date:
        compareType === 'last-month'
          ? lastMonthDate?.format('MMM Do')
          : 'Average',
    });
  }, [payload, label, compareType]);

  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: 'surface.300',
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[8],
          px: 2,
          py: 0.5,
        }}
      >
        <Typography variant='body1' align='center'>
          {currentLabel.date?.format('MMM Do') || ''}
        </Typography>
        {currentLabel.value > 0 && (
          <Typography
            variant='h6'
            fontWeight='bold'
            align='right'
            sx={{ color: currentLabel.color }}
          >
            {numberToCurrency.format(currentLabel.value)}
          </Typography>
        )}
        {currentDayPending.value > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant='body1'
              align='left'
              sx={{ color: compareLabel.color }}
            >
              Pending
            </Typography>
            <Typography
              variant='h6'
              fontWeight='bold'
              align='right'
              sx={{ color: currentDayPending.color }}
            >
              {numberToCurrency.format(currentDayPending.value)}
            </Typography>
          </Box>
        )}
        {compareLabel.value > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant='body1'
              align='left'
              sx={{ color: compareLabel.color }}
            >
              {compareLabel.date || ''}
            </Typography>
            <Typography
              variant='h6'
              fontWeight='bold'
              align='right'
              sx={{ color: compareLabel.color }}
            >
              {numberToCurrency.format(compareLabel.value)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
  return null;
}

export default function Spending() {
  const theme = useTheme();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allRecurrings = useSelector((state) => state.recurrings.data);
  const today = dayjs();

  const [label, setLabel] = useState('last-month');
  const [todayValue, setTodayValue] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([]);
  const [compareExpenses, setCompareExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const currentMonth = dayjs();
    const currentMonthExpenses = filter(
      [...allExpenses, ...allRepayments],
      (expense) => {
        return dayjs(expense.date).isSame(currentMonth, 'month');
      }
    );
    setCurrentMonthExpenses(currentMonthExpenses);
  }, [allExpenses, allRepayments]);

  useEffect(() => {
    if (label === 'last-month') {
      const lastMonth = dayjs().subtract(1, 'month');
      const lastMonthExpenses = filter(
        [...allExpenses, ...allRepayments],
        (expense) => dayjs(expense.date).isSame(lastMonth, 'month')
      );
      setCompareExpenses(lastMonthExpenses);
    } else if (label === 'past-6-months') {
      const sevenMonthsAgo = dayjs().subtract(7, 'month');
      const oneMonthAgo = dayjs().subtract(1, 'month');
      const _expenses = filter(
        [...allExpenses, ...allRepayments],
        (expense) =>
          dayjs(expense.date).isAfter(sevenMonthsAgo, 'month') &&
          dayjs(expense.date).isBefore(oneMonthAgo, 'month')
      );
      setCompareExpenses(_expenses);
    } else {
      setCompareExpenses([]);
    }
  }, [label, allExpenses, allRepayments]);

  useEffect(() => {
    const _today = dayjs();
    const _todayDate = _today.date();
    const _chartData = [];
    let compareCumSum = 0;
    let currentMonthCumSum = 0;

    map(range(1, 32), (day) => {
      const currentDay = dayjs().date(day);
      if (currentDay.isAfter(_today, 'month')) return;

      const currentDayExpenses = filter(currentMonthExpenses, (expense) => {
        return dayjs(expense.date).date() === day && expense?.pending === false;
      });
      const currentDayPendingExpenses = filter(
        currentMonthExpenses,
        (expense) => {
          return (
            dayjs(expense.date).date() === day && expense?.pending === true
          );
        }
      );
      const currentDayRecurring = filter(allRecurrings, (recurring) => {
        return (
          recurring.next_date &&
          dayjs(recurring.next_date).isSame(currentDay, 'day') &&
          ['expense', 'repayment'].includes(recurring.item_type)
        );
      });
      const compareCurrentDayExpenses = filter(compareExpenses, (expense) => {
        return dayjs(expense.date).date() === day;
      });

      currentMonthCumSum += reduce(
        currentDayExpenses,
        (sum, expense) => {
          return sum + findAmount(expense);
        },
        0
      );

      let _compareDaySum = reduce(
        compareCurrentDayExpenses,
        (sum, expense) => {
          return sum + findAmount(expense);
        },
        0
      );
      if (label === 'last-month') {
        compareCumSum += _compareDaySum;
      } else if (label === 'past-6-months') {
        compareCumSum += _compareDaySum / 6;
      }
      if (day === _todayDate) {
        setTodayValue(currentMonthCumSum);
      }
      _chartData.push({
        day,
        currentMonth: day <= _todayDate ? currentMonthCumSum : null,
        lastMonth: compareCumSum,
        currentDayPending:
          currentDayPendingExpenses.reduce(
            (sum, expense) => sum + findAmount(expense),
            0
          ) +
          currentDayRecurring.reduce(
            (sum, recurring) => sum + findAmount(recurring),
            0
          ),
      });
    });

    setChartData(_chartData);
  }, [currentMonthExpenses, compareExpenses, label, allRecurrings]);

  return (
    <Grid size={{ xs: 12 }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant='body1'
            fontWeight='bold'
            color='textSecondary'
            sx={{ py: 1 }}
          >
            SPENDING
          </Typography>
          <Select
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            sx={{ width: 150 }}
            size='small'
          >
            <MenuItem value='none'>
              <em>None</em>
            </MenuItem>
            <MenuItem value='last-month'>Last Month</MenuItem>
            <MenuItem value='past-6-months'>Past 6 Months</MenuItem>
          </Select>
        </Box>
        <Typography variant='h5' fontWeight='bold'>
          This Month vs. {startCase(label)}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <ResponsiveContainer width='100%' height={200}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 0, bottom: 0 }}
          >
            <XAxis
              dataKey='day'
              ticks={[1, 15, 28]}
              tickFormatter={(value) => 'Day ' + value}
              tickMargin={4}
            />
            <YAxis
              width={50}
              tickFormatter={(value) => {
                if (value === 0) return '';
                return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumSignificantDigits: 3,
                  minimumSignificantDigits: 2,
                  notation: 'compact',
                }).format(value);
              }}
            />
            <Tooltip content={<CustomTooltip compareType={label} />} />
            <Bar
              dataKey='currentDayPending'
              fill={theme.palette.warning.main}
              barSize={10}
            />
            <Line
              dataKey='lastMonth'
              stroke={theme.palette.surface[500]}
              strokeWidth={3}
              dot={false}
            />
            <Area
              dataKey='currentMonth'
              stroke={theme.palette.primary.main}
              fill={alpha(theme.palette.primary.main, 0.2)}
              strokeWidth={3}
              dot={false}
            />
            <ReferenceDot
              x={today.date()}
              y={todayValue}
              label={
                <Label
                  value={numberToCurrency.format(todayValue)}
                  position={(() => {
                    if (today.date() < 5) {
                      return 'top';
                    } else {
                      return 'left';
                    }
                  })()}
                  offset={20}
                  style={{
                    fill: theme.palette.text.primary,
                    fontWeight: 'bold',
                  }}
                />
              }
              r={4}
              fill={theme.palette.primary.main}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Grid>
  );
}
