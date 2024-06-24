import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import includes from 'lodash/includes';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

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

export default function SelectedTransactions(props) {
  const { transactions } = props;
  const dispatch = useDispatch();
  const theme = useTheme();

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

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: transaction[`${transaction._type}_id`],
        attrs: transaction,
      })
    );
  };

  const findColor = (transaction) => {
    if (transaction.pending) return theme.palette.red[300];
    if (includes(['expense', 'repayment'], transaction._type))
      return theme.palette.red[600];
    if (includes(['income', 'paycheck'], transaction._type))
      return theme.palette.green[600];
    return theme.palette.red[300];
  };

  if (!transactions.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '50%',
        }}
      >
        <Typography>no transactions</Typography>
      </Box>
    );
  }

  return (
    <Card raised sx={{ mt: 1, mb: 9 }}>
      <CardContent sx={{ p: '4px', pt: 0, pb: '0px !important' }}>
        <TableContainer component='div'>
          <Table size='medium'>
            <TableBody>
              {tableData.map((transaction, idx, array) => {
                const amount = findAmount(transaction);
                const source = findSource(transaction);
                const color = findColor(transaction);
                const category = findCategory(transaction);

                return (
                  <TableRow
                    hover={true}
                    key={transaction[`${transaction._type}_id`]}
                    onClick={() => handleClick(transaction)}
                  >
                    <CustomTableCell idx={idx}>{source}</CustomTableCell>
                    <CustomTableCell idx={idx}>{category}</CustomTableCell>
                    <CustomTableCell
                      idx={idx}
                      align='right'
                      sx={{ color, fontWeight: 'bold' }}
                    >
                      {numberToCurrency.format(amount)}
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
