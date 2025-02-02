import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import range from 'lodash/range';
import reduce from 'lodash/reduce';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

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

function CustomTooltip({ active, payload, label }) {
  const [currentMonth, setCurrentMonth] = useState({});
  const [lastMonth, setLastMonth] = useState({});
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
    setCurrentMonth({
      color: value?.color,
      value: value?.value,
      date: currentMonthDate,
    });
    setLastMonth({
      color: 'textSecondary',
      value: lastValue?.value,
      date: lastMonthDate,
    });
  }, [payload, label]);

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
          {currentMonth.date?.format('MMM Do') || ''}
        </Typography>
        {currentMonth.value > 0 && (
          <Typography
            variant='h6'
            fontWeight='bold'
            align='right'
            sx={{ color: currentMonth.color }}
          >
            {numberToCurrency.format(currentMonth.value)}
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
              sx={{ color: lastMonth.color }}
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
        {lastMonth.value > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant='body1'
              align='left'
              sx={{ color: lastMonth.color }}
            >
              {lastMonth.date?.format('MMM Do') || ''}
            </Typography>
            <Typography
              variant='h6'
              fontWeight='bold'
              align='right'
              sx={{ color: lastMonth.color }}
            >
              {numberToCurrency.format(lastMonth.value)}
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
  const today = dayjs();

  const [todayValue, setTodayValue] = useState(0);
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState([]);
  const [lastMonthExpenses, setLastMonthExpenses] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const currentMonth = dayjs();
    const lastMonth = dayjs().subtract(1, 'month');
    const currentMonthExpenses = filter(
      [...allExpenses, ...allRepayments],
      (expense) => {
        return dayjs(expense.date).isSame(currentMonth, 'month');
      }
    );
    const lastMonthExpenses = filter(
      [...allExpenses, ...allRepayments],
      (expense) => dayjs(expense.date).isSame(lastMonth, 'month')
    );
    setCurrentMonthExpenses(currentMonthExpenses);
    setLastMonthExpenses(lastMonthExpenses);
  }, [allExpenses, allRepayments]);

  useEffect(() => {
    const _todayDate = dayjs().date();
    const _chartData = [];
    let lastMonthCumSum = 0;
    let currentMonthCumSum = 0;

    map(range(1, 32), (day) => {
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
      const lastMonthCurrentDayExpenses = filter(
        lastMonthExpenses,
        (expense) => {
          return dayjs(expense.date).date() === day;
        }
      );

      currentMonthCumSum += reduce(
        currentDayExpenses,
        (sum, expense) => {
          return sum + findAmount(expense);
        },
        0
      );
      lastMonthCumSum += reduce(
        lastMonthCurrentDayExpenses,
        (sum, expense) => {
          return sum + findAmount(expense);
        },
        0
      );
      if (day === _todayDate) {
        setTodayValue(currentMonthCumSum);
      }
      _chartData.push({
        day,
        currentMonth: day <= _todayDate ? currentMonthCumSum : null,
        lastMonth: lastMonthCumSum,
        currentDayPending: currentDayPendingExpenses.reduce(
          (sum, expense) => sum + findAmount(expense),
          0
        ),
      });
    });

    setChartData(_chartData);
  }, [currentMonthExpenses, lastMonthExpenses]);

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
        <Typography
          variant='body1'
          fontWeight='bold'
          color='textSecondary'
          sx={{ py: 1 }}
        >
          SPENDING
        </Typography>
        <Typography variant='h5' fontWeight='bold'>
          This Month vs. Last Month
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
            <Tooltip content={<CustomTooltip />} />
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
