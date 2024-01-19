import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';

import { getExpenses } from '../../store/expenses';
import NewTransactionButton from '../../components/NewTransactionButton';
import { RANGE_OPTIONS } from '../../components/Selector/RangeSelect';
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
  }, [range, dispatch]);

  return (
    <div style={{ marginTop: 8 }}>
      <FilterOptions range={range} setRange={setRange} />
      <ExpenseTable expenses={tableData} />
      <NewTransactionButton transactionTypes={['expense', 'income', 'bill']} />
    </div>
  );
}
