import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { findId } from '../../helpers/transactions';
import ItemBox from '../../components/ItemBox';

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
  const bills = useSelector((state) => state.bills.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _data = map(transactions, (transaction) => {
      return {
        ...transaction,
        amount: findAmount(transaction),
        source: findSource(transaction, bills),
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
  }, [transactions, bills]);

  if (!transactions.length) return null;
  return tableData.map((transaction) => {
    return (
      <Grid key={findId(transaction)} item xs={12} mx={1}>
        <Card sx={{ width: '100%', py: 0.5 }}>
          <ItemBox item={transaction} />
        </Card>
      </Grid>
    );
  });
}
