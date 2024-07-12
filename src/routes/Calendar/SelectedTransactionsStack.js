import React, { useEffect, useState } from 'react';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { findId } from '../../helpers/transactions';
import TransactionBox from '../../components/TransactionBox';

const typeOrder = {
  paycheck: 1,
  income: 2,
  repayment: 3,
  expense: 3,
};

const findAmount = (transaction) => {
  if (transaction.amount) return transaction.amount;
  if (transaction.principal)
    return (
      transaction.principal +
      transaction.interest +
      (transaction.escrow ? transaction.escrow : 0)
    );
  if (transaction.take_home) return transaction.take_home;

  return 0;
};

const findSource = (transaction) => {
  if (transaction.vendor) return transaction.vendor;
  if (transaction.lender) return transaction.lender;
  if (transaction.employer) return transaction.employer;
  if (transaction.source) return transaction.source;
  return '';
};

const findCategory = (transaction) => {
  if (transaction.category) return transaction.category;
  return transaction._type;
};

export default function SelectedTransactionsStack(props) {
  const { transactions } = props;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _data = map(transactions, (transaction) => {
      return {
        ...transaction,
        amount: findAmount(transaction),
        source: findSource(transaction),
        category: findCategory(transaction),
      };
    });

    _data.sort((a, b) => {
      // Compare by _type first
      const typeComparison = typeOrder[a._type] - typeOrder[b._type];
      if (typeComparison !== 0) {
        return typeComparison;
      }

      // If _type is the same, compare by amount
      return b.amount - a.amount;
    });

    setTableData(_data);
  }, [transactions]);

  if (!transactions.length) return null;
  return (
    <Box sx={{ width: '100%', px: 1, pb: 1, mt: 1, mb: 9 }}>
      <Stack spacing={1} direction='column'>
        {map(tableData, (transaction) => {
          return (
            <TransactionBox
              key={findId(transaction)}
              transaction={transaction}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
