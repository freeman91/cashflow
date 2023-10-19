import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { filter, get, groupBy, reduce, remove } from 'lodash';
import dayjs from 'dayjs';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { numberToCurrency } from '../../../helpers/currency';

export default function IncomeView(props) {
  const { date1, date2 } = props;

  const allIncomes = useSelector((state) => state.incomes.data);

  const [d1Incomes, setD1Incomes] = useState([]);
  const [d2Incomes, setD2Incomes] = useState([]);

  useEffect(() => {
    let _incomes = filter(allIncomes, (income) => {
      let _date = dayjs(get(income, 'date'));
      return _date.year() === date1.year() && _date.month() === date1.month();
    });

    setD1Incomes(groupBy(_incomes, 'type'));
  }, [date1, allIncomes]);

  useEffect(() => {
    let _incomes = filter(allIncomes, (income) => {
      let _date = dayjs(get(income, 'date'));
      return _date.year() === date2.year() && _date.month() === date2.month();
    });

    setD2Incomes(groupBy(_incomes, 'type'));
  }, [date2, allIncomes]);

  let d1OtherKeys = Object.keys(d1Incomes);
  let d2OtherKeys = Object.keys(d2Incomes);

  remove(d1OtherKeys, (key) => key === 'paycheck' || key === "rachel's income");
  remove(d2OtherKeys, (key) => key === 'paycheck' || key === "rachel's income");

  return (
    <Card raised>
      <CardContent sx={{ paddingBottom: '8px !important' }}>
        <Grid container spacing={1}>
          {/* Paycheck */}
          <Grid item xs={4}>
            <Typography align='left' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d1Incomes.paycheck,
                  (sum, income) => sum + get(income, 'amount'),
                  0
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='center' variant='h6' color='grey.400'>
              Paycheck
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='right' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d2Incomes.paycheck,
                  (sum, income) => sum + get(income, 'amount'),
                  0
                )
              )}
            </Typography>
          </Grid>
          {/* Rachel */}
          <Grid item xs={4}>
            <Typography align='left' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d1Incomes["rachel's income"],
                  (sum, income) => sum + get(income, 'amount'),
                  0
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='center' variant='h6' color='grey.400'>
              Rachel
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='right' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d2Incomes["rachel's income"],
                  (sum, income) => sum + get(income, 'amount'),
                  0
                )
              )}
            </Typography>
          </Grid>
          {/* Other */}
          <Grid item xs={4}>
            <Typography align='left' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d1OtherKeys,
                  (sum, key) =>
                    sum +
                    reduce(
                      d1Incomes[key],
                      (sum, income) => sum + get(income, 'amount'),
                      0
                    ),
                  0
                )
              )}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='center' variant='h6' color='grey.400'>
              Other
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align='right' variant='h6'>
              {numberToCurrency.format(
                reduce(
                  d2OtherKeys,
                  (sum, key) =>
                    sum +
                    reduce(
                      d2Incomes[key],
                      (sum, income) => sum + get(income, 'amount'),
                      0
                    ),
                  0
                )
              )}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
