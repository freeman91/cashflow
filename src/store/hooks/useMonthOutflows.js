import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

import { findAmount } from '../../helpers/transactions';
import { getExpenses } from '../expenses';
import { getRepayments } from '../repayments';

const filterByData = (data, start, end) => {
  return filter(data, (item) => {
    const itemDate = dayjs(item.date);
    return (
      itemDate.isSameOrAfter(start, 'day') &&
      itemDate.isSameOrBefore(end, 'day') &&
      !item.pending
    );
  });
};

export const useMonthOutflows = (year, month) => {
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);
  const allSales = useSelector((state) => state.sales.data);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [principalSum, setPrincipalSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);
  const [otherExpenseSum, setOtherExpenseSum] = useState(0);

  useEffect(() => {
    if (!year || !month) return;

    let _start = null;
    let _end = null;
    let date = dayjs().set('year', year);

    date = date.set('month', month);
    _start = date.startOf('month');
    _end = date.endOf('month');

    setStart(_start);
    setEnd(_end);
    dispatch(getExpenses({ range: { start: _start, end: _end } }));
    dispatch(getRepayments({ range: { start: _start, end: _end } }));
  }, [dispatch, year, month]);

  useEffect(() => {
    let _repayments = filterByData(allRepayments, start, end);
    let _expenses = filterByData(allExpenses, start, end);
    let _sales = filterByData(allSales, start, end);

    let {
      principalSum: _principalSum,
      interestSum: _interestSum,
      escrowSum: _escrowSum,
    } = reduce(
      _repayments,
      (acc, repayment) => {
        return {
          principalSum: acc.principalSum + get(repayment, 'principal', 0),
          interestSum: acc.interestSum + get(repayment, 'interest', 0),
          escrowSum: acc.escrowSum + get(repayment, 'escrow', 0),
        };
      },
      { principalSum: 0, interestSum: 0, escrowSum: 0 }
    );

    let _otherExpenseSum = reduce(
      _expenses,
      (acc, expense) => {
        return acc + findAmount(expense);
      },
      0
    );

    let saleLosses = reduce(
      _sales,
      (acc, sale) => {
        return acc + get(sale, 'loss', 0);
      },
      0
    );

    setExpenses(_expenses);
    setRepayments(_repayments);

    setPrincipalSum(_principalSum);
    setInterestSum(_interestSum);
    setEscrowSum(_escrowSum);
    setOtherExpenseSum(_otherExpenseSum + saleLosses);
  }, [start, end, allExpenses, allRepayments, allSales]);

  return {
    expenses,
    repayments,
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
  };
};

export default useMonthOutflows;
