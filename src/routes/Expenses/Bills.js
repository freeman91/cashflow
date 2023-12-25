import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, sortBy } from 'lodash';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import NewTransactionButton from '../../components/NewTransactionButton';
import { openDialog } from '../../store/dialogs';

function BillCard({ bill }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: 'bill',
        mode: 'edit',
        id: bill.bill_id,
        attrs: bill,
      })
    );
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={handleClick}
    >
      <CardHeader
        title={bill.name}
        subheader={bill.vendor}
        titleTypographyProps={{ align: 'left' }}
        subheaderTypographyProps={{ align: 'left' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center', width: '30%' },
          p: 1,
          pl: 2,
          pr: 2,
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={2}
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography align='center'>{bill.day_of_month}</Typography>
            <Typography align='center'>
              {numberToCurrency.format(bill.amount)}
            </Typography>
          </Stack>
        }
      />
    </Card>
  );
}

export default function Bills() {
  const theme = useTheme();
  const bills = useSelector((state) => state.bills.data);

  const sortedBills = sortBy(bills, 'day_of_month');

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        {map(sortedBills, (bill) => (
          <BillCard key={bill.name} bill={bill} />
        ))}
      </Stack>
      <NewTransactionButton transactionTypes={['account', 'asset', 'debt']} />
    </Box>
  );
}
