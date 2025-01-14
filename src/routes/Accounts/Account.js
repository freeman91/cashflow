import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import { alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../store/itemView';
import { numberToCurrency } from '../../helpers/currency';
import { timeSinceLastUpdate } from '../../helpers/dates';
import { LIABILITY } from '../../components/Forms/AccountForm';
import { StyledTab, StyledTabs } from '../../components/StyledTabs';
import TransactionsTable from '../Dashboard/Transactions/Table';
import CreateTransactionButton from '../Dashboard/Transactions/CreateTransactionButton';
import AccountValueHistory from './AccountValueHistory';

export default function Account(props) {
  const { account } = props;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const securities = useSelector((state) => state.securities.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allSales = useSelector((state) => state.sales.data);
  const allBorrows = useSelector((state) => state.borrows.data);

  const [tab, setTab] = useState('Transactions');
  const [holdings, setHoldings] = useState([]);
  const [groupedHoldings, setGroupedHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);

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

  useEffect(() => {
    let accountTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      return transaction.account_id === account.account_id;
    });
    accountTransactions = sortBy(accountTransactions, ['date']).reverse();
    setTransactions(accountTransactions);
  }, [
    account,
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
  ]);

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
      sx={{ width: '100%', px: 1, mb: 5 }}
    >
      <AccountValueHistory account={account} />
      <Grid size={{ xs: 12, md: 8 }} display='flex' justifyContent='center'>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 2,
              py: 1,
              my: 1,
              width: '100%',
            }}
          >
            <StyledTabs value={tab} onChange={handleChange}>
              <StyledTab label='Transactions' value='Transactions' />
              <StyledTab label='Holdings' value='Holdings' />
            </StyledTabs>

            {tab === 'Holdings' && !isMobile && (
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={createSecurity}
              >
                Add Security
              </Button>
            )}
            {tab === 'Holdings' && isMobile && (
              <IconButton onClick={createSecurity} color='primary'>
                <AddIcon />
              </IconButton>
            )}
            {tab === 'Transactions' && (
              <CreateTransactionButton
                types={transactionTypes}
                attrs={{
                  account_id: account.account_id,
                }}
              />
            )}
          </Box>
          {tab === 'Holdings' && (
            <List disablePadding sx={{ width: '100%' }}>
              <Divider sx={{ my: 1 }} />
              <ListItem>
                <ListItemText primary='Security' />
                <ListItemText
                  primary='Shares'
                  sx={{ width: '20%' }}
                  slotProps={{
                    primary: { align: 'right' },
                  }}
                />
                <ListItemText
                  primary='Price'
                  sx={{ width: '20%' }}
                  slotProps={{
                    primary: { align: 'right' },
                  }}
                />
                <ListItemText
                  primary='Value'
                  sx={{ width: '20%' }}
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
                            '&:hover': {
                              backgroundColor: (theme) =>
                                alpha(theme.palette.primary.main, 0.05),
                            },
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
                            primary={security.ticker}
                            secondary={security.name}
                            slotProps={{
                              primary: {
                                fontWeight: 'bold',
                              },
                            }}
                          />
                          <ListItemText
                            primary={new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 5,
                            }).format(security.shares)}
                            sx={{ width: '20%' }}
                            slotProps={{
                              primary: { align: 'right' },
                            }}
                          />
                          <ListItemText
                            primary={numberToCurrency.format(security.price)}
                            sx={{ width: '20%' }}
                            slotProps={{
                              primary: { align: 'right' },
                            }}
                          />
                          <ListItemText
                            primary={numberToCurrency.format(security._amount)}
                            secondary={timeSinceLastUpdate(
                              security.last_update
                            )}
                            sx={{ width: '20%' }}
                            slotProps={{
                              primary: { align: 'right' },
                              secondary: { align: 'right' },
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
            <TransactionsTable transactions={transactions} />
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
