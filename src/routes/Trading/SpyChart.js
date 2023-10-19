import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/styles';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
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
  Scatter,
} from 'recharts';

import { numberToCurrency } from '../../helpers/currency';
import { getSPYDataAPI } from '../../api';
import { each, get, map, reduce } from 'lodash';

const addMovingAverage = (data, movAvgDays) => {
  let prices = [];
  try {
    return map(data, (point) => {
      if (prices.length === movAvgDays) {
        let avg = reduce(prices, (acc, price) => acc + price, 0) / movAvgDays;
        point = {
          ...point,
          ['mov_avg' + movAvgDays]: avg,
        };
        prices.shift();
      }

      prices.push(point.close);
      return point;
    });
  } finally {
    console.info(`calc avg: ${movAvgDays}`);
  }
};

const strategy0 = (data, account) => {
  return map(data, (point, idx) => {
    if (idx % account.schedule === 0) {
      account.invest(point.date);
    }

    point = account.buy(point);

    return {
      ...point,
      acctVal: account.value(point.close),
      invested: account.invested,
    };
  });
};

const strategy1 = (data, account, movAvgs) => {
  each(movAvgs, (days) => {
    data = addMovingAverage(data, days);
  });

  return map(data, (point, idx) => {
    if (idx % account.schedule === 0) {
      account.invest(point.date);
    }

    if (point.mov_avg19 > point.mov_avg6 && point.mov_avg19 > point.mov_avg66) {
      point = account.buy(point, 5);
    } else if (point.mov_avg6 < point.mov_avg19 - 10) {
      // point = account.buy(point, 5);
    }

    return {
      ...point,
      acctVal: account.value(point.close),
      invested: account.invested,
    };
  });
};

const strategy2 = (data, account, movAvgs) => {
  each(movAvgs, (days) => {
    data = addMovingAverage(data, days);
  });

  return map(data, (point, idx) => {
    if (idx % account.schedule === 0) {
      account.invest(point.date);
    }

    if (point.close < point.mov_avg66) {
      point = account.buy(point);
    }

    return {
      ...point,
      acctVal: account.value(point.close),
      invested: account.invested,
    };
  });
};

const CustomTooltip = (props) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <Card raised sx={{ width: '15rem' }}>
        <CardHeader title={label} titleTypographyProps={{ variant: 'body' }} />
        <CardContent>
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemText
                primary='close'
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
              <ListItemText
                primary={numberToCurrency.format(get(payload, '0.value', null))}
                primaryTypographyProps={{
                  color: 'text.secondary',
                  align: 'right',
                }}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemText
                primary='moving avg'
                primaryTypographyProps={{ color: 'text.secondary' }}
              />
              <ListItemText
                primary={numberToCurrency.format(get(payload, '1.value', null))}
                primaryTypographyProps={{
                  color: 'text.secondary',
                  align: 'right',
                }}
              />
            </ListItem>
            {/* {payload.length > 2 ? (
              <ListItem disablePadding>
                <ListItemText
                  primary={get(payload, '2.dataKey', null)}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
                <ListItemText
                  primary={numberToCurrency.format(
                    get(payload, '2.value', null)
                  )}
                  primaryTypographyProps={{
                    color: 'text.secondary',
                    align: 'right',
                  }}
                />
              </ListItem>
            ) : null} */}
          </List>
        </CardContent>
      </Card>
    );
  }
  return null;
};

class Account {
  constructor(strategy, schedule, purse, investment) {
    this.purse = purse;
    this.strategy = strategy;
    this.shares = 0;
    this.invested = 0;
    this.transactions = [];
    this.schedule = schedule;
    this.investment = investment;
  }

  value(price) {
    return this.shares * price + this.purse;
  }

  buy(point, shares = 1) {
    if (point.close * shares > this.purse) {
      shares = 1;
    }

    if (this.purse >= point.close * shares) {
      this.shares = this.shares + shares;
      this.purse = this.purse - point.close * shares;
      this.transactions.push({
        action: 'buy',
        value: this.value(point.close),
        point: point.close,
        date: point.date,
      });
      point = {
        ...point,
        buy: point.close,
      };
    }
    return point;
  }

  sell(point, shares) {
    if (this.shares < shares) {
      shares = this.shares;
    }

    if (this.shares >= shares) {
      this.shares = this.shares - shares;
      this.purse = this.purse + point.close * shares;
      this.transactions.push({
        action: 'sell',
        value: this.shares * point.close + this.purse,
        price: point.close,
        date: point.date,
      });
      point = {
        ...point,
        sell: point.close,
      };
    }

    return point;
  }

  invest(date) {
    this.invested = this.invested + this.investment;
    this.purse = this.purse + this.investment;
    this.transactions.push({
      action: 'invest',
      amount: this.investment,
      date,
    });
  }
}

export default function SpyChart() {
  const theme = useTheme();

  const [movAvgs] = useState([6, 19, 66]);

  const [strategy] = useState(1);
  const [schedule] = useState(5);
  const [investment] = useState(100);
  const [startingPurse] = useState(0);
  const [account, setAccount] = useState({});
  const [rawData, setRawData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let _account = new Account(strategy, schedule, startingPurse, investment);
    let data = (() => {
      switch (_account.strategy) {
        case 1:
          return strategy1(rawData, _account, movAvgs);

        case 2:
          return strategy2(rawData, _account, movAvgs);

        default:
          return strategy0(rawData, _account);
      }
    })();

    setChartData(data);
    setAccount(_account);
  }, [rawData, movAvgs, strategy, startingPurse, schedule, investment]);

  useEffect(() => {
    const func = async () => {
      setRawData(await getSPYDataAPI());
    };
    func();
  }, []);

  let lastClose = get(chartData, `${chartData.length - 1}.close`, 0);
  let acctVal = account.shares * lastClose + account.purse;

  let totalInvested = startingPurse + account.invested;
  let years = chartData.length / 365;
  let percentYield =
    Math.round(((acctVal - totalInvested) / totalInvested / years) * 10000) /
    100;
  // console.log('account: ', account);

  return (
    <>
      <Grid item xs={12} mt={2}>
        <ResponsiveContainer width='100%' height={500}>
          <ComposedChart width={1000} height={500} data={chartData}>
            <XAxis dataKey='date' hide />
            <YAxis
              mirror
              yAxisId='1'
              tickFormatter={(value) => numberToCurrency.format(value)}
              domain={['auto', 'auto']}
            />
            <YAxis
              hide
              yAxisId='2'
              orientation='right'
              tickFormatter={(value) => numberToCurrency.format(value)}
              domain={['auto', 'auto']}
            />
            {/* <Tooltip content={<CustomTooltip />} /> */}
            <Tooltip />
            <Bar
              yAxisId='1'
              key={'close'}
              dataKey={'close'}
              fill={theme.palette.blue[200]}
            />

            <Line
              yAxisId='2'
              dot={false}
              dataKey='acctVal'
              stroke={theme.palette.yellow[500]}
              strokeWidth={3}
            />
            <Line
              yAxisId='2'
              dot={false}
              dataKey='invested'
              stroke={theme.palette.grey[500]}
              strokeWidth={3}
            />
            {map(movAvgs, (days, idx) => {
              let color = (() => {
                switch (idx) {
                  case 0:
                    return theme.palette.orange[200];
                  case 1:
                    return theme.palette.orange[500];
                  case 2:
                    return theme.palette.orange[800];
                  default:
                    return theme.palette.orange[200];
                }
              })();
              return (
                <Line
                  key={`mov_avg` + days}
                  yAxisId='1'
                  dot={false}
                  dataKey={`mov_avg` + days}
                  stroke={color}
                  strokeWidth={3}
                />
              );
            })}

            <Scatter yAxisId='1' name='buy' dataKey='buy' fill='green' />
            <Scatter yAxisId='1' name='sell' dataKey='sell' fill='red' />
          </ComposedChart>
        </ResponsiveContainer>
      </Grid>
      <Grid item xs={4} mt={2}>
        <Card>
          <List>
            <ListItem>
              <ListItemText primary='Starting Purse' />
              <ListItemText
                primary={numberToCurrency.format(startingPurse)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Invested' />
              <ListItemText
                primary={numberToCurrency.format(account.invested)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
      <Grid item xs={4} mt={2}>
        <Card>
          <List>
            <ListItem>
              <ListItemText primary='Ending Purse' />
              <ListItemText
                primary={numberToCurrency.format(account.purse)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Shares' />
              <ListItemText
                primary={account.shares}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Last Close' />
              <ListItemText
                primary={numberToCurrency.format(lastClose)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Account Value' />
              <ListItemText
                primary={numberToCurrency.format(acctVal)}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Years' />
              <ListItemText
                primary={Math.round(years * 100) / 100}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Annual Percentage Yield' />
              <ListItemText
                primary={percentYield + ' %'}
                primaryTypographyProps={{ align: 'right' }}
              />
            </ListItem>
          </List>
        </Card>
      </Grid>
    </>
  );
}
