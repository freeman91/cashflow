import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import ExpenseSummary from './ExpenseSummary';

export default function ExpenseValuesCard(props) {
  const { principalSum, interestSum, escrowSum, otherExpenseSum } = props;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'summary-popover' : undefined;
  const totalExpense = principalSum + interestSum + escrowSum + otherExpenseSum;
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[24],
          },
        }}
        onClick={handleClick}
      >
        <Typography color='textSecondary' variant='h6'>
          Expenses
        </Typography>
        <Typography
          fontWeight='bold'
          variant='h5'
          sx={{ color: theme.palette.error.main }}
        >
          {numberToCurrency.format(totalExpense)}
        </Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ExpenseSummary
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
        />
      </Popover>
    </>
  );
}
