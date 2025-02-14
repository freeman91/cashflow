import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import { Chart } from 'react-google-charts';
import { findAmount } from '../../helpers/transactions';

export default function SankeyChart(props) {
  const { earnedIncomes, passiveIncomes, otherIncomes, expenses, repayments } =
    props;
  const theme = useTheme();

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const paycheckOther = earnedIncomes.transactions.reduce(
      (acc, transaction) => {
        return acc + get(transaction, 'other', 0);
      },
      0
    );
    const paycheckTakeHome = earnedIncomes.transactions.reduce(
      (acc, transaction) => {
        return acc + get(transaction, 'take_home', 0);
      },
      0
    );
    const paycheckTaxes = earnedIncomes.transactions.reduce(
      (acc, transaction) => {
        return acc + get(transaction, 'taxes', 0);
      },
      0
    );
    const retirement = earnedIncomes.transactions.reduce((acc, transaction) => {
      return (
        acc +
        get(transaction, `retirement_contribution.employee`, 0) +
        get(transaction, `retirement_contribution.employer`, 0)
      );
    }, 0);
    const benefits = earnedIncomes.transactions.reduce((acc, transaction) => {
      return (
        acc +
        get(transaction, `benefits_contribution.employee`, 0) +
        get(transaction, `benefits_contribution.employer`, 0)
      );
    }, 0);
    const capitalGains = passiveIncomes.transactions.reduce(
      (acc, transaction) => {
        return acc + get(transaction, 'gains', 0);
      },
      0
    );
    const otherPassiveIncome = passiveIncomes.transactions.reduce(
      (acc, transaction) => {
        if (transaction._type !== 'sale') return acc + findAmount(transaction);
        return acc;
      },
      0
    );
    const otherIncome = otherIncomes.transactions.reduce((acc, transaction) => {
      return acc + findAmount(transaction);
    }, 0);
    const debtRepayments = repayments.reduce((acc, transaction) => {
      return acc + findAmount(transaction);
    }, 0);
    const debtPrincipal = repayments.reduce((acc, transaction) => {
      return acc + get(transaction, 'principal', 0);
    }, 0);
    const expensesSum = expenses.reduce((acc, transaction) => {
      return acc + findAmount(transaction);
    }, 0);

    const totalIncome =
      paycheckTakeHome + capitalGains + otherPassiveIncome + otherIncome;
    const savings = (() => {
      const savingsOrOverage = totalIncome - expensesSum - debtRepayments;
      if (savingsOrOverage > 0) {
        return savingsOrOverage;
      } else {
        return 0;
      }
    })();

    let _links = [
      ['Paycheck (gross)', 'other (paycheck)', paycheckOther],
      ['Paycheck (gross)', 'taxes', paycheckTaxes],
      ['Paycheck (gross)', 'contributions', retirement + benefits],
      ['Paycheck (gross)', 'take home', paycheckTakeHome],
      ['contributions', 'retirement', retirement],
      ['contributions', 'benefits', benefits],
      ['retirement', 'earned income', retirement],
      ['benefits', 'earned income', benefits],
      ['take home', 'earned income', paycheckTakeHome],
      ['capital gains', 'passive income', capitalGains],
      ['income (passive)', 'passive income', otherPassiveIncome],
      ['earned income', 'investments', retirement + benefits],
      ['earned income', 'savings', savings],
      ['earned income', 'spending', paycheckTakeHome],
      ['passive income', 'spending', otherPassiveIncome + capitalGains],
      ['spending', 'debt repayments', debtRepayments],
      ['other (income)', 'spending', otherIncome],
      ['debt repayments', 'principal', debtPrincipal],
      ['debt repayments', 'expense categories', debtRepayments - debtPrincipal],
      ['principal', 'expense categories', debtPrincipal],
      ['spending', 'expense categories', expensesSum],
    ];
    _links = _links.filter((link) => link[2] > 0);
    _links.unshift(['From', 'To', 'Amount']);
    setLinks(_links);
  }, [earnedIncomes, passiveIncomes, otherIncomes, repayments, expenses]);

  const options = {
    sankey: {
      node: {
        nodePadding: 50,
        label: {
          fontSize: 14,
          color: theme.palette.text.primary,
        },
      },
      iterations: 256,
      tooltip: {
        textStyle: { color: '#FFFFFF' },
        showColorCode: true,
      },
    },
  };

  return (
    <Box sx={{ height: 500 }}>
      <Chart
        chartType='Sankey'
        width='100%'
        height='100%'
        data={links}
        options={options}
      />
    </Box>
  );
}
