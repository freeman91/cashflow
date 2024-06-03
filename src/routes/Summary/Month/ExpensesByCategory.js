import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function ExpensesByCategory(props) {
  const { year, month } = props;
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [groupedExpenses, setGroupedExpenses] = useState([]);

  useEffect(() => {
    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        tDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });

    const items = [
      ...repayments.map((repayment) => ({
        ...repayment,
        amount:
          repayment.principal +
          repayment.interest +
          (repayment.escrow ? repayment.escrow : 0),
      })),
      ...expenses,
    ];

    let _groupedExpenses = groupBy(items, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key) => {
      return {
        category: key,
        sum: reduce(_groupedExpenses[key], (sum, item) => sum + item.amount, 0),
      };
    });
    _groupedExpenses.sort((a, b) => b.sum - a.sum);
    setGroupedExpenses(_groupedExpenses);
  }, [year, month, allExpenses, allRepayments]);

  const handleClick = (group) => {
    console.log('group: ', group);
  };

  return (
    <Card raised>
      <CardHeader
        title='expenses by category'
        sx={{ p: 1, pt: '4px', pb: 0 }}
        titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer component='div'>
          <Table size='medium'>
            <TableBody>
              {groupedExpenses.map((group, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={group.category}
                    onClick={() => handleClick(group)}
                  >
                    <CustomTableCell idx={idx} component='th'>
                      {group.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(group.sum)}
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
