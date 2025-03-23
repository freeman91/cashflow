import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import groupBy from 'lodash/groupBy';

import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../../store/itemView';
import { TRANSACTION_ORDER } from '../../../store/hooks/useTransactions';
import { numberToCurrency } from '../../../helpers/currency';
import { timeSinceLastUpdate } from '../../../helpers/dates';
import { findAmount } from '../../../helpers/transactions';
import { LIABILITY } from '../../../components/Forms/AccountForm';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';
import CreateTransactionButton from '../../Dashboard/Transactions/CreateTransactionButton';
import AccountValueHistory from './AccountValueHistory';
import ReactiveButton from '../../../components/ReactiveButton';
import TransactionsTable from '../../../components/TransactionsTable';

export default function Account(props) {
  const { account } = props;
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const securities = useSelector((state) => state.securities.data);
  const allBorrows = useSelector((state) => state.borrows.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);

  const [range] = useState({
    start: dayjs().date(1).subtract(3, 'month').hour(0),
    end: dayjs().add(3, 'day'),
  });
  const [tab, setTab] = useState('Transactions');
  const [transactionsByDay, setTransactionsByDay] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [groupedHoldings, setGroupedHoldings] = useState([]);

  useEffect(() => {
    if (!range?.start || !range?.end) return;
    let _days = [];
    let _allTransactions = [
      ...allBorrows,
      ...allExpenses,
      ...allIncomes,
      ...allPaychecks,
      ...allRepayments,
      ...allPurchases,
      ...allSales,
    ].filter((transaction) => {
      if (
        transaction.payment_from_id === account.account_id ||
        transaction.account_id === account.account_id ||
        transaction.deposit_to_id === account.account_id
      )
        return true;
      return false;
    });

    let currentDate = range.start;
    while (currentDate <= range.end) {
      const stableDate = currentDate;
      let dayTransactions = _allTransactions.filter((transaction) => {
        if (!transaction.date) return false;
        return dayjs(transaction.date).isSame(stableDate, 'day');
      });
      dayTransactions = dayTransactions.map((transaction) => ({
        ...transaction,
        _amount: findAmount(transaction),
      }));
      dayTransactions = dayTransactions.sort((a, b) => {
        return (
          TRANSACTION_ORDER.indexOf(a._type) -
            TRANSACTION_ORDER.indexOf(b._type) || b._amount - a._amount
        );
      });
      _days.push({
        date: currentDate,
        transactions: dayTransactions,
      });
      currentDate = dayjs(currentDate).add(1, 'day');
    }
    setTransactionsByDay(_days.reverse());
  }, [
    allBorrows,
    allExpenses,
    allIncomes,
    allPaychecks,
    allRepayments,
    allPurchases,
    allSales,
    range,
    account.account_id,
  ]);

  useEffect(() => {
    let _holdings = securities.filter(
      (s) => s.account_id === account.account_id
    );
    _holdings = _holdings.map((s) => ({
      ...s,
      _amount: s.shares * s.price,
    }));
    setHoldings(_holdings);
    let _groupedHoldings = groupBy(_holdings, 'security_type');
    _groupedHoldings = Object.entries(_groupedHoldings).map(([type, items]) => {
      const sum = items.reduce((acc, item) => {
        return acc + item._amount;
      }, 0);

      return {
        type,
        sum,
        items: items.sort((a, b) => b._amount - a._amount),
      };
    });
    _groupedHoldings.sort((a, b) => b.sum - a.sum);
    setGroupedHoldings(_groupedHoldings);
  }, [account, securities]);

  const openSecurityDialog = (security) => {
    dispatch(
      openItemView({
        itemType: 'security',
        mode: 'edit',
        attrs: security,
      })
    );
  };

  const createSecurity = () => {
    dispatch(
      openItemView({
        itemType: 'security',
        mode: 'create',
        attrs: {
          account_id: account.account_id,
        },
      })
    );
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  if (!account) return null;
  let transactionTypes = ['purchase', 'sale'];
  if (account.account_type === LIABILITY) {
    transactionTypes = ['borrow', 'repayment'];
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{ width: '100%', px: 1, pb: 5 }}
    >
      <AccountValueHistory account={account} />
      <Grid size={{ xs: 12, md: 8 }} display='flex' justifyContent='center'>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              width: '100%',
            }}
          >
            <StyledTabs value={tab} onChange={handleChange}>
              <StyledTab label='Transactions' value='Transactions' />
              <StyledTab label='Holdings' value='Holdings' />
            </StyledTabs>

            {tab === 'Holdings' && (
              <ReactiveButton
                label='Security'
                handleClick={createSecurity}
                Icon={AddIcon}
                color='primary'
                variant='contained'
              />
            )}
            {tab === 'Transactions' && (
              <CreateTransactionButton
                types={transactionTypes}
                attrs={{ account_id: account.account_id }}
              />
            )}
          </Box>
          {tab === 'Holdings' && (
            <List
              disablePadding
              sx={{
                width: '100%',
                backgroundColor: 'surface.250',
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ListItem>
                <ListItemText primary='Security' />
                <ListItemText
                  primary='Shares'
                  sx={{ maxWidth: 200 }}
                  slotProps={{
                    primary: { align: 'right' },
                  }}
                />
                <ListItemText
                  primary='Price'
                  sx={{ maxWidth: 200 }}
                  slotProps={{
                    primary: { align: 'right' },
                  }}
                />
                <ListItemText
                  primary='Value'
                  sx={{ maxWidth: 200 }}
                  slotProps={{
                    primary: { align: 'right' },
                  }}
                />
              </ListItem>
              {groupedHoldings.map((group, idx) => {
                const { type, sum, items } = group;
                return (
                  <React.Fragment key={idx}>
                    <ListItem sx={{ backgroundColor: 'surface.300' }}>
                      <ListItemText
                        primary={type}
                        slotProps={{
                          primary: {
                            fontWeight: 'bold',
                            sx: { ml: 1 },
                            variant: 'body2',
                          },
                        }}
                      />
                      {items.length > 1 && (
                        <ListItemText
                          primary={numberToCurrency.format(sum)}
                          slotProps={{
                            primary: {
                              align: 'right',
                              sx: { mr: 1 },
                            },
                          }}
                        />
                      )}
                    </ListItem>
                    {items.map((security, idx) => {
                      return (
                        <ListItemButton
                          disableGutters
                          key={idx}
                          onClick={() => openSecurityDialog(security)}
                          sx={{
                            borderRadius: 1,
                            mx: 0.5,
                            px: 1.5,
                            py: 0.5,
                            my: 0.5,
                          }}
                        >
                          {security.icon_url && (
                            <Box
                              sx={{
                                width: 30,
                                mr: 1,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={security.icon_url}
                                alt={`${security.ticker} icon`}
                                height={30}
                              />
                            </Box>
                          )}
                          <ListItemText
                            primary={
                              security.ticker +
                              (security.active ? '' : ' (Inactive)')
                            }
                            secondary={security.name}
                            sx={{ maxWidth: 250 }}
                            slotProps={{
                              primary: {
                                fontWeight: 'bold',
                              },
                              secondary: {
                                sx: {
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                },
                              },
                            }}
                          />
                          <ListItemText
                            primary={
                              isMobile
                                ? new Intl.NumberFormat('en-US', {
                                    maximumSignificantDigits: 3,
                                    minimumSignificantDigits: 2,
                                    notation: 'compact',
                                  }).format(security.shares)
                                : new Intl.NumberFormat('en-US', {
                                    maximumSignificantDigits: 5,
                                    notation: 'compact',
                                  }).format(security.shares)
                            }
                            sx={{ maxWidth: 200 }}
                            slotProps={{
                              primary: { align: 'right' },
                            }}
                          />
                          <ListItemText
                            primary={
                              isMobile
                                ? new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    maximumSignificantDigits: 3,
                                    minimumSignificantDigits: 2,
                                    notation: 'compact',
                                  }).format(security.price)
                                : numberToCurrency.format(security.price)
                            }
                            sx={{ maxWidth: 200 }}
                            slotProps={{
                              primary: { align: 'right' },
                            }}
                          />
                          <ListItemText
                            primary={numberToCurrency.format(security._amount)}
                            secondary={timeSinceLastUpdate(
                              security.last_update
                            )}
                            sx={{ maxWidth: 200 }}
                            slotProps={{
                              primary: { align: 'right' },
                              secondary: {
                                align: 'right',
                                sx: { whiteSpace: 'nowrap' },
                              },
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </List>
          )}
          {tab === 'Transactions' && (
            <TransactionsTable transactionsByDay={transactionsByDay} />
          )}
        </Box>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }} display='flex' justifyContent='center'>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            py: 1,
            width: '100%',
          }}
        >
          <Box sx={{ width: '100%', px: 2 }}>
            <Typography variant='h5' fontWeight='bold'>
              Summary
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <List disablePadding>
            <ListItem>
              <ListItemText primary='Institution' />
              <ListItemText
                primary={account.institution}
                slotProps={{
                  primary: {
                    align: 'right',
                    color: 'primary',
                    onClick: () => {
                      console.log('TODO: open url in new tab');
                    },
                    sx: {
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    },
                  },
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Account Type' />
              <ListItemText
                primary={account.account_type}
                slotProps={{
                  primary: { align: 'right' },
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Subtype' />
              <ListItemText
                primary={account.subtype}
                slotProps={{
                  primary: { align: 'right' },
                }}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary='Holdings' />
              <ListItemText
                primary={holdings.length}
                slotProps={{
                  primary: { align: 'right' },
                }}
              />
            </ListItem>
          </List>
        </Box>
      </Grid>
    </Grid>
  );
}
