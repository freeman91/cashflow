import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import NetWorthTable from '../../components/Table/NetWorthTable';

export default function Networth() {
  const dispatch = useDispatch();
  // const { data: networths } = useSelector((state) => state.networths);
  // const { data: assets } = useSelector((state) => state.assets);
  // const { data: debts } = useSelector((state) => state.debts);

  useEffect(() => {
    dispatch(getAssets());
    dispatch(getDebts());
  }, [dispatch]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <NetWorthTable />
        </Grid>
      </Grid>
    </>
  );
}
