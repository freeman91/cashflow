import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { filter, get, last, each, range, reduce } from 'lodash';

const useProjectedIncome = (date) => {
  let now = dayjs();
  const [day, setDay] = useState(now);
  let incomes = useSelector((state) => state.incomes.data);

  useEffect(() => {
    if (date) {
      setDay(date);
    }
  }, [date]);

  let monthIncomes = filter(incomes, (income) => {
    return day.isSame(dayjs(get(income, 'date')), 'month');
  });

  if (monthIncomes.length > 1) {
    return 0;
  }

  const lastIncome = last(incomes);
  each(range(2 - monthIncomes.length), () => {
    monthIncomes.push(lastIncome);
  });

  return reduce(
    monthIncomes,
    (acc, income) => {
      return acc + get(income, 'amount', 0);
    },
    0
  );
};

export default useProjectedIncome;
