import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import ItemBox from '../../components/ItemBox';

function getNextBillDate(day, months) {
  const today = dayjs();

  // Iterate over the months
  for (const month of months) {
    // Create a date for the current year and the specified month
    let billDate = dayjs()
      .month(month - 1)
      .date(day);

    // If the bill date is before today, move to next month
    if (billDate.isBefore(today, 'day')) {
      continue;
    }

    // If the bill date is valid, return it
    if (billDate.isValid()) {
      return billDate;
    }
  }

  // If no valid bill date is found in the current year, check the next year
  for (const month of months) {
    let billDate = dayjs()
      .add(1, 'year')
      .month(month - 1)
      .date(day);

    if (billDate.isValid()) {
      return billDate;
    }
  }

  return null;
}

export default function BillTemplates() {
  const dispatch = useDispatch();
  const allBills = useSelector((state) => state.bills.data);

  const [bills, setBills] = useState([]);

  useEffect(() => {
    let _bills = map(allBills, (bill) => {
      const nextBillDate = getNextBillDate(bill.day, bill.months);
      return { ...bill, nextBillDate };
    });
    setBills(sortBy(_bills, 'day'));
  }, [allBills]);

  const handleCreateClick = () => {
    dispatch(openDialog({ type: 'bill', mode: 'create' }));
  };

  return (
    <>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Button
          variant='contained'
          endIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          create
        </Button>
      </Grid>
      {bills.map((bill) => {
        return (
          <Grid item xs={12} key={bill.bill_id} mx={1}>
            <Card sx={{ width: '100%', py: 0.5 }}>
              <ItemBox item={bill} />
            </Card>
          </Grid>
        );
      })}
    </>
  );
}
