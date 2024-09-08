import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function IncomeTotals(props) {
  const { incomes } = props;
  const dispatch = useDispatch();

  const [groupedIncomes, setGroupedIncomes] = useState([]);

  useEffect(() => {
    let _groupedIncomes = groupBy(incomes, 'category');
    _groupedIncomes = Object.keys(_groupedIncomes).map((key) => {
      return {
        category: key,
        incomes: _groupedIncomes[key],
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
            {groupedIncomes.map((group) => (
              <ListItemButton
                key={group.category}
                onClick={() => {
                  dispatch(
                    openDialog({
                      type: 'transactions',
                      attrs: group.incomes,
                    })
                  );
                }}
              >
                <ListItemText secondary={group.category} />
                <ListItemText
                  primary={numberToCurrency.format(group.value)}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    align: 'right',
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Card>
      )}
    </Grid>
  );
}
