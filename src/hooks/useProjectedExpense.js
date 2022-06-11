import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { filter, get, reduce } from 'lodash';

const useProjectedExpense = (date) => {
  let now = dayjs();
  const [day, setDay] = useState(now);
  let user = useSelector((state) => state.user);
  let expenses = useSelector((state) => state.expenses.data);
  let daysRemainingInMonth = (() => {
    if (day.isBefore(now, 'month')) {
      return 0;
    }
    if (day.isSame(now, 'month')) {
      return day.daysInMonth() - day.date();
    }
    return day.daysInMonth();
  })();

  useEffect(() => {
    if (date) {
      setDay(date);
    }
  }, [date]);

  let monthExpenses = filter(expenses, (expense) => {
    return day.isSame(dayjs(get(expense, 'date')), 'month');
  });

  return (
    reduce(
      monthExpenses,
      (acc, expense) => {
        return acc + expense.amount;
      },
      0
    ) +
    user.average * daysRemainingInMonth
  );
};

export default useProjectedExpense;
