import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import reduce from 'lodash/reduce';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { StyledSubtab, StyledSubtabs } from '../StyledSubtabs';

const REPAYMENT_TOTALS = 'repayment totals';
const EXPENSE_CATEGORY_TOTALS = 'expense category totals';
const TABS = [REPAYMENT_TOTALS, EXPENSE_CATEGORY_TOTALS];

export default function ExpenseTotals(props) {
  const { expenses, groupedExpenses } = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState(REPAYMENT_TOTALS);
  const [repayments, setRepayments] = useState([]);
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [escrow, setEscrow] = useState(0);

  useEffect(() => {
    const _repayments = expenses.filter(
      (expense) => expense._type === 'repayment'
    );
    setRepayments(_repayments);
  }, [expenses]);

  useEffect(() => {
    const _principal = reduce(
      expenses,
      (sum, expense) => {
        if ('principal' in expense) {
          return sum + expense.principal;
        }
        return sum;
      },
      0
    );
    setPrincipal(_principal);
  }, [expenses]);

  useEffect(() => {
    const _interest = reduce(
      expenses,
      (sum, expense) => {
        if ('interest' in expense) {
          return sum + expense.interest;
        }
        return sum;
      },
      0
    );
    setInterest(_interest);
  }, [expenses]);

  useEffect(() => {
    const _escrow = reduce(
      expenses,
      (sum, expense) => {
        if ('escrow' in expense) {
          return sum + expense.escrow;
        }
        return sum;
      },
      0
    );
    setEscrow(_escrow);
  }, [expenses]);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleOpen = (category) => {
    setOpen((prevOpen) => {
      if (prevOpen === category) {
        return null;
      }
      return category;
    });
  };

  const openTransactionsDialog = (expenses) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: expenses,
      })
    );
  };

  return (
    <>
      <Grid item xs={12} mx={1}>
        <StyledSubtabs
          variant='fullWidth'
          sx={{ pb: 1 }}
          value={tab}
          onChange={changeTab}
        >
          {TABS.map((_tab) => (
            <StyledSubtab key={_tab} label={_tab} value={_tab} />
          ))}
        </StyledSubtabs>
      </Grid>

      <Grid item xs={12} mx={1} pt='0px !important'>
        <Card raised>
          {tab === REPAYMENT_TOTALS && (
            <List
              disablePadding
              onClick={() => {
                openTransactionsDialog(repayments);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ListItem>
                <ListItemText secondary='principal' />
                <ListItemText
                  primary={numberToCurrency.format(principal)}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText secondary='interest' />
                <ListItemText
                  primary={numberToCurrency.format(interest)}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem>
                <ListItemText secondary='escrow' />
                <ListItemText
                  primary={numberToCurrency.format(escrow)}
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    align: 'right',
                  }}
                />
              </ListItem>
            </List>
          )}
          {tab === EXPENSE_CATEGORY_TOTALS && (
            <List disablePadding>
              {groupedExpenses.map((group) => {
                return (
                  <React.Fragment key={group.name}>
                    <ListItemButton
                      key={group.name}
                      onClick={() => {
                        handleOpen(group.name);
                      }}
                    >
                      <ListItemIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          openTransactionsDialog(group.expenses);
                        }}
                      >
                        <MenuIcon />
                      </ListItemIcon>

                      <ListItemText secondary={group.name} />
                      <ListItemText
                        primary={numberToCurrency.format(group.value)}
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          align: 'right',
                        }}
                        sx={{ mr: 2 }}
                      />

                      {open === group.name ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse
                      in={open === group.name}
                      timeout='auto'
                      unmountOnExit
                    >
                      <Divider />
                      <List component='div' disablePadding>
                        {group.subcategories.map((subgroup) => {
                          return (
                            <ListItemButton
                              key={subgroup.name}
                              onClick={() => {
                                openTransactionsDialog(subgroup.expenses);
                              }}
                            >
                              <ListItemText
                                secondary={subgroup.name}
                                sx={{ ml: 2 }}
                              />
                              <ListItemText
                                primary={numberToCurrency.format(
                                  subgroup.value
                                )}
                                primaryTypographyProps={{
                                  fontWeight: 'bold',
                                  align: 'right',
                                }}
                                sx={{ mr: 2 }}
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                      <Divider />
                    </Collapse>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </Card>
      </Grid>
    </>
  );
}
