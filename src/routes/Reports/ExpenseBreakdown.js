import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import groupBy from 'lodash/groupBy';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import ListIcon from '@mui/icons-material/List';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../store/itemView';
import { numberToCurrency } from '../../helpers/currency';
import { findAmount } from '../../helpers/transactions';
import ExpenseCategoryBreakdown from './ExpenseCategoryBreakdown';

const REPAYMENTS = 'repayments';
const CATEGORY = 'category';
const MERCHANT = 'merchant';
const TABS = [REPAYMENTS, CATEGORY, MERCHANT];

export default function ExpenseBreakdown(props) {
  const dispatch = useDispatch();
  const { expenses, repayments } = props;
  const accounts = useSelector((state) => state.accounts.data);
  const [selectedTab, setSelectedTab] = useState(REPAYMENTS);

  const [groupedRepayments, setGroupedRepayments] = useState([]);
  const [expensesByMerchant, setExpensesByMerchant] = useState([]);

  useEffect(() => {
    let _groupedRepayments = groupBy(repayments, 'account_id');
    _groupedRepayments = Object.entries(_groupedRepayments).map(
      ([accountId, repayments]) => {
        const account = accounts.find(
          (account) => account.account_id === accountId
        );

        let _principalSum = repayments.reduce(
          (acc, repayment) => acc + get(repayment, 'principal', 0),
          0
        );
        let _interestSum = repayments.reduce(
          (acc, repayment) => acc + get(repayment, 'interest', 0),
          0
        );
        let _escrowSum = repayments.reduce(
          (acc, repayment) => acc + get(repayment, 'escrow', 0),
          0
        );
        return {
          account: account?.name,
          repayments,
          principalSum: _principalSum,
          interestSum: _interestSum,
          sum: _principalSum + _interestSum + _escrowSum,
        };
      }
    );
    setGroupedRepayments(_groupedRepayments.sort((a, b) => b.sum - a.sum));
  }, [accounts, repayments]);

  useEffect(() => {
    let _expenses = [...expenses, ...repayments];
    let _expensesByMerchant = groupBy(_expenses, 'merchant');
    _expensesByMerchant = Object.entries(_expensesByMerchant).map(
      ([merchant, expenses]) => ({
        merchant,
        expenses,
        sum: expenses.reduce((acc, expense) => acc + findAmount(expense), 0),
      })
    );
    setExpensesByMerchant(_expensesByMerchant.sort((a, b) => b.sum - a.sum));
  }, [expenses, repayments]);

  return (
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
      }}
    >
      <Stack
        direction='row'
        spacing={1}
        justifyContent='space-between'
        alignItems='center'
        sx={{ width: '100%', mt: 0.5, px: 1 }}
      >
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
        <IconButton
          onClick={() =>
            dispatch(
              openItemView({
                itemType: 'transactions',
                mode: 'view',
                attrs: {
                  label: 'All Expenses',
                  transactions: [...expenses, ...repayments],
                },
              })
            )
          }
          sx={{ height: 35, width: 35 }}
        >
          <ListIcon />
        </IconButton>
      </Stack>
      <Divider sx={{ width: '100%', mt: 1.5 }} />
      {selectedTab === REPAYMENTS && (
        <List disablePadding sx={{ width: '100%' }}>
          {groupedRepayments.map(
            ({
              account,
              sum,
              principalSum,
              interestSum,
              escrowSum,
              repayments,
            }) => (
              <React.Fragment key={account}>
                <ListItem>
                  <IconButton
                    onClick={() =>
                      dispatch(
                        openItemView({
                          itemType: 'transactions',
                          mode: 'view',
                          attrs: { label: account, transactions: repayments },
                        })
                      )
                    }
                    sx={{ height: 30, width: 30, mr: 2 }}
                  >
                    <ListIcon />
                  </IconButton>
                  <ListItemText primary={account} />
                  <ListItemText
                    primary={numberToCurrency.format(sum)}
                    slotProps={{ primary: { align: 'right' } }}
                  />
                </ListItem>
                <ListItem sx={{ px: 4 }}>
                  <ListItemText secondary='Principal' />
                  <ListItemText
                    secondary={numberToCurrency.format(principalSum)}
                    slotProps={{ secondary: { align: 'right' } }}
                  />
                </ListItem>
                {interestSum > 0 && (
                  <ListItem sx={{ px: 4 }}>
                    <ListItemText secondary='Interest' />
                    <ListItemText
                      secondary={numberToCurrency.format(interestSum)}
                      slotProps={{ secondary: { align: 'right' } }}
                    />
                  </ListItem>
                )}
                {escrowSum > 0 && (
                  <ListItem sx={{ px: 4 }}>
                    <ListItemText secondary='Escrow' />
                    <ListItemText
                      secondary={numberToCurrency.format(escrowSum)}
                      slotProps={{ secondary: { align: 'right' } }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
            )
          )}
        </List>
      )}
      {selectedTab === CATEGORY && (
        <ExpenseCategoryBreakdown expenses={expenses} repayments={repayments} />
      )}
      {selectedTab === MERCHANT && (
        <List disablePadding sx={{ width: '100%' }}>
          {expensesByMerchant.map(({ merchant, sum, expenses }) => (
            <ListItem key={merchant}>
              <IconButton
                onClick={() =>
                  dispatch(
                    openItemView({
                      itemType: 'transactions',
                      mode: 'view',
                      attrs: { label: merchant, transactions: expenses },
                    })
                  )
                }
                sx={{ height: 30, width: 30, mr: 2 }}
              >
                <ListIcon />
              </IconButton>
              <ListItemText primary={merchant} />
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
