import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import {
  ComposedChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

const BoxMonthValue = (props) => {
  const { label, value } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: theme.palette.surface[400],
        px: 2,
        pt: '4px',
        borderRadius: '10px',
        boxShadow: 4,
      }}
    >
      <BoxFlexColumn alignItems='flex-start'>
        <Typography variant='body2' color='grey.0'>
          {label}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h5' color='grey.10'>
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

function ChartTooltip({ active, payload, label, ...props }) {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <BoxMonthValue
        label={dayjs(Number(label)).format('MMMM YYYY')}
        value={value}
      />
    );
  }
  return null;
}

export default function AssetChart(props) {
  const { asset } = props;
  const theme = useTheme();
  const allNetworths = useSelector((state) => state.networths.data);
  const allAccounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState(null);
  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [range, setRange] = useState({
    start: { month: 10, year: 2018 },
    end: { month: 1, year: 2030 },
  });

  useEffect(() => {
    let _data = reduce(
      allNetworths,
      (acc, networth) => {
        const assetValue = find(networth.assets, { asset_id: asset.asset_id });

        if (assetValue) {
          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix() * 1000,
              ...assetValue,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );
    _data = sortBy(_data, 'timestamp');
    const first = _data[0];
    const last = _data[_data.length - 1];

    if (first && last) {
      setRange({
        start: {
          month: dayjs(first.timestamp).month(),
          year: dayjs(first.timestamp).year(),
        },
        end: {
          month: dayjs(last.timestamp).month(),
          year: dayjs(last.timestamp).year(),
        },
      });
    }
    setChartData(_data);
  }, [allNetworths, asset]);

  useEffect(() => {
    if (selected?.account_id) {
      setAccount(find(allAccounts, { account_id: selected.account_id }));
    }
  }, [selected, allAccounts]);

  return (
    <Box sx={{ p: 1 }}>
      <ResponsiveContainer
        width='100%'
        height={200}
        style={{ '& .recharts-surface': { overflow: 'visible' } }}
      >
        <ComposedChart
          width='100%'
          height={200}
          data={chartData}
          onClick={(e) => {
            if (!isNull(e?.activeTooltipIndex)) {
              setSelected(chartData[e.activeTooltipIndex]);
            } else {
              setSelected(null);
            }
          }}
          margin={{
            top: 0,
            right: 10,
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
                .unix() * 1000,
              dayjs()
                .year(range.end.year)
                .month(range.end.month)
                .date(1)
                .unix() * 1000,
            ]}
            tickFormatter={(unixTime) => {
              return dayjs(unixTime).format('YYYY MMM');
            }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dot={false}
            type='monotone'
            dataKey='value'
            fill={theme.palette.green[300]}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {selected && (
        <List>
          <ListItemText
            primary={dayjs(Number(selected.timestamp)).format('MMMM YYYY')}
            secondary='date'
          />
          <ListItemText primary={account?.name} secondary='account' />
          <ListItemText
            primary={numberToCurrency.format(selected.value)}
            secondary='value'
          />
        </List>
      )}
    </Box>
  );
}
