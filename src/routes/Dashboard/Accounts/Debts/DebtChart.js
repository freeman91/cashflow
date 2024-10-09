import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  ComposedChart,
  Bar,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import { numberToCurrency } from '../../../../helpers/currency';
import SubaccountHistoryTooltip from '../SubaccountHistoryTooltip';

export default function DebtChart(props) {
  const { debt } = props;
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
        const debtValue = find(networth.debts, { debt_id: debt.debt_id });

        if (debtValue) {
          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix() * 1000,
              ...debtValue,
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
  }, [allNetworths, debt]);

  useEffect(() => {
    if (selected?.account_id) {
      setAccount(find(allAccounts, { account_id: selected.account_id }));
    }
  }, [selected, allAccounts]);

  return (
    <Box sx={{ p: 1, maxWidth: 500, width: '100%' }}>
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
            right: 15,
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
          <Tooltip content={<SubaccountHistoryTooltip />} />
          <Bar
            dot={false}
            type='monotone'
            dataKey='value'
            fill={theme.palette.red[200]}
          />
        </ComposedChart>
      </ResponsiveContainer>
      {selected && (
        <Card raised sx={{ pt: 1, mt: 1 }}>
          <List disablePadding>
            <ListItemText
              primary={dayjs(Number(selected.timestamp)).format('MMMM YYYY')}
              primaryTypographyProps={{ fontWeight: 'bold', align: 'center' }}
            />
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={account?.name} secondary='account' />
              <ListItemText
                primary={numberToCurrency.format(selected.value)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
          </List>
        </Card>
      )}
    </Box>
  );
}
