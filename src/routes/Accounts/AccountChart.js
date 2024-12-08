import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import isNull from 'lodash/isNull';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
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

import { numberToCurrency } from '../../helpers/currency';

const BoxMonthValue = (props) => {
  const { label, payload } = props;
  const theme = useTheme();
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  return (
    <Box
      sx={{
        background: theme.palette.surface[300],
        px: 1,
        pt: '4px',
        borderRadius: '4px',
        boxShadow: 4,
      }}
    >
      <List disablePadding>
        <ListItemText
          primary={label}
          primaryTypographyProps={{ fontWeight: 'bold', align: 'center' }}
        />
        {map(payload, (item) => {
          let itemState = {};
          let negative = false;
          if (item.name.startsWith('asset')) {
            itemState = find(assets, { asset_id: item.name });
          } else if (item.name.startsWith('debt')) {
            negative = true;
            itemState = find(debts, { debt_id: item.name });
          }

          let value = item.value * (negative ? -1 : 1);
          return (
            <ListItem
              disablePadding
              disableGutters
              key={item.name}
              sx={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <ListItemText secondary={itemState?.name || item.name} />
              <ListItemText
                sx={{ pl: 1 }}
                primary={numberToCurrency.format(value)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

function ChartTooltip({ active, payload, label, ...props }) {
  if (active && payload && payload.length) {
    return (
      <BoxMonthValue
        label={dayjs.unix(Number(label)).format('MMMM YYYY')}
        payload={payload}
      />
    );
  }
  return null;
}

export default function AccountChart(props) {
  const { account } = props;
  const theme = useTheme();
  const today = dayjs();

  const allNetworths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [assetIds, setAssetIds] = useState([]);
  const [debtIds, setDebtIds] = useState([]);
  const [range] = useState({
    start: { month: today.month(), year: today.subtract(2, 'year').year() },
    end: {
      month: today.month(),
      year: today.year(),
    },
  });

  useEffect(() => {
    let _assetIds = [];
    let _debtIds = [];
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

        const networthAssets = filter(networth.assets, {
          account_id: account.account_id,
        });
        const networthDebts = filter(networth.debts, {
          account_id: account.account_id,
        });

        let assets = {};
        let debts = {};
        for (const asset of networthAssets) {
          _assetIds.push(asset.asset_id);
          assets[asset.asset_id] = asset.value;
        }
        for (const debt of networthDebts) {
          _debtIds.push(debt.debt_id);
          debts[debt.debt_id] = debt.value;
        }
        if (networthAssets.length > 0 || networthDebts.length > 0) {
          return [
            ...acc,
            {
              timestamp: dayjs(networth.date).date(15).unix(),
              ...assets,
              ...debts,
            },
          ];
        } else {
          return acc;
        }
      },
      []
    );

    _assetIds = uniq(_assetIds);
    _debtIds = uniq(_debtIds);
    setAssetIds(_assetIds);
    setDebtIds(_debtIds);
    setChartData(sortBy(_data, 'timestamp'));
  }, [account, allNetworths, range]);

  return (
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Box sx={{ width: '100%', px: 1 }}>
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
                  .unix(),
                dayjs()
                  .year(range.end.year)
                  .month(range.end.month)
                  .date(1)
                  .unix(),
              ]}
            />
            <Tooltip content={<ChartTooltip />} />
            {map(assetIds, (assetId) => {
              return (
                <Bar
                  stackId='assets'
                  key={assetId}
                  type='monotone'
                  dataKey={assetId}
                  fill={theme.palette.success.main}
                  stroke='transparent'
                />
              );
            })}
            {map(debtIds, (debtId) => {
              return (
                <Bar
                  stackId='debts'
                  key={debtId}
                  type='monotone'
                  dataKey={debtId}
                  fill={theme.palette.error.main}
                  stroke='transparent'
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
        {selected && (
          <Card sx={{ pt: 1, mt: 1 }}>
            <List disablePadding>
              <ListItemText
                primary={dayjs(Number(selected.timestamp)).format('MMMM YYYY')}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'center' }}
              />
              {map(Object.keys(selected), (id) => {
                if (id === 'timestamp') {
                  return null;
                }
                let negative = false;

                let itemState = {};
                if (id.startsWith('asset')) {
                  itemState = find(assets, { asset_id: id });
                } else if (id.startsWith('debt')) {
                  negative = true;
                  itemState = find(debts, { debt_id: id });
                }

                let value = selected[id] * (negative ? -1 : 1);
                return (
                  <ListItem
                    key={id}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <ListItemText secondary={itemState?.name || id} />
                    <ListItemText
                      primary={numberToCurrency.format(value)}
                      primaryTypographyProps={{ align: 'right' }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Card>
        )}
      </Box>
    </Grid>
  );
}
