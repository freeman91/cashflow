import { useMemo } from 'react';
import filter from 'lodash/filter';
import get from 'lodash/get';
import { findAmount, findSource } from '../../helpers/transactions';

export const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Expenses' },
  { value: 'income', label: 'Income' },
  { value: 'paycheck', label: 'Paychecks' },
  { value: 'repayment', label: 'Repayments' },
  { value: 'purchase', label: 'Purchases' },
  { value: 'sale', label: 'Sales' },
  { value: 'borrow', label: 'Borrows' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'recurring', label: 'Recurring' },
];

export const AMOUNT_FILTERS = {
  expense: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  income: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  paycheck: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  repayment: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  purchase: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  sale: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  borrow: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  transfer: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
  recurring: [
    { value: 'gte', label: 'Greater than or equal to' },
    { value: 'lte', label: 'Less than or equal to' },
  ],
};

export function useTransactionFilters(transactions, filters) {
  const {
    types = TRANSACTION_TYPES.map((t) => t.value), // Default to all types
    amountOperator,
    amountValue,
    keyword,
    category,
  } = filters;

  // Get all unique categories and subcategories from transactions
  const { categories } = useMemo(() => {
    const cats = new Set();

    transactions.forEach((transaction) => {
      const cat = get(transaction, 'category');
      if (cat) cats.add(cat);
    });

    return {
      categories: Array.from(cats).sort(),
    };
  }, [transactions]);

  // Filter transactions based on all criteria
  const filteredTransactions = useMemo(() => {
    return filter(transactions, (transaction) => {
      // Type filter - if types array is empty or includes all types, show all
      if (
        types.length > 0 &&
        types.length < TRANSACTION_TYPES.length &&
        !types.includes(transaction._type)
      ) {
        return false;
      }

      // Amount filter
      if (amountOperator && amountValue) {
        const amount = findAmount(transaction);
        if (amountOperator === 'gte' && amount < amountValue) return false;
        if (amountOperator === 'lte' && amount > amountValue) return false;
      }

      // Keyword filter (search in source/merchant)
      if (keyword) {
        const source = findSource(transaction);
        if (!source.toLowerCase().includes(keyword.toLowerCase())) {
          return false;
        }
      }

      // Category filter
      if (category) {
        const transactionCategory = get(transaction, 'category');
        if (transactionCategory !== category) return false;
      }

      return true;
    });
  }, [transactions, types, amountOperator, amountValue, keyword, category]);

  return {
    filteredTransactions,
    categories,
  };
}
