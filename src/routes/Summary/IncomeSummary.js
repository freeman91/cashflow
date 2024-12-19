import React from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import TransactionsByMonth from './TransactionsByMonth';

export default function IncomeSummary(props) {
  const { year, month, label, incomes } = props;
  const theme = useTheme()
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

  const taxesSum = sumBy(incomes, 'taxes');
  const benefitsSum = sumBy(incomes, 'benefits');
  const retirementSum = sumBy(incomes, 'retirement');
  const otherSum = sumBy(incomes, 'other');

  const show =
    taxesSum > 0 || benefitsSum > 0 || retirementSum > 0 || otherSum > 0;

  return (
    <>
      {show && (
        <Grid item xs={12} mx={1}>
          <Card sx={{ width: '100%', p: 1 }}>
            {taxesSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={taxesSum} label='taxes' />
              </Box>
            )}

            {benefitsSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={benefitsSum} label='benefits' />
              </Box>
            )}
            {retirementSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={retirementSum} label='retirement' />
              </Box>
            )}
            {otherSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                <LabelValueBox value={otherSum} label='other' />
              </Box>
            )}
          </Card>
        </Grid>
      )}

      {year && isNaN(month) && <TransactionsByMonth year={year} transactions={incomes} color={theme.palette.success.main} />}

      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Button
          variant='outlined'
          color='primary'
          onClick={() => openTransactionsDialog(label, incomes)}
        >
          show all
        </Button>
      </Grid>
    </>
  );
}
