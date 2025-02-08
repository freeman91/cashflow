import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import { findAmount } from '../../helpers/transactions';

export const TRANSACTION_ORDER = [
  'recurring',
  'income',
  'paycheck',
  'repayment',
  'expense',
  'transfer',
  'borrow',
  'purchase',
  'sale',
];

export const useTransactionsInRange = (types, range, reverse = false) => {
  const allBorrows = useSelector((state) => state.borrows.data);
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);
  const allPurchases = useSelector((state) => state.purchases.data);
  const allRecurrings = useSelector((state) => state.recurrings.data);
  const allSales = useSelector((state) => state.sales.data);

  const [days, setDays] = useState([]);
  const [recurrings, setRecurrings] = useState([]);

  useEffect(() => {
    const filteredRecurrings = filter(allRecurrings, (recurring) => {
      if (types.length > 0 && !types.includes(recurring.item_type)) {
        return false;
      }
      return recurring.active;
    });
    setRecurrings(filteredRecurrings);
  }, [allRecurrings, types]);

  useEffect(() => {
    if (!range?.start || !range?.end) return;
    let _days = [];
    let _allTransactions = [
      ...allExpenses,
      ...allRepayments,
      ...allIncomes,
      ...allPaychecks,
      ...allPurchases,
      ...allSales,
      ...allBorrows,
    ].filter((transaction) => {
      if (types.length > 0 && !types.includes(transaction._type)) return false;
      return true;
    });

    _allTransactions = _allTransactions.concat(recurrings);

    let currentDate = range.start;
    while (currentDate <= range.end) {
      const stableDate = currentDate;
      let dayTransactions = _allTransactions.filter((transaction) => {
        if (!transaction.date && !transaction.next_date) return false;
        return dayjs(transaction.date || transaction.next_date).isSame(
          stableDate,
          'day'
        );
      });
      dayTransactions = dayTransactions.map((transaction) => ({
        ...transaction,
        _amount: findAmount(transaction),
      }));
      dayTransactions = dayTransactions.sort((a, b) => {
        return (
          TRANSACTION_ORDER.indexOf(a._type) -
            TRANSACTION_ORDER.indexOf(b._type) || b._amount - a._amount
        );
      });
      _days.push({
        date: currentDate,
        transactions: dayTransactions,
      });
      currentDate = dayjs(currentDate).add(1, 'day');
    }
    if (reverse) {
      setDays(_days.reverse());
    } else {
      setDays(_days);
    }
  }, [
    allExpenses,
    allRepayments,
    allIncomes,
    allPaychecks,
    allPurchases,
    allSales,
    allBorrows,
    recurrings,
    types,
    range,
    reverse,
  ]);

  return days;
};

export default useTransactionsInRange;
