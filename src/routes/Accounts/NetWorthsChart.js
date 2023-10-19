import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { useTheme } from '@mui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  ComposedChart,
  Line,
} from 'recharts';
import {
  filter,
  find,
  get,
  groupBy,
  map,
  reduce,
  reverse,
  sortBy,
} from 'lodash';

import { numberToCurrency } from '../../helpers/currency';

const CustomTooltip = (props) => {
  const { active, payload, label, assetTypes, debtTypes } = props;

  let assetValues = reverse(
    sortBy(
      filter(payload, (values) => {
        return assetTypes.has(values.dataKey);
      }),
      'value'
    )
  );

  let debtValues = reverse(
    sortBy(
      filter(payload, (values) => {
        return debtTypes.has(values.dataKey);
      }),
      'value'
    )
  );

  let equity = get(find(payload, { dataKey: 'equity' }), 'value');

  if (active && payload && payload.length) {
    return (
      <Card raised sx={{ width: '20rem' }}>
        <CardHeader title={label} />
        <CardContent>
          <ListItem>
            <ListItemText primary='Equity' />
            <ListItemText
              primary={numberToCurrency.format(equity)}
              primaryTypographyProps={{ align: 'right' }}
            />
          </ListItem>

          <ListItemText>Assets</ListItemText>
          {map(assetValues, (assetValue) => {
            return (
              <ListItem key={assetValue.dataKey}>
                <ListItemText
                  primary={assetValue.dataKey}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium',
                    align: 'left',
                  }}
                />
                <ListItemText
                  primary={numberToCurrency.format(assetValue.value)}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium',
                    align: 'right',
                  }}
                />
              </ListItem>
            );
          })}

          <ListItemText>Debts</ListItemText>
          {map(debtValues, (debtValue) => {
            return (
              <ListItem key={debtValue.dataKey}>
                <ListItemText
                  primary={debtValue.dataKey}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium',
                    align: 'left',
                  }}
                />
                <ListItemText
                  primary={numberToCurrency.format(debtValue.value)}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: 'medium',
                    align: 'right',
                  }}
                />
              </ListItem>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default function NetWorthsChart() {
  const theme = useTheme();

  const networths = useSelector((state) => state.networths.data);
  const [chartData, setChartData] = useState([]);
  const [assetTypes, setAssetTypes] = useState(new Set());
  const [debtTypes, setDebtTypes] = useState(new Set());

  useEffect(() => {
    let _assetTypes = new Set();
    let _debtTypes = new Set();

    let data = map(networths.slice(networths.length - 12), (networth) => {
      let groupedAssets = groupBy(networth.assets, 'type');
      let groupedDebts = groupBy(networth.debts, 'type');

      _assetTypes = new Set([..._assetTypes, ...Object.keys(groupedAssets)]);
      _debtTypes = new Set([..._debtTypes, ...Object.keys(groupedDebts)]);

      let assetValues = reduce(
        Object.keys(groupedAssets),
        (acc, assetType) => {
          return {
            ...acc,
            [assetType]: reduce(
              get(groupedAssets, assetType),
              (acc, value) => acc + get(value, 'amount', 0),
              0
            ),
          };
        },
        {}
      );

      let debtValues = reduce(
        Object.keys(groupedDebts),
        (acc, debtType) => {
          return {
            ...acc,
            [debtType]: reduce(
              get(groupedDebts, debtType),
              (acc, value) => acc + get(value, 'amount', 0),
              0
            ),
          };
        },
        {}
      );

      return {
        month: dayjs(networth.date).format('MMM YYYY'),
        ...assetValues,
        ...debtValues,
        equity:
          reduce(
            assetValues,
            (acc, assetValue) => {
              return acc + assetValue;
            },
            0
          ) -
          reduce(
            debtValues,
            (acc, debtValue) => {
              return acc + debtValue;
            },
            0
          ),
      };
    });

    setAssetTypes(_assetTypes);
    setDebtTypes(_debtTypes);
    setChartData(data);
  }, [networths]);

  return (
    <Grid
      item
      xs={12}
      justifyContent='center'
      display='flex'
      height={300}
      mt={2}
      mb={10}
    >
      <ResponsiveContainer width='100%' height='100%'>
        <ComposedChart
          width={500}
          height={300}
          data={chartData}
          margin={{ left: 55 }}
        >
          <XAxis dataKey='month' />
          <YAxis
            hide
            yAxisId='a'
            tickFormatter={(value) => numberToCurrency.format(value)}
          />
          <YAxis
            hide
            orientation='right'
            yAxisId='equity'
            tickFormatter={(value) => numberToCurrency.format(value)}
          />
          <Tooltip
            content={
              <CustomTooltip assetTypes={assetTypes} debtTypes={debtTypes} />
            }
          />

          {map([...assetTypes], (assetType, idx) => {
            return (
              <Bar
                yAxisId='a'
                key={assetType}
                dataKey={assetType}
                stackId='asset'
                fill={theme.palette.green[600]}
              />
            );
          })}

          {map([...debtTypes], (debtType, idx) => {
            return (
              <Bar
                yAxisId='a'
                key={debtType}
                dataKey={debtType}
                stackId='debt'
                fill={theme.palette.blue[600]}
              />
            );
          })}
          <Line
            yAxisId='equity'
            dot={false}
            dataKey='equity'
            stroke={theme.palette.red[500]}
            strokeWidth={3}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Grid>
  );
}
