import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';

import useExpenses from '../../../store/hooks/useExpenses';
import { findAmount } from '../../../helpers/transactions';
import Budget from '.';

export default function YearOverallBudgetBar(props) {
  const { year } = props;

  const allBudgets = useSelector((state) => state.budgets.data);
  const expenseCategories = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    });
  });
  const { expenses: yearExpenses } = useExpenses(year);

  const [categoryGoals, setCategoryGoals] = useState([]);
  const [goalSum, setGoalSum] = useState(0);
  const [actualSum, setActualSum] = useState(0);

  useEffect(() => {
    let budgets = filter(allBudgets, { year: year });
    let _groupedExpenses = groupBy(yearExpenses, 'category');
    let _categoryGoals = Object.entries(_groupedExpenses).map(
      ([category, _expenses]) => {
        const storeCategory = find(expenseCategories.categories, {
          name: category,
        });

        return {
          category: category,
          goal: reduce(
            budgets,
            (acc, budget) => {
              const budgetCategory = find(budget.categories, {
                category: category,
              });
              return acc + get(budgetCategory, 'goal', 0);
            },
            0
          ),
          actual: _expenses.reduce(
            (acc, expense) => acc + findAmount(expense),
            0
          ),
          color: storeCategory.color,
        };
      }
    );
    setGoalSum(sumBy(_categoryGoals, 'goal'));
    setActualSum(sumBy(_categoryGoals, 'actual'));
    setCategoryGoals(_categoryGoals);
  }, [allBudgets, year, yearExpenses, expenseCategories]);

  return (
    <Budget
      categoryGoals={categoryGoals}
      goalSum={goalSum}
      actualSum={actualSum}
    />
  );
}
