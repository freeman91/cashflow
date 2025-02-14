import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import startCase from 'lodash/startCase';

import ListIcon from '@mui/icons-material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { openItemView } from '../../store/itemView';
import { numberToCurrency } from '../../helpers/currency';
import {
  findAmount,
  findPaycheckContributionSum,
} from '../../helpers/transactions';

const EARNED = 'earned';
const PASSIVE = 'passive';
const OTHER = 'other';
const TABS = [EARNED, PASSIVE, OTHER];

export default function IncomeBreakdown(props) {
  const { earnedIncomes, passiveIncomes, otherIncomes } = props;
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState(EARNED);
  const [groupedEarnedIncomes, setGroupedEarnedIncomes] = useState([]);
  const [groupedPassiveIncomes, setGroupedPassiveIncomes] = useState([]);
  const [groupedOtherIncomes, setGroupedOtherIncomes] = useState([]);

  useEffect(() => {
    let _groupedEarnedIncomes = groupBy(earnedIncomes.transactions, 'employer');
    _groupedEarnedIncomes = Object.entries(_groupedEarnedIncomes).map(
      ([employer, transactions]) => {
        const takeHome = transactions.reduce(
          (acc, transaction) => acc + findAmount(transaction),
          0
        );
        const employeeContributions = transactions.reduce(
          (acc, transaction) =>
            acc + findPaycheckContributionSum(transaction, 'employee'),
          0
        );
        const employerContributions = transactions.reduce(
          (acc, transaction) =>
            acc + findPaycheckContributionSum(transaction, 'employer'),
          0
        );
        return {
          employer,
          transactions,
          sum: takeHome + employeeContributions + employerContributions,
          takeHome,
          employeeContributions,
          employerContributions,
        };
      }
    );
    setGroupedEarnedIncomes(
      _groupedEarnedIncomes.sort((a, b) => b.sum - a.sum)
    );
  }, [earnedIncomes]);

  useEffect(() => {
    let _groupedPassiveIncomes = passiveIncomes.transactions.map(
      (transaction) => {
        if (transaction._type === 'sale')
          return {
            ...transaction,
            category: 'Capital Gains',
          };
        return transaction;
      }
    );
    _groupedPassiveIncomes = groupBy(_groupedPassiveIncomes, 'category');
    _groupedPassiveIncomes = Object.entries(_groupedPassiveIncomes).map(
      ([category, transactions]) => {
        return {
          category,
          transactions,
          sum: transactions.reduce((acc, transaction) => {
            if (transaction._type === 'sale')
              return acc + get(transaction, 'gains', 0);
            return acc + findAmount(transaction);
          }, 0),
        };
      }
    );
    setGroupedPassiveIncomes(
      _groupedPassiveIncomes.sort((a, b) => b.sum - a.sum)
    );
  }, [passiveIncomes]);

  useEffect(() => {
    let _groupedOtherIncomes = groupBy(otherIncomes.transactions, 'category');
    _groupedOtherIncomes = Object.entries(_groupedOtherIncomes).map(
      ([category, transactions]) => ({
        category,
        transactions,
        sum: transactions.reduce((acc, transaction) => {
          return acc + findAmount(transaction);
        }, 0),
      })
    );
    setGroupedOtherIncomes(_groupedOtherIncomes.sort((a, b) => b.sum - a.sum));
  }, [otherIncomes]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        p: 1,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack
        direction='row'
        spacing={1}
        justifyContent='space-between'
        alignItems='center'
        sx={{ width: '100%', mt: 0.5, px: 1 }}
      >
        <IconButton
          onClick={() => {
            dispatch(
              openItemView({
                itemType: 'transactions',
                mode: 'view',
                attrs: {
                  label: 'All Incomes',
                  transactions: [
                    ...earnedIncomes.transactions,
                    ...passiveIncomes.transactions,
                    ...otherIncomes.transactions,
                  ],
                },
              })
            );
          }}
          sx={{ height: 35, width: 35 }}
        >
          <ListIcon />
        </IconButton>
        {TABS.map((tab) => (
          <Box
            key={tab}
            onClick={() => setSelectedTab(tab)}
            sx={{
              backgroundColor: 'background.paper',
              backgroundImage: (theme) =>
                selectedTab === tab
                  ? theme.vars.overlays[24]
                  : theme.vars.overlays[8],
              boxShadow: (theme) =>
                selectedTab === tab ? theme.shadows[4] : 'unset',
              borderRadius: 4,
              py: 0.5,
              px: 3,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'background.paper',
                backgroundImage: (theme) => theme.vars.overlays[24],
              },
            }}
          >
            <Typography
              variant='body2'
              color={selectedTab === tab ? 'text.primary' : 'text.secondary'}
            >
              {startCase(tab)}
            </Typography>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ width: '100%', mt: 1.5 }} />
      {selectedTab === EARNED && (
        <List disablePadding sx={{ width: '100%' }}>
          {groupedEarnedIncomes.map(
            ({
              employer,
              sum,
              transactions,
              takeHome,
              employeeContributions,
              employerContributions,
            }) => (
              <React.Fragment key={employer}>
                <ListItem disableGutters>
                  <IconButton
                    onClick={() => {
                      dispatch(
                        openItemView({
                          itemType: 'transactions',
                          mode: 'view',
                          attrs: {
                            label: employer,
                            transactions,
                          },
                        })
                      );
                    }}
                    sx={{ height: 30, width: 30, mr: 2 }}
                  >
                    <ListIcon />
                  </IconButton>
                  <ListItemText primary={employer} />
                  <ListItemText
                    primary={numberToCurrency.format(sum)}
                    slotProps={{ primary: { align: 'right' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 4 }}>
                  <ListItemText secondary='Take Home' />
                  <ListItemText
                    secondary={numberToCurrency.format(takeHome)}
                    slotProps={{ secondary: { align: 'right' } }}
                  />
                </ListItem>
                {employeeContributions > 0 && (
                  <ListItem sx={{ px: 4 }}>
                    <ListItemText secondary='Employee Contributions' />
                    <ListItemText
                      secondary={numberToCurrency.format(employeeContributions)}
                      slotProps={{ secondary: { align: 'right' } }}
                    />
                  </ListItem>
                )}
                {employerContributions > 0 && (
                  <ListItem sx={{ px: 4 }}>
                    <ListItemText secondary='Employer Contributions' />
                    <ListItemText
                      secondary={numberToCurrency.format(employerContributions)}
                      slotProps={{ secondary: { align: 'right' } }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
            )
          )}
        </List>
      )}
      {selectedTab === PASSIVE && (
        <List disablePadding sx={{ width: '100%' }}>
          {groupedPassiveIncomes.map(({ category, sum, transactions }) => (
            <ListItem key={category} disableGutters>
              <IconButton
                onClick={() => {
                  dispatch(
                    openItemView({
                      itemType: 'transactions',
                      mode: 'view',
                      attrs: { label: category, transactions },
                    })
                  );
                }}
                sx={{ height: 30, width: 30, mr: 2 }}
              ></IconButton>
              <ListItemText primary={category} />
              <ListItemText
                primary={numberToCurrency.format(sum)}
                slotProps={{ primary: { align: 'right' } }}
              />
            </ListItem>
          ))}
        </List>
      )}
      {selectedTab === OTHER && (
        <List disablePadding sx={{ width: '100%' }}>
          {groupedOtherIncomes.map(({ category, sum, transactions }) => (
            <ListItem key={category} disableGutters>
              <IconButton
                onClick={() => console.log('show transactions', transactions)}
                sx={{ height: 30, width: 30, mr: 2 }}
              >
                <ListIcon />
              </IconButton>
              <ListItemText primary={startCase(category)} />
              <ListItemText
                primary={numberToCurrency.format(sum)}
                slotProps={{ primary: { align: 'right' } }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
