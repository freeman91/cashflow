import React, { useEffect, useState } from 'react';
import { filter, get, includes, map, range, reduce } from 'lodash';

import { useTheme } from '@mui/styles';

import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { numberToCurrency } from '../../../helpers/currency';

const CustomTableCell = ({
  idx,
  column,
  record,
  children,
  color,
  ...restProps
}) => {
  return (
    <TableCell
      scope='row'
      {...restProps}
      sx={{
        borderBottom: 0,
        fontWeight: column === 'month' ? 800 : 500,
      }}
    >
      {children}
    </TableCell>
  );
};

export default function Month({
  day,
  showExpenses,
  showIncomes,
  selectedTypes,
}) {
  const theme = useTheme();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    if (showExpenses && allExpenses) {
      setExpenses(
        filter(allExpenses, (expense) => {
          return (
            dayjs(get(expense, 'date')).isSame(day, 'year') &&
            includes(selectedTypes, get(expense, 'type'))
          );
        })
      );
    } else {
      setExpenses([]);
    }
  }, [day, allExpenses, selectedTypes, showExpenses]);

  useEffect(() => {
    if (showIncomes && allIncomes) {
      setIncomes(
        filter(allIncomes, (income) => {
          return dayjs(get(income, 'date')).isSame(day, 'year');
        })
      );
    } else {
      setIncomes([]);
    }
  }, [day, allIncomes, selectedTypes, showIncomes]);

  const renderTable = () => {
    const today = dayjs();
    const divisor = (() => {
      if (today.isSame(day, 'year')) {
        return day.month() + 1;
      } else return 12;
    })();

    const incomeTotal = reduce(
      incomes,
      (acc, income) => acc + get(income, 'amount', 0),
      0
    );
    const expenseTotal = reduce(
      expenses,
      (acc, expense) => acc + get(expense, 'amount', 0),
      0
    );
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer sx={{ mt: 2, maxWidth: 800, minWidth: 500 }}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>month</TableCell>
                {showIncomes ? (
                  <TableCell align='right'>income</TableCell>
                ) : null}
                {showExpenses ? (
                  <TableCell align='right'>expense</TableCell>
                ) : null}
                {showExpenses && showIncomes ? (
                  <TableCell align='right'>net</TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {map(range(12), (month) => {
                if (
                  today.isSame(day, 'year') &&
                  today.month(month).isAfter(day, 'month')
                ) {
                  return null;
                }
                let expenseSum = reduce(
                  filter(
                    expenses,
                    (expense) =>
                      dayjs(expense.date).month() === month &&
                      get(expense, 'paid', true)
                  ),
                  (acc, expense) => {
                    return acc + get(expense, 'amount', 0);
                  },
                  0
                );

                let incomeSum = reduce(
                  filter(
                    incomes,
                    (income) => dayjs(income.date).month() === month
                  ),
                  (acc, income) => {
                    return acc + get(income, 'amount', 0);
                  },
                  0
                );

                return (
                  <TableRow hover={true} key={month}>
                    <CustomTableCell component='th' column='month'>
                      {dayjs().month(month).format('MMMM')}
                    </CustomTableCell>
                    {showIncomes ? (
                      <CustomTableCell align='right'>
                        {numberToCurrency.format(incomeSum)}
                      </CustomTableCell>
                    ) : null}
                    {showExpenses ? (
                      <CustomTableCell align='right'>
                        {numberToCurrency.format(expenseSum)}
                      </CustomTableCell>
                    ) : null}
                    {showIncomes && showExpenses ? (
                      <CustomTableCell align='right'>
                        {numberToCurrency.format(incomeSum - expenseSum)}
                      </CustomTableCell>
                    ) : null}
                  </TableRow>
                );
              })}
              <TableRow hover={true} key={'total'}>
                <TableCell
                  component='th'
                  column='month'
                  sx={{
                    borderBottom: 0,
                    borderTop: '1px solid rgba(81, 81, 81, .5)',
                  }}
                >
                  total
                </TableCell>
                {showIncomes ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(incomeTotal)}
                  </TableCell>
                ) : null}

                {showExpenses ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(expenseTotal)}
                  </TableCell>
                ) : null}

                {showIncomes && showExpenses ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(incomeTotal - expenseTotal)}
                  </TableCell>
                ) : null}
              </TableRow>
              <TableRow hover={true} key={'average'}>
                <TableCell
                  component='th'
                  column='month'
                  sx={{
                    borderBottom: 0,
                    borderTop: '1px solid rgba(81, 81, 81, .5)',
                  }}
                >
                  average
                </TableCell>
                {showIncomes ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(incomeTotal / divisor)}
                  </TableCell>
                ) : null}

                {showExpenses ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(expenseTotal / divisor)}
                  </TableCell>
                ) : null}

                {showIncomes && showExpenses ? (
                  <TableCell
                    align='right'
                    sx={{
                      borderBottom: 0,
                      borderTop: '1px solid rgba(81, 81, 81, .5)',
                    }}
                  >
                    {numberToCurrency.format(
                      (incomeTotal - expenseTotal) / divisor
                    )}
                  </TableCell>
                ) : null}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div style={{ marginTop: theme.spacing(1) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      ></div>
      {renderTable()}
    </div>
  );
}
