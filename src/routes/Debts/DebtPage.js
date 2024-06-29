import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
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
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);

  useEffect(() => {
    const debtBorrows = filter(allBorrows, { debt_id: debt.debt_id });
    setBorrowSum(reduce(debtBorrows, (acc, borrow) => acc + borrow.amount, 0));
    setBorrows(sortBy(debtBorrows, 'date').reverse());
  }, [allBorrows, debt.debt_id]);

  useEffect(() => {
    let debtRepayments = filter(allRepayments, { debt_id: debt.debt_id });
    const sums = reduce(
      debtRepayments,
      (acc, repayment) => {
        if (repayment.pending) return acc;
        return {
          principal: acc.principal + get(repayment, 'principal', 0),
          interest: acc.interest + get(repayment, 'interest', 0),
          escrow: acc.escrow + get(repayment, 'escrow', 0),
        };
      },
      { principal: 0, interest: 0, escrow: 0 }
    );
    setPrincipalSum(sums.principal);
    setInterestSum(sums.interest);
    setEscrowSum(sums.escrow);
    setRepayments(debtRepayments);
  }, [allRepayments, debt.debt_id]);

  return (
    <>
      <Grid item xs={12}>
        <Card>
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
          <Card>
            <CardHeader
              disableTypography
              title={
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant='body1' align='left' fontWeight='bold'>
                    borrowed
                  </Typography>
                  {principalSum + interestSum + escrowSum > 0 && (
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
          <Card>
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
                  <Typography variant='h6' align='right' fontWeight='bold'>
                    {numberToCurrency.format(
                      principalSum + interestSum + escrowSum
                    )}
                  </Typography>
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
              <List dense disablePadding>
                <ListItem>
                  <ListItemText primary='principal' />
                  <ListItemText
                    primary={numberToCurrency.format(principalSum)}
                    primaryTypographyProps={{
                      align: 'right',
                      fontWeight: 'bold',
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary='interest' />
                  <ListItemText
                    primary={numberToCurrency.format(interestSum)}
                    primaryTypographyProps={{
                      align: 'right',
                      fontWeight: 'bold',
                    }}
                  />
                </ListItem>
                {escrowSum > 0 && (
                  <ListItem>
                    <ListItemText primary='escrow' />
                    <ListItemText
                      primary={numberToCurrency.format(escrowSum)}
                      primaryTypographyProps={{
                        align: 'right',
                        fontWeight: 'bold',
                      }}
                    />
                  </ListItem>
                )}
              </List>
              <Divider />
              <RepaymentsTable debtId={debt.debt_id} />
            </CardContent>
          </Card>
        </Grid>
      )}
    </>
  );
}
