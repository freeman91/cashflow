import React from 'react';
import { reduce } from 'lodash';

import { FormControl, Input, InputLabel, InputAdornment } from '@mui/material';
import AccountBalance from '@mui/icons-material/AccountBalance';
import AttachMoney from '@mui/icons-material/AttachMoney';
import HourglassBottom from '@mui/icons-material/HourglassBottom';
import WorkOutline from '@mui/icons-material/WorkOutline';
import { numberToCurrency, _numberToCurrency } from '../../helpers/currency';

export default function SummaryTotalsContainer({
  expenses,
  incomes,
  hours,
  filterExpense,
  filterIncome,
  filterHour,
}) {
  const textFieldStyle = {
    mr: '2rem',
  };

  const expenseTotal = filterExpense
    ? 0
    : reduce(
        expenses,
        (sum, expense) => {
          return sum + expense.amount;
        },
        0
      );
  const incomeTotal = filterIncome
    ? 0
    : reduce(
        incomes,
        (sum, income) => {
          return sum + income.amount;
        },
        0
      );
  const hourTotal = filterHour
    ? 0
    : reduce(
        hours,
        (sum, hour) => {
          return sum + hour.amount;
        },
        0
      );

  return (
    <>
      <FormControl variant='standard'>
        <InputLabel
          htmlFor='expense-field'
          sx={{
            ml: '4rem',
          }}
        >
          Expense Total
        </InputLabel>
        <Input
          readOnly
          id='expense-field'
          sx={textFieldStyle}
          value={'         ' + numberToCurrency.format(expenseTotal)}
          startAdornment={
            <InputAdornment position='start'>
              <AttachMoney />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant='standard'>
        <InputLabel
          htmlFor='income-field'
          sx={{
            ml: '4rem',
          }}
        >
          Income Total
        </InputLabel>
        <Input
          readOnly
          id='income-field'
          sx={textFieldStyle}
          value={'         ' + numberToCurrency.format(incomeTotal)}
          startAdornment={
            <InputAdornment position='start'>
              <AccountBalance />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant='standard'>
        <InputLabel
          htmlFor='hour-field'
          sx={{
            ml: '3rem',
          }}
        >
          Total Hours Worked
        </InputLabel>
        <Input
          readOnly
          id='hour-field'
          sx={textFieldStyle}
          value={'          ' + _numberToCurrency.format(hourTotal)}
          startAdornment={
            <InputAdornment position='start'>
              <HourglassBottom />
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl variant='standard'>
        <InputLabel
          htmlFor='pay-rate-field'
          sx={{
            ml: '4rem',
          }}
        >
          Pay Rate
        </InputLabel>
        <Input
          readOnly
          id='pay-rate-field'
          sx={textFieldStyle}
          value={
            '        ' +
            numberToCurrency.format(
              hourTotal !== 0 ? incomeTotal / hourTotal : 0
            ) +
            ' / hr'
          }
          startAdornment={
            <InputAdornment position='start'>
              <WorkOutline />
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  );
}
