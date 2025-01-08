import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import {
  findAccount,
  findAmount,
  findId,
  findSource,
} from '../../../helpers/transactions';
import { openDialog } from '../../../store/dialogs';
import { numberToCurrency } from '../../../helpers/currency';
import TransactionTypeSelect from '../../../components/Selector/TransactionTypeSelect';

export default function DesktopTransactions() {
  const dispatch = useDispatch();
  const allAccounts = useSelector((state) => state.accounts.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [days, setDays] = useState([]);
  const [types, setTypes] = useState([]);
  const [range] = useState({
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().add(1, 'month').endOf('month'),
  });

  useEffect(() => {
    let days = [];
    let _allTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      if (types.length > 0 && !types.includes(transaction._type)) return false;
      return true;
    });
    let currentDate = range.start;
    while (currentDate <= range.end) {
      const stableDate = currentDate;
      let dayTransactions = _allTransactions.filter((transaction) => {
        return dayjs(transaction.date).isSame(stableDate, 'day');
      });
      days.push({
        date: currentDate,
        transactions: dayTransactions,
        // sum: dayTransactions.reduce((sum, transaction) => {
        //   return sum + findAmount(transaction);
        // }, 0),
      });
      currentDate = dayjs(currentDate).add(1, 'day');
    }
    setDays(days.reverse());
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
    types,
    range,
  ]);

  const openTransaction = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: findId(transaction),
        attrs: transaction,
      })
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction='row' spacing={1} my={1.5} px={2} sx={{ width: '100%' }}>
        <Typography variant='h5' fontWeight='bold' sx={{ flexGrow: 1, ml: 1 }}>
          Transactions
        </Typography>
      </Stack>
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        px={2}
        sx={{ width: '100%', maxWidth: '1500px', margin: 'auto' }}
      >
        <Grid item md={12} xs={12}>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              py: 1,
              boxShadow: (theme) => theme.shadows[4],
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' fontWeight='bold' sx={{ px: 2 }}>
              All
            </Typography>
            <Stack direction='row' sx={{ mx: 2 }} alignItems='center'>
              <TransactionTypeSelect types={types} setTypes={setTypes} />
              <Typography variant='h6' sx={{ px: 2 }}>
                Range Select
              </Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid item md={12} xs={12}>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              boxShadow: (theme) => theme.shadows[4],
              overflow: 'hidden',
            }}
          >
            <List disablePadding>
              {days.map((day, idx) => {
                if (day.transactions.length === 0) return null;
                return (
                  <React.Fragment key={idx}>
                    <ListItem key={idx} sx={{ backgroundColor: 'surface.300' }}>
                      <ListItemText
                        primary={day.date.format('MMM Do, YYYY')}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                      />
                    </ListItem>
                    {day.transactions.map((transaction, idx) => {
                      let amount = findAmount(transaction);
                      let attr2 = '';
                      if (transaction.account_id) {
                        attr2 = findAccount(transaction, allAccounts);
                      } else if (transaction.category) {
                        attr2 = transaction.category;
                      }

                      return (
                        <ListItemButton
                          disableGutters
                          key={idx}
                          onClick={() => openTransaction(transaction)}
                          sx={{
                            borderRadius: 1,
                            mx: 0.5,
                            px: 1.5,
                            py: 0.5,
                            my: 0.5,
                          }}
                        >
                          <ListItemText
                            primary={findSource(transaction)}
                            primaryTypographyProps={{
                              sx: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                            sx={{ width: '30%' }}
                          />
                          <ListItemText
                            primary={transaction._type}
                            sx={{ width: '15%' }}
                          />

                          <ListItemText
                            primary={attr2}
                            primaryTypographyProps={{ align: 'left' }}
                            sx={{ width: '15%' }}
                          />

                          <ListItem
                            sx={{
                              width: '20%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              flexDirection: 'row',
                            }}
                          >
                            {transaction?.pending && (
                              <Tooltip title='Pending' placement='top'>
                                <Box
                                  sx={{
                                    width: '10px',
                                    height: '10px',
                                    backgroundColor: 'warning.main',
                                    borderRadius: '50%',
                                    mr: 1,
                                  }}
                                />
                              </Tooltip>
                            )}
                            <Typography variant='body1'>
                              {numberToCurrency.format(amount)}
                            </Typography>
                          </ListItem>
                          <ListItemIcon sx={{ minWidth: 'unset' }}>
                            <ChevronRight />
                          </ListItemIcon>
                        </ListItemButton>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} mb={5} />
      </Grid>
    </Box>
  );
}
