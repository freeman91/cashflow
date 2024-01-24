import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
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

  const [typeFilter, setTypeFilter] = useState(['expense', 'repayment']);
  const [amountFilter, setAmountFilter] = useState({
    comparator: '',
    amount: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [billFilter, setBillFilter] = useState('');
  const [pendingFilter, setPendingFilter] = useState(['pending', 'paid']);

  useEffect(() => {
    let _expenses = [...allExpenses, ...allRepayments];

    // filter by date
    _expenses = filter(_expenses, (expense) => {
      return dayjs(expense.date).isBetween(range.start, range.end);
    });

    // filter by type
    _expenses = filter(_expenses, (expense) => {
      return includes(typeFilter, expense._type);
    });

    // filter by pending
    if (pendingFilter.length == 1) {
      _expenses = filter(_expenses, (expense) => {
        const filterString = pendingFilter[0];
        if (filterString == 'paid') {
          return !expense.pending;
        } else if (filterString == 'pending') {
          return expense.pending;
        }
      });
    } else if (pendingFilter.length == 0) {
      _expenses = [];
    }

    // TODO: filter by amount

    // filter by category
    if (categoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.category == categoryFilter;
      });
    }

    // filter by subcategory
    if (subcategoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.subcategory == subcategoryFilter;
      });
    }

    // filter by vendor
    if (vendorFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.vendor == vendorFilter;
      });
    }

    // filter by bill
    if (billFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.bill_id == billFilter.bill_id;
      });
    }

    _expenses = sortBy(_expenses, 'date');
    setTableData(_expenses);
  }, [
    allExpenses,
    allRepayments,
    range,
    typeFilter,
    amountFilter,
    categoryFilter,
    subcategoryFilter,
    vendorFilter,
    billFilter,
    pendingFilter,
  ]);

  useEffect(() => {
    dispatch(getExpenses({ range }));
  }, [range, dispatch]);

  return (
    <div style={{ marginTop: 8, width: '100%', maxWidth: 800 }}>
      <FilterOptions
        range={range}
        setRange={setRange}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        pendingFilter={pendingFilter}
        setPendingFilter={setPendingFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        subcategoryFilter={subcategoryFilter}
        setSubcategoryFilter={setSubcategoryFilter}
        vendorFilter={vendorFilter}
        setVendorFilter={setVendorFilter}
        billFilter={billFilter}
        setBillFilter={setBillFilter}
      />
      <ExpenseTable expenses={tableData} />
      <NewTransactionButton transactionTypes={['expense', 'income', 'bill']} />
    </div>
  );
}
