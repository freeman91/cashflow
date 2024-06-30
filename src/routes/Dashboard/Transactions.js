import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import { CustomIconButton } from './Cashflow';
import {
  findAmount,
  findCategory,
  findColor,
  findIcon,
  findId,
  findSource,
} from '../../helpers/transactions';

export const BoxCurrencyDisplay = (props) => {
  const { transaction } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: transaction[`${transaction._type}_id`],
        attrs: transaction,
      })
    );
  };

  const amount = findAmount(transaction);
  const source = findSource(transaction);
  const category = findCategory(transaction);
  const color = findColor(transaction);
  const icon = findIcon(transaction);

  const [c1, c2] = color.split('.');
  const themeColor = theme.palette[c1][c2];
  return (
    <Box
      onClick={() => handleClick(transaction)}
      sx={{
        position: 'relative',
        background: `linear-gradient(-15deg, ${theme.palette.surface[300]}, ${theme.palette.surface[500]})`,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        p: '4px',
        mt: 1,
        pr: 2,
        border: `2px solid ${themeColor}`,
      }}
    >
      <CustomIconButton color={color}>{icon}</CustomIconButton>
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
            {source}
          </Typography>
          <Typography variant='body2' color='grey.0'>
            {category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {dayjs(transaction.date).format('MMM D')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function Transactions() {
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [recentExpanded, setRecentExpanded] = useState(true);
  const [upcomingExpanded, setUpcomingExpanded] = useState(false);

  useEffect(() => {
    const today = dayjs().hour(23).minute(59);
    const fourDaysAgo = dayjs().subtract(4, 'day').hour(0).minute(0);
    const recentTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
    ].filter((transaction) => {
      const eDate = dayjs(transaction.date);
      if (
        (transaction._type === 'expense' ||
          transaction._type === 'repayment') &&
        transaction.pending
      ) {
        return false;
      }
      return eDate >= fourDaysAgo && eDate <= today;
    });

    setRecent(sortBy(recentTransactions, ['date', 'type']).reverse());
  }, [allExpenses, allRepayments, allIncomes, allPaychecks]);

  useEffect(() => {
    const threeDaysFromNow = dayjs().add(3, 'day').hour(23).minute(59);
    const upcomingExpenses = [...allExpenses, ...allRepayments].filter(
      (expense) => {
        const eDate = dayjs(expense.date);
        return eDate <= threeDaysFromNow && expense.pending;
      }
    );

    setUpcoming(sortBy(upcomingExpenses, 'date').reverse());
  }, [allExpenses, allRepayments]);

  return (
    <Grid item xs={12} sx={{ mb: 9 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          px: 1,
          pb: 2,
          borderTopRightRadius: '10px',
          borderTopLeftRadius: '10px',
          background: (theme) =>
            `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
          minHeight: '435px',
        }}
      >
        <Stack spacing={1} direction='column'>
          <Box
            onClick={() => setUpcomingExpanded(!upcomingExpanded)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography
              variant='h6'
              color='grey.0'
              fontWeight='bold'
              sx={{ pl: 1, mt: 1 }}
            >
              upcoming
            </Typography>
            <IconButton>
              {upcomingExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={upcomingExpanded} sx={{ mt: '0 !important' }}>
            {map(upcoming, (expense) => {
              return (
                <BoxCurrencyDisplay
                  key={findId(expense)}
                  transaction={expense}
                />
              );
            })}
          </Collapse>
          <Divider />
          <Box
            onClick={() => setRecentExpanded(!recentExpanded)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Typography
              variant='h6'
              color='grey.0'
              fontWeight='bold'
              sx={{ pl: 1 }}
            >
              recent
            </Typography>
            <IconButton>
              {recentExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          <Collapse in={recentExpanded} sx={{ mt: '0 !important' }}>
            {map(recent, (transaction) => {
              return (
                <BoxCurrencyDisplay
                  key={findId(transaction)}
                  transaction={transaction}
                />
              );
            })}
          </Collapse>
        </Stack>
      </Box>
    </Grid>
  );
}
