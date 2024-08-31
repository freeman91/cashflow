import React, { useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function IncomeTotals(props) {
  const { incomes } = props;

  const [groupedIncomes, setGroupedIncomes] = useState([]);

  useEffect(() => {
    let _groupedIncomes = groupBy(incomes, 'category');
    _groupedIncomes = Object.keys(_groupedIncomes).map((key) => {
      return {
        category: key,
        value: reduce(
          _groupedIncomes[key],
          (sum, item) => sum + item.amount,
          0
        ),
      };
    });
    _groupedIncomes.sort((a, b) => b.value - a.value);
    setGroupedIncomes(_groupedIncomes);
  }, [incomes]);

  return (
    <Grid item xs={12} mx={1} pt='0px !important'>
      {incomes.length === 0 ? (
        <Typography
          variant='body1'
          color='text.secondary'
          align='center'
          mt={1}
        >
          none
        </Typography>
      ) : (
        <Card raised>
          <List disablePadding>
            {groupedIncomes.map((income) => (
              <ListItem key={income.category}>
                <ListItemText secondary={income.category} />
                <ListItemText
                  primary={numberToCurrency.format(income.value)}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    align: 'right',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </Grid>
  );
}
