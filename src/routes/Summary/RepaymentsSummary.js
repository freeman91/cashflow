import React from 'react';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';

export default function RepaymentsSummary(props) {
  const { principalSum, interestSum, escrowSum, repayments } = props;
  const dispatch = useDispatch();

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const show = principalSum > 0 || interestSum > 0 || escrowSum > 0;
  return (
    <>
      {show && (
        <Grid item xs={12} mx={1}>
          <Card sx={{ width: '100%', p: 1 }}>
            {principalSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={principalSum} label='principal' />
              </Box>
            )}

            {interestSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={interestSum} label='interest' />
              </Box>
            )}
            {escrowSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={escrowSum} label='escrow' />
              </Box>
            )}
          </Card>
        </Grid>
      )}

      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => openTransactionsDialog('repayments', repayments)}
        >
          show all
        </Button>
      </Grid>
    </>
  );
}
