import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { cloneDeep, map, sortBy } from 'lodash';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Record from './Record';
import { openDialog } from '../../../store/dialogs';

export default function Day({ date, sameMonth, expenses, incomes }) {
  const dispatch = useDispatch();
  let isToday = dayjs().isSame(date, 'day');

  const [anchorEl, setAnchorEl] = useState(null);
  const [dayExpenses, setDayExpenses] = useState([]);

  useEffect(() => {
    let _dayExpenses = cloneDeep(expenses);
    _dayExpenses = sortBy(_dayExpenses, 'pending');
    _dayExpenses = sortBy(_dayExpenses, 'amount').reverse();
    setDayExpenses(_dayExpenses);
  }, [expenses]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeClick = (type) => {
    dispatch(
      openDialog({
        type,
        mode: 'create',
        attrs: {
          date,
        },
      })
    );
    handleClose();
  };

  return (
    <Card
      raised
      sx={{
        width: '8rem',
        height: '10rem',
        opacity: sameMonth ? 1 : 0.5,
      }}
    >
      <CardHeader
        disableTypography
        sx={{ p: 0, pt: '2px', pl: '4px', pr: '4px' }}
        title={
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems='center'
          >
            <IconButton onClick={handleClick} sx={{ p: 0 }}>
              <AddIcon />
            </IconButton>
            <Typography align='center' variant='body2' sx={{ lineHeight: 1 }}>
              {date.format('ddd')}
            </Typography>
            <Chip
              label={date.date()}
              variant={isToday ? 'filled' : 'outlined'}
              size='small'
            />
          </Stack>
        }
      />
      <CardContent sx={{ p: 0, pb: '4px !important' }}>
        <Stack sx={{ width: '100%' }}>
          {map(incomes, (income) => {
            return (
              <Record
                key={income.income_id ? income.income_id : income.paycheck_id}
                data={income}
              />
            );
          })}
          {map(dayExpenses, (expense) => {
            return (
              <Record
                key={
                  expense.expense_id ? expense.expense_id : expense.repayment_id
                }
                data={expense}
              />
            );
          })}
        </Stack>
      </CardContent>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              backgroundImage: 'unset',
              backgroundColor: 'unset',
              boxShadow: 'unset',
            },
          },
        }}
      >
        <Stack
          direction='column'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
        >
          {['expense', 'income', 'paycheck'].map((type) => (
            <Button
              key={type}
              variant='contained'
              onClick={() => handleTypeClick(type)}
              sx={{ width: '100%' }}
            >
              {type}
            </Button>
          ))}
        </Stack>
      </Popover>
    </Card>
  );
}
