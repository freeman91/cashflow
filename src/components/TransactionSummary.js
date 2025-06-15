import React, { useState } from 'react';
import get from 'lodash/get';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { numberToCurrency } from '../helpers/currency';
import {
  findAmount,
  findPaycheckContributionSum,
} from '../helpers/transactions';

export default function TransactionSummary({ transactionsByDay }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate totals from all transactions
  const { totals, pendingTotals } = transactionsByDay.reduce(
    (acc, day) => {
      day.transactions.forEach((transaction) => {
        const isPending = transaction.pending;
        const target = isPending ? acc.pendingTotals : acc.totals;

        switch (transaction._type) {
          case 'expense':
            target.expenseTotal += findAmount(transaction);
            target.principalTotal += get(transaction, 'principal', 0);
            target.interestTotal += get(transaction, 'interest', 0);
            break;
          case 'repayment':
            target.expenseTotal += findAmount(transaction);
            target.principalTotal += get(transaction, 'principal', 0);
            target.interestTotal += get(transaction, 'interest', 0);
            break;
          case 'paycheck':
            target.incomeTotal += findAmount(transaction);
            target.employeeContributionTotal += findPaycheckContributionSum(
              transaction,
              'employee'
            );
            target.employerContributionTotal += findPaycheckContributionSum(
              transaction,
              'employer'
            );
            break;
          case 'income':
            target.incomeTotal += findAmount(transaction);
            break;
          default:
            break;
        }
      });
      return acc;
    },
    {
      totals: {
        expenseTotal: 0,
        principalTotal: 0,
        interestTotal: 0,
        incomeTotal: 0,
        employeeContributionTotal: 0,
        employerContributionTotal: 0,
      },
      pendingTotals: {
        expenseTotal: 0,
        principalTotal: 0,
        interestTotal: 0,
        incomeTotal: 0,
        employeeContributionTotal: 0,
        employerContributionTotal: 0,
      },
    }
  );

  const hasPendingValues = Object.values(pendingTotals).some(
    (value) => value > 0
  );

  const estimatedTotals = {
    expenseTotal: totals.expenseTotal + pendingTotals.expenseTotal,
    principalTotal: totals.principalTotal + pendingTotals.principalTotal,
    interestTotal: totals.interestTotal + pendingTotals.interestTotal,
    incomeTotal: totals.incomeTotal + pendingTotals.incomeTotal,
    employeeContributionTotal:
      totals.employeeContributionTotal +
      pendingTotals.employeeContributionTotal,
    employerContributionTotal:
      totals.employerContributionTotal +
      pendingTotals.employerContributionTotal,
  };

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        py: 1,
        px: 1,
        position: 'relative',
      }}
    >
      <IconButton
        onClick={handleToggleExpand}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
        }}
      >
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>

      <Grid container spacing={2} sx={{ mx: 2 }}>
        <Grid size={{ xs: 5, sm: 5, md: 5 }}>
          <Typography variant='body2' align='center' sx={{ mb: 1 }}>
            Expenses
          </Typography>
          <Typography variant='h6' align='center'>
            {numberToCurrency.format(totals.expenseTotal)}
          </Typography>
          {expanded && (
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid size={6}>
                <Typography variant='caption' align='center' display='block'>
                  Principal
                </Typography>
                <Typography variant='body2' align='center'>
                  {numberToCurrency.format(totals.principalTotal)}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='caption' align='center' display='block'>
                  Interest
                </Typography>
                <Typography variant='body2' align='center'>
                  {numberToCurrency.format(totals.interestTotal)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid size={{ xs: 2, sm: 2, md: 2 }}>
          <Typography variant='body2' align='center' sx={{ mb: 1 }}>
            Net
          </Typography>
          <Typography
            variant='h6'
            align='center'
            sx={{
              color: (theme) =>
                totals.incomeTotal +
                  totals.employeeContributionTotal +
                  totals.employerContributionTotal -
                  totals.expenseTotal >=
                0
                  ? theme.palette.success.main
                  : theme.palette.error.main,
            }}
          >
            {numberToCurrency.format(
              totals.incomeTotal +
                totals.employeeContributionTotal +
                totals.employerContributionTotal -
                totals.expenseTotal
            )}
          </Typography>
        </Grid>
        <Grid size={{ xs: 5, sm: 5, md: 5 }}>
          <Typography variant='body2' align='center' sx={{ mb: 1 }}>
            Income
          </Typography>
          <Typography variant='h6' align='center'>
            {numberToCurrency.format(
              totals.incomeTotal +
                totals.employeeContributionTotal +
                totals.employerContributionTotal
            )}
          </Typography>
          {expanded && (
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid size={6}>
                <Typography variant='caption' align='center' display='block'>
                  Employee
                </Typography>
                <Typography variant='body2' align='center'>
                  {numberToCurrency.format(totals.employeeContributionTotal)}
                </Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant='caption' align='center' display='block'>
                  Employer
                </Typography>
                <Typography variant='body2' align='center'>
                  {numberToCurrency.format(totals.employerContributionTotal)}
                </Typography>
              </Grid>
            </Grid>
          )}
        </Grid>
        {expanded && (
          <Typography
            variant='body2'
            sx={{
              position: 'absolute',
              top: 8,
              left: 0,
              px: 0.5,
              mx: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 1,
            }}
            color='text.secondary'
          >
            Actual
          </Typography>
        )}
      </Grid>

      {hasPendingValues && expanded && (
        <>
          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2} sx={{ position: 'relative', mx: 2 }}>
            <Grid size={{ xs: 5, sm: 5, md: 5 }}>
              <Typography variant='h6' align='center'>
                {numberToCurrency.format(pendingTotals.expenseTotal)}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Principal
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(pendingTotals.principalTotal)}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Interest
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(pendingTotals.interestTotal)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Typography
                variant='h6'
                align='center'
                sx={{
                  color: (theme) =>
                    pendingTotals.incomeTotal +
                      pendingTotals.employeeContributionTotal +
                      pendingTotals.employerContributionTotal -
                      pendingTotals.expenseTotal >=
                    0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {numberToCurrency.format(
                  pendingTotals.incomeTotal +
                    pendingTotals.employeeContributionTotal +
                    pendingTotals.employerContributionTotal -
                    pendingTotals.expenseTotal
                )}
              </Typography>
            </Grid>
            <Grid size={{ xs: 5, sm: 5, md: 5 }}>
              <Typography variant='h6' align='center'>
                {numberToCurrency.format(
                  pendingTotals.incomeTotal +
                    pendingTotals.employeeContributionTotal +
                    pendingTotals.employerContributionTotal
                )}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Employee
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(
                      pendingTotals.employeeContributionTotal
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Employer
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(
                      pendingTotals.employerContributionTotal
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Typography
              variant='body2'
              color='warning.main'
              sx={{
                position: 'absolute',
                top: 0,
                left: -24,
                px: 0.5,
                mx: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
              }}
            >
              Pending
            </Typography>
          </Grid>

          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2} sx={{ position: 'relative', mx: 2 }}>
            <Grid size={{ xs: 5, sm: 5, md: 5 }}>
              <Typography variant='h6' align='center'>
                {numberToCurrency.format(estimatedTotals.expenseTotal)}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Principal
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(estimatedTotals.principalTotal)}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Interest
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(estimatedTotals.interestTotal)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid size={{ xs: 2, sm: 2, md: 2 }}>
              <Typography
                variant='h6'
                align='center'
                sx={{
                  color: (theme) =>
                    estimatedTotals.incomeTotal +
                      estimatedTotals.employeeContributionTotal +
                      estimatedTotals.employerContributionTotal -
                      estimatedTotals.expenseTotal >=
                    0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                }}
              >
                {numberToCurrency.format(
                  estimatedTotals.incomeTotal +
                    estimatedTotals.employeeContributionTotal +
                    estimatedTotals.employerContributionTotal -
                    estimatedTotals.expenseTotal
                )}
              </Typography>
            </Grid>
            <Grid size={{ xs: 5, sm: 5, md: 5 }}>
              <Typography variant='h6' align='center'>
                {numberToCurrency.format(
                  estimatedTotals.incomeTotal +
                    estimatedTotals.employeeContributionTotal +
                    estimatedTotals.employerContributionTotal
                )}
              </Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Employee
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(
                      estimatedTotals.employeeContributionTotal
                    )}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant='caption' align='center' display='block'>
                    Employer
                  </Typography>
                  <Typography variant='body2' align='center'>
                    {numberToCurrency.format(
                      estimatedTotals.employerContributionTotal
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Typography
              variant='body2'
              sx={{
                position: 'absolute',
                top: 0,
                left: -24,
                px: 0.5,
                mx: 0.5,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
              }}
              color='text.secondary'
            >
              Estimated
            </Typography>
          </Grid>
        </>
      )}
    </Box>
  );
}
