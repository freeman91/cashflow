import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import BorrowsTable from './BorrowsTable';
import RepaymentsTable from './RepaymentsTable';

export default function DebtPage(props) {
  const { debt } = props;

  const allBorrows = useSelector((state) => state.borrows.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [borrows, setBorrows] = useState([]);
  const [borrowSum, setBorrowSum] = useState(0);
  const [repayments, setRepayments] = useState([]);
  const [repaymentSum, setRepaymentSum] = useState(0);

  useEffect(() => {
    const debtBorrows = filter(allBorrows, { debt_id: debt.debt_id });
    setBorrowSum(reduce(debtBorrows, (acc, borrow) => acc + borrow.amount, 0));
    setBorrows(sortBy(debtBorrows, 'date').reverse());
  }, [allBorrows, debt.debt_id]);

  useEffect(() => {
    const debtRepayments = filter(allRepayments, { debt_id: debt.debt_id });
    setRepaymentSum(
      reduce(
        debtRepayments,
        (acc, repayment) => {
          const amount =
            get(repayment, 'principal', 0) +
            get(repayment, 'interest', 0) +
            get(repayment, 'escrow', 0);
          return acc + amount;
        },
        0
      )
    );
    setRepayments(sortBy(debtRepayments, 'date'));
  }, [allRepayments, debt.debt_id]);

  return (
    <>
      <Grid item xs={12}>
        <Card raised>
          <CardHeader
            disableTypography
            title={
              <Stack
                direction='row'
                justifyContent='space-between'
                sx={{ alignItems: 'center' }}
              >
                <Typography variant='h6' align='left' fontWeight='bold'>
                  {debt.name}
                </Typography>
                <Typography variant='h5' align='right'>
                  {numberToCurrency.format(debt.amount)}
                </Typography>
              </Stack>
            }
            sx={{ p: 1, pt: '4px', pb: '4px' }}
          />
        </Card>
      </Grid>
      {borrows.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    borrows
                  </Typography>
                  {repaymentSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(borrowSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{
                p: 1,
                pt: 0,
                pb: `${borrows.length ? 0 : '4px'} !important`,
              }}
            >
              <BorrowsTable debtId={debt.debt_id} />
            </CardContent>
          </Card>
        </Grid>
      )}
      {repayments.length !== 0 && (
        <Grid item xs={12}>
          <Card raised>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    repayments
                  </Typography>
                  {borrowSum > 0 && (
                    <Typography variant='h6' align='right' fontWeight='bold'>
                      {numberToCurrency.format(repaymentSum)}
                    </Typography>
                  )}
                </Stack>
              }
              sx={{ p: 1, pt: '4px', pb: 0 }}
            />
            <CardContent
              sx={{
                p: 1,
                pt: 0,
                pb: `${repayments.length ? 0 : '4px'} !important`,
              }}
            >
              <RepaymentsTable debtId={debt.debt_id} />
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
}
