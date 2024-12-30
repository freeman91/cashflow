import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import ItemBox from '../../../components/ItemBox';

export default function RepaymentsStack(props) {
  const { debtId } = props;

  const allRepayments = useSelector((state) => state.repayments.data);
  const [repayments, setRepayment] = useState([]);

  useEffect(() => {
    let _repayments = filter(allRepayments, { debt_id: debtId });
    setRepayment(sortBy(_repayments, 'date').reverse());
  }, [allRepayments, debtId]);

  return repayments.map((repayment) => {
    return (
      <Grid item xs={12} key={repayment.repayment_id} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={repayment} detailed={true} />
        </Card>
      </Grid>
    );
  });
}
