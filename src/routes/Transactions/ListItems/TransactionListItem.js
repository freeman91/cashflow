import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import { numberToCurrency } from '../../../helpers/currency';
import TypeChip from './TypeChip';
import BorrowListItem from './BorrowListItem';
import ExpenseListItem from './ExpenseListItem';
import IncomeListItem from './IncomeListItem';
import PaycheckListItem from './PaycheckListItem';
import PurchaseListItem from './PurchaseListItem';
import RepaymentListItem from './RepaymentListItem';
import SaleListItem from './SaleListItem';
import TransferListItem from './TransferListItem';
import { openItemView } from '../../../store/itemView';
import RecurringListItem from './RecurringListItem';
import { findAmount } from '../../../helpers/transactions';

export default function TransactionListItem(props) {
  const { transaction } = props;
  const parentRef = useRef(null);
  const dispatch = useDispatch();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setWidth(element.offsetWidth);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  const openTransaction = (transaction) => {
    dispatch(
      openItemView({
        itemType: transaction._type,
        mode: 'edit',
        attrs: transaction,
      })
    );
  };

  let transactionType = transaction._type;
  if (transactionType === 'recurring') {
    const attributes = Object.keys(transaction).filter((key) =>
      key.endsWith('_attributes')
    );
    const attribute = attributes[0];
    transactionType = attribute.replace('_attributes', '');
  }

  return (
    <ListItemButton
      ref={parentRef}
      disableGutters
      onClick={() => openTransaction(transaction)}
      sx={{
        borderRadius: 1,
        mx: 0.5,
        pr: 2,
        py: 0.5,
        my: 0.5,
        gap: 0.5,
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <ListItem sx={{ maxWidth: 100, px: 0.5, py: 0 }}>
        <TypeChip type={transactionType} />
      </ListItem>
      {transaction._type === 'borrow' && (
        <BorrowListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'expense' && (
        <ExpenseListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'income' && (
        <IncomeListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'paycheck' && (
        <PaycheckListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'purchase' && (
        <PurchaseListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'repayment' && (
        <RepaymentListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'sale' && (
        <SaleListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'transfer' && (
        <TransferListItem transaction={transaction} parentWidth={width} />
      )}
      {transaction._type === 'recurring' && (
        <RecurringListItem transaction={transaction} parentWidth={width} />
      )}
      <ListItemText
        disableTypography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          maxWidth: 100,
          flex: 1,
        }}
      >
        {(transaction?.pending || transaction._type === 'recurring') && (
          <Tooltip title='Pending' placement='top'>
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: 'warning.main',
                borderRadius: '50%',
                mr: 0.5,
              }}
            />
          </Tooltip>
        )}
        <Typography variant='body1'>
          {numberToCurrency.format(findAmount(transaction))}
        </Typography>
      </ListItemText>
      <ListItemIcon sx={{ minWidth: 'unset', ml: 1 }}>
        <ChevronRight />
      </ListItemIcon>
    </ListItemButton>
  );
}
