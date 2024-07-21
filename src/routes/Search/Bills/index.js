import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../../store/dialogs';
import { findIcon, findId } from '../../../helpers/transactions';
import { _numberToCurrency } from '../../../helpers/currency';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';
import BoxFlexColumn from '../../../components/BoxFlexColumn';
import BoxFlexCenter from '../../../components/BoxFlexCenter';
import CustomIconButton from '../../../components/CustomIconButton';
import TransactionBox from '../../../components/TransactionBox';

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
        position: 'relative',
        background: `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[250]})`,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        p: '4px',
        mt: 1,
        pr: 2,
        border: `2px solid ${theme.palette.surface[400]}`,
      }}
    >
      <CustomIconButton color={theme.palette.red}>{icon}</CustomIconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            color='grey.0'
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
          <Typography variant='body2' color='grey.0'>
            {bill.category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {bill.nextBillDate.format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(bill.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function Bills() {
  const allBills = useSelector((state) => state.bills.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [tabIdx, setTabIdx] = useState(0);
  const [bills, setBills] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    let _bills = map(allBills, (bill) => {
      const nextBillDate = getNextBillDate(bill.day, bill.months);
      return { ...bill, nextBillDate };
    });
    setBills(sortBy(_bills, 'day'));
  }, [allBills]);

  useEffect(() => {
    let _expenses = [
      ...filter(allExpenses, (expense) => expense.bill_id && expense.pending),
      ...filter(
        allRepayments,
        (repayment) => repayment.bill_id && repayment.pending
      ),
    ];

    setExpenses(sortBy(_expenses, 'date'));
  }, [allExpenses, allRepayments]);

  const handleChange = (event, newValue) => {
    setTabIdx(newValue);
  };

  return (
    <Box>
      <StyledTabs value={tabIdx} onChange={handleChange} centered>
        <StyledTab label='templates' sx={{ width: '35%' }} />
        <StyledTab label='pending' sx={{ width: '35%' }} />
      </StyledTabs>
      <Box sx={{ px: 1, pt: '2px' }}>
        {tabIdx === 0 && (
          <Stack spacing={1} direction='column'>
            {map(bills, (bill) => {
              return (
                <BillBox key={bill.bill_id} bill={bill} icon={findIcon(bill)} />
              );
            })}
          </Stack>
        )}
        {tabIdx === 1 && (
          <Stack spacing={1} direction='column'>
            {map(expenses, (expense) => {
              return (
                <TransactionBox key={findId(expense)} transaction={expense} />
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
