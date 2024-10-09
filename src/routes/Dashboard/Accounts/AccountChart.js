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

import { numberToCurrency } from '../../../helpers/currency';

const BoxMonthValue = (props) => {
  const { label, payload } = props;
  const theme = useTheme();
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

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
        label={dayjs(Number(label)).format('MMMM YYYY')}
        payload={payload}
      />
    );
  }
  return null;
}

export default function AccountChart(props) {
  const { account } = props;
  const theme = useTheme();

  const allNetworths = useSelector((state) => state.networths.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [selected, setSelected] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [assetIds, setAssetIds] = useState([]);
  const [debtIds, setDebtIds] = useState([]);
  const [range, setRange] = useState({
    start: { month: 10, year: 2018 },
    end: { month: 1, year: 2030 },
  });

  useEffect(() => {
    let _assetIds = [];
    let _debtIds = [];
    let _data = reduce(
      allNetworths,
      (acc, networth) => {
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
              timestamp: dayjs(networth.date).date(15).unix() * 1000,
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
  }, [account, allNetworths]);

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
          {map(assetIds, (assetId) => {
            return (
              <Bar
                stackId='assets'
                key={assetId}
                type='monotone'
                dataKey={assetId}
                fill={theme.palette.green[300]}
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
                fill={theme.palette.red[300]}
                stroke='transparent'
              />
            );
          })}
        </ComposedChart>
      </ResponsiveContainer>
      {selected && (
        <Card raised sx={{ pt: 1, mt: 1 }}>
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
  );
}
