import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import { findId } from '../../../helpers/transactions';
import { getExpenses } from '../../../store/expenses';
import FilterDialog from './FilterDialog';
import ExpensesSummary from './ExpensesSummary';
import TransactionBox from '../../../components/TransactionBox';

export default function Expenses(props) {
  const { range, mainFilter, filterDialogOpen, setFilterDialogOpen } = props;

  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [filteredExpenses, setFilteredExpenses] = useState([]);
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
    if (pendingFilter.length === 1) {
      _expenses = filter(_expenses, (expense) => {
        const filterString = pendingFilter[0];
        if (filterString === 'paid') {
          return !expense.pending;
        } else if (filterString === 'pending') {
          return expense.pending;
        }
      });
    } else if (pendingFilter.length === 0) {
      _expenses = [];
    }

    // filter by amount
    if (amountFilter.comparator && amountFilter.amount) {
      _expenses = filter(_expenses, (expense) => {
        const filterAmount = Number(amountFilter.amount);
        const amount = (() => {
          if (expense._type === 'expense') {
            return expense.amount;
          } else if (expense._type === 'repayment') {
            return (
              get(expense, 'principal', 0) +
              get(expense, 'interest', 0) +
              get(expense, 'escrow', 0)
            );
          } else {
            return 0;
          }
        })();

        if (amountFilter.comparator === '>') {
          return amount > filterAmount;
        } else if (amountFilter.comparator === '<') {
          return amount < filterAmount;
        } else if (amountFilter.comparator === '=') {
          return amount === filterAmount;
        }
      });
    }

    // filter by main filter
    if (mainFilter) {
      _expenses = filter(_expenses, (expense) => {
        return (
          expense.vendor?.toLowerCase().includes(mainFilter.toLowerCase()) ||
          expense.category?.toLowerCase().includes(mainFilter.toLowerCase()) ||
          expense.subcategory
            ?.toLowerCase()
            .includes(mainFilter.toLowerCase()) ||
          expense.description?.toLowerCase().includes(mainFilter.toLowerCase())
        );
      });
    }

    // filter by category
    if (categoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.category === categoryFilter;
      });
    }

    // filter by subcategory
    if (subcategoryFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.subcategory === subcategoryFilter;
      });
    }

    // filter by vendor
    if (vendorFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.vendor === vendorFilter;
      });
    }

    // filter by bill
    if (billFilter) {
      _expenses = filter(_expenses, (expense) => {
        return expense.bill_id === billFilter.bill_id;
      });
    }

    _expenses = sortBy(_expenses, 'date');
    setFilteredExpenses(_expenses);
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
    mainFilter,
  ]);

  useEffect(() => {
    dispatch(getExpenses({ range }));
  }, [range, dispatch]);

  return (
    <>
      <Grid item xs={12} mx={1}>
        <ExpensesSummary expenses={filteredExpenses} />
      </Grid>

      {filteredExpenses.length > 0 && (
        <Grid item xs={12} mx={1}>
          <Card>
            <Stack spacing={1} direction='column' py={1}>
              {map(filteredExpenses, (expense, idx) => {
                const key = findId(expense);
                return (
                  <React.Fragment key={key}>
                    <TransactionBox transaction={expense} />
                    {idx < filteredExpenses.length - 1 && (
                      <Divider sx={{ mx: '8px !important' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </Stack>
          </Card>
        </Grid>
      )}
      <FilterDialog
        title='filter options'
        open={filterDialogOpen}
        setOpen={setFilterDialogOpen}
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
    </>
  );
}
