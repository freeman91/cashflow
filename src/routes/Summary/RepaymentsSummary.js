import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { openDialog } from '../../store/dialogs';
import { findAmount } from '../../helpers/transactions';
import LabelValueBox from '../../components/LabelValueBox';
import TransactionsByMonth from './TransactionsByMonth';
import MenuItemContent from '../../components/MenuItemContent';

export default function RepaymentsSummary(props) {
  const {
    year,
    month,
    numMonths,
    principalSum,
    interestSum,
    escrowSum,
    repayments,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const allDebts = useSelector((state) => state.debts.data);

  const [selected, setSelected] = useState({
    name: '',
    sum: 0,
    principal: 0,
    interest: 0,
    escrow: 0,
    repayments: [],
  });
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    let debtIds = repayments.map((r) => r.debt_id).filter(Boolean);
    let uniqueDebtIds = [...new Set(debtIds)];
    let _debts = uniqueDebtIds.map((id) => {
      let debt = allDebts.find((d) => d.debt_id === id);
      let debtRepayments = repayments.filter((r) => r.debt_id === id);
      let sum = debtRepayments.reduce(
        (acc, repayment) => acc + findAmount(repayment),
        0
      );
      let principal = debtRepayments.reduce(
        (acc, repayment) => acc + get(repayment, 'principal', 0),
        0
      );
      let interest = debtRepayments.reduce(
        (acc, repayment) => acc + get(repayment, 'interest', 0),
        0
      );
      let escrow = debtRepayments.reduce(
        (acc, repayment) => acc + get(repayment, 'escrow', 0),
        0
      );

      return {
        ...debt,
        sum,
        principal,
        interest,
        escrow,
        repayments: debtRepayments,
      };
    });
    _debts = _debts.sort((a, b) => b.sum - a.sum);
    setDebts(_debts);
  }, [repayments, allDebts]);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  let _principalSum = selected.name ? selected.principal : principalSum;
  let _interestSum = selected.name ? selected.interest : interestSum;
  let _escrowSum = selected.name ? selected.escrow : escrowSum;

  const show = _principalSum > 0 || _interestSum > 0 || _escrowSum > 0;
  return (
    <>
      <Grid item xs={12} mx={1}>
        <Select
          displayEmpty
          fullWidth
          value={selected.name}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
            slotProps: {
              paper: {
                sx: { minWidth: '300px !important', maxWidth: '350px' },
              },
            },
          }}
          sx={{
            '& .MuiSelect-select': { py: 0, px: 2 },
          }}
        >
          <MenuItem
            value=''
            onClick={() =>
              setSelected({
                name: '',
                sum: 0,
                principal: 0,
                interest: 0,
                escrow: 0,
                repayments: [],
              })
            }
          >
            <ListItemText primary='debts' />
          </MenuItem>
          {debts.map((debt) => {
            const { name, sum, principal, interest, escrow, repayments } = debt;
            return (
              <MenuItem
                key={name}
                value={name}
                onClick={() => {
                  setSelected({
                    name: name,
                    sum: sum,
                    principal: principal,
                    interest: interest,
                    escrow: escrow,
                    repayments: repayments,
                  });
                }}
              >
                <MenuItemContent name={name} sum={sum} />
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      {numMonths > 1 && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.surface[300]}`,
              borderRadius: 1,
            }}
          >
            <LabelValueBox
              value={(_principalSum + _interestSum + _escrowSum) / numMonths}
              label='average'
            />
          </Box>
        </Grid>
      )}
      {show && (
        <Grid item xs={12} mx={1}>
          <Box
            sx={{
              width: '100%',
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.surface[300]}`,
              borderRadius: 1,
            }}
          >
            {_principalSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={_principalSum} label='principal' />
              </Box>
            )}

            {_interestSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={_interestSum} label='interest' />
              </Box>
            )}
            {_escrowSum > 0 && (
              <Box sx={{ width: '100%', py: 0.5 }}>
                <LabelValueBox value={_escrowSum} label='escrow' />
              </Box>
            )}
          </Box>
        </Grid>
      )}

      {year && isNaN(month) && (
        <TransactionsByMonth
          year={year}
          transactions={selected.name ? selected.repayments : repayments}
          color={theme.palette.error.main}
        />
      )}

      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <Button
          variant='outlined'
          color='primary'
          onClick={() =>
            openTransactionsDialog(
              selected.name ? `${selected.name} repayments` : 'repayments',
              selected.name ? selected.repayments : repayments
            )
          }
        >
          show all
        </Button>
      </Grid>
    </>
  );
}
