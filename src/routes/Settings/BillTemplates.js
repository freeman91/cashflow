import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { findIcon } from '../../helpers/transactions';
import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import CustomIconButton from '../../components/CustomIconButton';
import FloatingActionButton from '../../components/FloatingActionButton';

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

const BillBox = (props) => {
  const { bill, icon } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = (bill) => {
    dispatch(
      openDialog({
        type: bill._type,
        mode: 'edit',
        id: bill.bill_id,
        attrs: bill,
      })
    );
  };

  return (
    <Box
      key={bill.bill_id}
      onClick={() => handleClick(bill)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        pl: 1,
        pr: 2,
        cursor: 'pointer',
      }}
    >
      <CustomIconButton color={theme.palette.red}>{icon}</CustomIconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 1,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {bill.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {bill.category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='text.secondary'>
            {bill.nextBillDate.format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {_numberToCurrency.format(bill.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function BillTemplates() {
  const allBills = useSelector((state) => state.bills.data);

  const [bills, setBills] = useState([]);

  useEffect(() => {
    let _bills = map(allBills, (bill) => {
      const nextBillDate = getNextBillDate(bill.day, bill.months);
      return { ...bill, nextBillDate };
    });
    setBills(sortBy(_bills, 'day'));
  }, [allBills]);

  return (
    <Card raised>
      <Stack spacing={1} direction='column' py={1}>
        {map(bills, (bill, idx) => {
          return (
            <React.Fragment key={bill.bill_id}>
              <BillBox bill={bill} icon={findIcon(bill)} />
              {idx < bills.length - 1 && <Divider />}
            </React.Fragment>
          );
        })}
      </Stack>
      <FloatingActionButton createTypes={['bill']} />
    </Card>
  );
}
