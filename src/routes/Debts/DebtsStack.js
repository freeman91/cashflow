import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import ItemBox from '../../components/ItemBox';

export default function DebtsStack() {
  const allDebts = useSelector((state) => state.debts.data);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    let _debts = allDebts;
    setDebts(sortBy(_debts, 'amount').reverse());
  }, [allDebts]);

  return (
    <Grid item xs={12} mx={1} mb={1} pb={10}>
      <Card raised>
        <Stack spacing={1} direction='column' pt={1} pb={1}>
          {map(debts, (debt, idx) => {
            return (
              <React.Fragment key={debt.debt_id}>
                <ItemBox item={debt} />
                {idx < debts.length - 1 && (
                  <Divider sx={{ mx: '8px !important' }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Card>
    </Grid>
  );
}
