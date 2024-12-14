import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import ItemBox from '../../components/ItemBox';

export default function BorrowsStack(props) {
  const { debtId } = props;
  const allBorrows = useSelector((state) => state.borrows.data);
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    let _borrows = filter(allBorrows, { debt_id: debtId });
    setBorrows(sortBy(_borrows, 'date').reverse());
  }, [allBorrows, debtId]);

  return borrows.map((borrow) => {
    return (
      <Grid item xs={12} key={borrow.borrow_id} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={borrow} />
        </Card>
      </Grid>
    );
  });
}
