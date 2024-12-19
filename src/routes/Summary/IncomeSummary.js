import React from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import TransactionsByMonth from './TransactionsByMonth';

export default function IncomeSummary(props) {
  const { year, month, numMonths, label, incomes, sum } = props;
  const theme = useTheme();
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
      {numMonths > 1 && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.surface[300]}`,
              borderRadius: 1,
            }}
          >
            <LabelValueBox value={sum / numMonths} label='average' />
          </Box>
        </Grid>
      )}
      {show && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.surface[300]}`,
              borderRadius: 1,
            }}
          >
            {taxesSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={taxesSum} label='taxes' />
              </Box>
            )}

            {benefitsSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={benefitsSum} label='benefits' />
              </Box>
            )}
            {retirementSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={retirementSum} label='retirement' />
              </Box>
            )}
            {otherSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={otherSum} label='other' />
              </Box>
            )}
          </Box>
        </Grid>
      )}

      {year && isNaN(month) && (
        <TransactionsByMonth
          year={year}
          transactions={incomes}
          color={theme.palette.success.main}
        />
      )}

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
