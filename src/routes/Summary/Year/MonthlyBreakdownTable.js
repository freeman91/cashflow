import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function MonthlyBreakdownTable(props) {
  const {
    year,
    incomeSumByMonth,
    setIncomeSumByMonth,
    expenseSumByMonth,
    setExpenseSumByMonth,
  } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  useEffect(() => {
    let yearIncomes = filter(
      allIncomes,
      (income) => dayjs(income.date).year() === year
    );
    let yearPaychecks = filter(
      allPaychecks,
      (paycheck) => dayjs(paycheck.date).year() === year
    );

    let _months = map(MONTHS, (month) => {
      let _incomes = filter(
        yearIncomes,
        (income) => dayjs(income.date).month() === month
      );
      let _paychecks = filter(
        yearPaychecks,
        (paycheck) => dayjs(paycheck.date).month() === month
      );
      return (
        reduce(_incomes, (sum, income) => sum + income.amount, 0) +
        reduce(_paychecks, (sum, paycheck) => sum + paycheck.take_home, 0)
      );
    });
    setIncomeSumByMonth(_months);
  }, [year, allIncomes, allPaychecks, setIncomeSumByMonth]);

  useEffect(() => {
    let yearExpenses = filter(
      allExpenses,
      (expense) => dayjs(expense.date).year() === year && !expense.pending
    );

    let yearRepayments = filter(
      allRepayments,
      (repayment) => dayjs(repayment.date).year() === year && !repayment.pending
    );

    let _months = map(MONTHS, (month) => {
      let _expenses = filter(
        yearExpenses,
        (expense) => dayjs(expense.date).month() === month
      );
      let _repayments = filter(
        yearRepayments,
        (repayment) => dayjs(repayment.date).month() === month
      );
      return (
        reduce(_expenses, (sum, expense) => sum + expense.amount, 0) +
        reduce(
          _repayments,
          (sum, repayment) =>
            sum +
            repayment.principal +
            repayment.interest +
            (repayment.escrow ? repayment.escrow : 0),
          0
        )
      );
    });

    setExpenseSumByMonth(_months);
  }, [year, allExpenses, allRepayments, setExpenseSumByMonth]);

  const handleMonthClick = (month) => {
    dispatch(push(`/summary/${year}/${month + 1}`));
  };

  return (
    <TableContainer
      component='div'
      sx={{
        borderTopRightRadius: '10px',
        borderTopLeftRadius: '10px',
        background: (theme) =>
          `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
      }}
    >
      <Table size='medium'>
        <TableHead>
          <TableRow key='headers'>
            <TableCell sx={{ p: 1, pl: 2, pb: 0 }} />
            <TableCell sx={{ p: 1, pb: 0 }} align='center'>
              incomes
            </TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='center'>
              expenses
            </TableCell>
            <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
              net
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {MONTHS.map((month) => {
            const incomeSum = incomeSumByMonth[month];
            const expenseSum = expenseSumByMonth[month];
            const net = incomeSum - expenseSum;

            if (incomeSum === 0 && expenseSum === 0) return null;

            return (
              <TableRow
                hover={true}
                key={month}
                onClick={() => handleMonthClick(month)}
              >
                <CustomTableCell idx={month} component='th' column='date'>
                  {dayjs().month(month).format('MMM')}
                </CustomTableCell>
                <CustomTableCell idx={month} align='right'>
                  {numberToCurrency.format(incomeSum)}
                </CustomTableCell>
                <CustomTableCell idx={month} align='right'>
                  {numberToCurrency.format(expenseSum)}
                </CustomTableCell>
                <CustomTableCell
                  idx={month}
                  align='right'
                  sx={{
                    color:
                      net < 0
                        ? theme.palette.danger.main
                        : theme.palette.success.main,
                  }}
                >
                  {numberToCurrency.format(net)}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
