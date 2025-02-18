import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import IncomeSummary from './IncomeSummary';

export default function IncomeValuesCard(props) {
  const { earnedIncomes, passiveIncomes, otherIncomes } = props;
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
  const totalIncome = earnedIncomes.sum + passiveIncomes.sum + otherIncomes.sum;
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
          Income
        </Typography>
        <Typography
          fontWeight='bold'
          variant='h5'
          sx={{ color: theme.palette.success.main }}
        >
          {numberToCurrency.format(totalIncome)}
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
        <IncomeSummary
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      </Popover>
    </>
  );
}
