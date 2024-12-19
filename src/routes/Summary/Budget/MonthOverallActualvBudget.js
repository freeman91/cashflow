import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';

import Budget from '.';

export default function MonthOverallBudgetBar(props) {
  const { year, month, groupedExpenses } = props;

  const allBudgets = useSelector((state) => state.budgets.data);
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });

  const [categoryGoals, setCategoryGoals] = useState([]);
  const [goalSum, setGoalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);

  useEffect(() => {
    let budget = find(allBudgets, {
      year: year,
      month: month,
    });
    let _categoryGoals = map(groupedExpenses, ({ name, value }) => {
      const goal = budget?.categories?.find((c) => c.category === name)?.goal;
      const storeCategory = find(expenseCategories.categories, {
        name,
      });
      return {
        category: name,
        goal: goal,
        actual: value,
        color: storeCategory?.color,
      };
    });
    setCategoryGoals(_categoryGoals);
    setGoalSum(sumBy(_categoryGoals, 'goal'));
    setActualSum(sumBy(_categoryGoals, 'actual'));
  }, [allBudgets, year, month, groupedExpenses, expenseCategories]);

  return (
    <Budget
      categoryGoals={categoryGoals}
      goalSum={goalSum}
      actualSum={actualSum}
    />
  );
}
