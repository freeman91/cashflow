import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid';

import ItemBox from '../../components/ItemBox';

export default function DebtsStack() {
  const allDebts = useSelector((state) => state.debts.data);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    let _debts = allDebts;
    setDebts(sortBy(_debts, 'amount').reverse());
  }, [allDebts]);

  return (
    <Grid item xs={12} mx={1} pt={'0 !important'} mb={1} pb={10}>
      {map(debts, (debt) => {
        return <ItemBox key={debt.debt_id} item={debt} />;
      })}
    </Grid>
  );
}
