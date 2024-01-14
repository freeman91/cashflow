import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { getExpenses } from '../../store/expenses';
import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';
import NewTransactionButton from '../../components/NewTransactionButton';
import RangeSelect, {
  RANGE_OPTIONS,
} from '../../components/Selector/RangeSelect';
import ExpenseTable from './ExpenseTable';
import FilterOptions from './FilterOptions';

export default function Expenses() {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _expenses = [...allExpenses, ...allRepayments];

    _expenses = filter(_expenses, (expense) => {
      return dayjs(expense.date).isBetween(range.start, range.end);
    });

    _expenses = sortBy(_expenses, 'date');
    setTableData(_expenses);
  }, [allExpenses, allRepayments, range]);

  useEffect(() => {
    dispatch(getExpenses({ range }));
  }, [range]);

  return (
    <div style={{ marginTop: 8 }}>
      <FilterOptions range={range} setRange={setRange} />
      <ExpenseTable expenses={tableData} />
      <NewTransactionButton transactionTypes={['expense', 'income', 'bill']} />
    </div>
  );
}
