import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ItemBox from '../../components/ItemBox';

export default function DebtsStack(props) {
  const { accountId } = props;

  const accounts = useSelector((state) => state.accounts.data);
  const allDebts = useSelector((state) => state.debts.data);
  const [groupedDebts, setGroupedDebts] = useState([]);

  useEffect(() => {
    let _debts = [];
    if (accountId) {
      const account = accounts.find((a) => a.account_id === accountId);
      _debts = filter(allDebts, { account_id: account.account_id });
    } else {
      _debts = allDebts;
    }
    _debts = groupBy(_debts, 'category');
    _debts = sortBy(_debts, (debts) => {
      return debts.reduce((acc, debt) => acc + debt.amount, 0);
    }).reverse();
    setGroupedDebts(_debts);
  }, [allDebts, accountId, accounts]);

  return map(groupedDebts, (debts) => {
    const sortedDebts = sortBy(debts, 'amount').reverse();
    const category = sortedDebts[0].category;
    return (
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Card sx={{ width: '100%' }}>
          <Stack spacing={1} direction='column' pt={1} pb={1}>
            <Typography
              variant='body1'
              color='text.secondary'
              align='left'
              sx={{ pl: 2 }}
            >
              {category}
            </Typography>
            <React.Fragment key={category}>
              {map(sortedDebts, (debt, idx) => {
                return (
                  <>
                    <Divider sx={{ mx: '8px !important' }} />
                    <ItemBox item={debt} />
                  </>
                );
              })}
            </React.Fragment>
          </Stack>
        </Card>
      </Grid>
    );
  });
}
