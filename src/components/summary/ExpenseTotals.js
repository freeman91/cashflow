import React, { useEffect, useState } from 'react';
import reduce from 'lodash/reduce';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import { StyledSubtab, StyledSubtabs } from '../StyledSubtabs';

const REPAYMENT_TOTALS = 'repayment totals';
const EXPENSE_CATEGORY_TOTALS = 'expense category totals';
const TABS = [REPAYMENT_TOTALS, EXPENSE_CATEGORY_TOTALS];

export default function ExpenseTotals(props) {
  const { expenses, groupedExpenses } = props;

  const [open, setOpen] = useState(null);
  const [tab, setTab] = useState(REPAYMENT_TOTALS);
  const [principal, setPrincipal] = useState(0);
  const [interest, setInterest] = useState(0);
  const [escrow, setEscrow] = useState(0);

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
            <List disablePadding>
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
                      <ListItemText secondary={group.name} />
                      <ListItemText
                        primary={numberToCurrency.format(group.value)}
                        primaryTypographyProps={{
                          fontWeight: 'bold',
                          align: 'right',
                        }}
                        sx={{ mr: 1 }}
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
                            <ListItem key={subgroup.name}>
                              <ListItemText
                                secondary={subgroup.name}
                                sx={{ ml: 4 }}
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
                            </ListItem>
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
