import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexColumn from '../../../components/BoxFlexColumn';
import BoxFlexCenter from '../../../components/BoxFlexCenter';

const ONE_YEAR = '1Y';
const TWO_YEARS = '2Y';
const FIVE_YEARS = '5Y';
const TEN_YEARS = '10Y';
const ALL_TIME = 'ALL';

const BoxMonthValue = (props) => {
  const { label, value } = props;
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.surface[300],
        px: 1,
        pt: '4px',
        borderRadius: '3px',
        boxShadow: 4,
      }}
    >
      <BoxFlexColumn alignItems='center'>
        <Typography variant='body2' color='text.secondary' align='center'>
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h5' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
    </Box>
  );
};

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const networth = find(payload, (p) => p.dataKey === 'networth');
    return (
      <BoxMonthValue
        label={dayjs.unix(Number(label)).format('MMMM YYYY')}
        value={networth.value}
      />
    );
  }
  return null;
}

export default function NetworthChart() {
  const theme = useTheme();
  const allNetworths = useSelector((state) => state.networths.data);

  const [chartData, setChartData] = useState([]);
  const [rangeLabel, setRangeLabel] = useState(FIVE_YEARS);
  const [range, setRange] = useState({
    start: { month: 10, year: 2018 },
    end: { month: 1, year: 2030 },
  });

  useEffect(() => {
    const end = dayjs();

    let _range = {
      start: {},
      end: {
        year: end.year(),
        month: end.month(),
      },
    };

    if (rangeLabel === ONE_YEAR) {
      const start = end.subtract(1, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === TWO_YEARS) {
      const start = end.subtract(2, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === FIVE_YEARS) {
      const start = end.subtract(5, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === TEN_YEARS) {
      const start = end.subtract(10, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === ALL_TIME) {
      _range.start = {
        year: 2010,
        month: 1,
      };
    }

    setRange(_range);
  }, [rangeLabel]);

  useEffect(() => {
    let _data = reduce(
      allNetworths,
      (acc, networth) => {
        const networthDate = dayjs(networth.date);
        const rangeStart = dayjs()
          .year(range.start.year)
          .month(range.start.month)
          .date(1);
        if (networthDate.isBefore(rangeStart)) {
          return acc;
        }

        const assetSum = reduce(
          networth.assets,
          (sum, asset) => sum + asset.value,
          0
        );
        const debtSum = reduce(
          networth.debts,
          (sum, debt) => sum + debt.value,
          0
        );

        return [
          ...acc,
          {
            timestamp: dayjs(networth.date).date(15).unix(),
            networth: assetSum - debtSum,
            id: networth.networth_id,
          },
        ];
      },
      []
    );
    _data = sortBy(_data, 'timestamp');
    setChartData(_data);
  }, [allNetworths, range]);

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.networth));
    const dataMin = Math.min(...chartData.map((i) => i.networth));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <Box sx={{ width: '100%' }}>
      <ResponsiveContainer
        width='100%'
        height={200}
        style={{ '& .recharts-surface': { overflow: 'visible' } }}
      >
        <AreaChart
          width='100%'
          height={200}
          data={chartData}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis
            hide
            axisLine={false}
            tickLine={false}
            type='number'
            dataKey='timestamp'
            domain={[
              dayjs()
                .year(range.start.year)
                .month(range.start.month)
                .date(1)
                .unix(),
              dayjs()
                .year(range.end.year)
                .month(range.end.month)
                .date(1)
                .unix(),
            ]}
          />

          <Tooltip content={<ChartTooltip />} />
          <defs>
            <linearGradient id='splitColor' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='0%'
                stopColor={theme.palette.success.main}
                stopOpacity={1}
              />
              <stop
                offset={off}
                stopColor={theme.palette.success.main}
                stopOpacity={0.3}
              />
              <stop
                offset={off}
                stopColor={theme.palette.error.main}
                stopOpacity={0.3}
              />
              <stop
                offset='100%'
                stopColor={theme.palette.error.main}
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <Area
            dot={false}
            type='monotone'
            dataKey='networth'
            stroke='url(#splitColor)'
            fill='url(#splitColor)'
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      <Stack direction='row' spacing={1} display='flex' justifyContent='center'>
        <Chip label='1 Y' />
        <Chip label='Chip Outlined' variant='outlined' />
      </Stack>
    </Box>
  );
}
