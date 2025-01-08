import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import { alpha } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import EditIcon from '@mui/icons-material/Edit';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../../store/dialogs';
import { numberToCurrency } from '../../../helpers/currency';
import { timeSinceLastUpdate } from '../../../helpers/dates';
import TransactionsTable from '../Dashboard/Transactions/Table';
import { StyledTab, StyledTabs } from '../../../components/StyledTabs';

export default function Account(props) {
  const { account } = props;
  const dispatch = useDispatch();

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

  const openAccountDialog = () => {
    dispatch(openDialog({ type: 'account', mode: 'edit', attrs: account }));
  };

  const openSecurityDialog = (security) => {
    dispatch(openDialog({ type: 'security', mode: 'edit', attrs: security }));
  };

  const createSecurity = () => {
    dispatch(openDialog({ type: 'security', mode: 'create' }));
  };

  const createTransaction = () => {
    // dispatch(openDialog({ type: 'transaction', mode: 'create' }));
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  if (!account) return null;
  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction='row'
        spacing={1}
        mt={1.5}
        pl={2}
        pr={4}
        sx={{ width: '100%' }}
      >
        <Stack sx={{ flexGrow: 1 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize='small' />}
            sx={{ flexGrow: 1 }}
          >
            <Link
              underline='hover'
              color='text.primary'
              onClick={() => {
                dispatch(push('/accounts'));
              }}
            >
              <Typography variant='h5' fontWeight='bold'>
                Accounts
              </Typography>
            </Link>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}
            >
              {account.icon_url && (
                <Box
                  sx={{
                    mx: 1,
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={account.icon_url}
                    alt={`${account.name} icon`}
                    height={30}
                    style={{ marginRight: 10, borderRadius: '10%' }}
                  />
                </Box>
              )}
              <Typography variant='h5'>{account.name}</Typography>
            </Box>
          </Breadcrumbs>
        </Stack>
        <Button color='info' variant='contained' startIcon={<LoopIcon />}>
          Refresh
        </Button>
        <Button
          variant='contained'
          startIcon={<EditIcon />}
          onClick={openAccountDialog}
        >
          Edit
        </Button>
      </Stack>
      <Grid
        container
        spacing={2}
        px={2}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ width: '100%', mt: 1 }}
      >
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              py: 1,
              boxShadow: (theme) => theme.shadows[4],
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: 200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Value Chart
            </Box>
          </Box>
        </Grid>

        <Grid item xs={8} display='flex' justifyContent='center'>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              boxShadow: (theme) => theme.shadows[4],
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

              {tab === 'Holdings' && (
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={createSecurity}
                >
                  Add Security
                </Button>
              )}
              {tab === 'Transactions' && (
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  onClick={createTransaction}
                >
                  Add Transaction
                </Button>
              )}
            </Box>
            {tab === 'Holdings' && (
              <List disablePadding sx={{ width: '100%' }}>
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText primary='Security' />
                  <ListItemText
                    primary='Shares'
                    primaryTypographyProps={{ align: 'right' }}
                    sx={{ width: '20%' }}
                  />
                  <ListItemText
                    primary='Price'
                    primaryTypographyProps={{ align: 'right' }}
                    sx={{ width: '20%' }}
                  />
                  <ListItemText
                    primary='Value'
                    primaryTypographyProps={{ align: 'right' }}
                    sx={{ width: '20%' }}
                  />
                </ListItem>
                {groupedHoldings.map((group, idx) => {
                  const { type, sum, items } = group;
                  return (
                    <React.Fragment key={idx}>
                      <ListItem sx={{ backgroundColor: 'surface.300' }}>
                        <ListItemText
                          primary={type}
                          primaryTypographyProps={{
                            fontWeight: 'bold',
                            sx: { ml: 1 },
                            variant: 'body2',
                          }}
                        />
                        {items.length > 1 && (
                          <ListItemText
                            primary={numberToCurrency.format(sum)}
                            primaryTypographyProps={{
                              align: 'right',
                              sx: { mr: 1 },
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
                              primaryTypographyProps={{
                                fontWeight: 'bold',
                              }}
                              secondary={security.name}
                            />
                            <ListItemText
                              primary={new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 5,
                              }).format(security.shares)}
                              primaryTypographyProps={{ align: 'right' }}
                              sx={{ width: '20%' }}
                            />
                            <ListItemText
                              primary={numberToCurrency.format(security.price)}
                              primaryTypographyProps={{ align: 'right' }}
                              sx={{ width: '20%' }}
                            />
                            <ListItemText
                              primary={numberToCurrency.format(
                                security._amount
                              )}
                              primaryTypographyProps={{ align: 'right' }}
                              secondary={timeSinceLastUpdate(
                                security.last_update
                              )}
                              secondaryTypographyProps={{ align: 'right' }}
                              sx={{ width: '20%' }}
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
        <Grid item xs={4} display='flex' justifyContent='center'>
          <Box
            sx={{
              backgroundColor: 'surface.250',
              borderRadius: 1,
              py: 1,
              boxShadow: (theme) => theme.shadows[4],
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
                  primaryTypographyProps={{
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
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='Account Type' />
                <ListItemText
                  primary={account.account_type}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='Subtype' />
                <ListItemText
                  primary={account.subtype}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary='Holdings' />
                <ListItemText
                  primary={holdings.length}
                  primaryTypographyProps={{ align: 'right' }}
                />
              </ListItem>
            </List>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
