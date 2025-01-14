import React from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

import { closeItemView } from '../../../store/itemView';
import AccountForm from '../../../components/Forms/AccountForm';
import BorrowForm from '../../../components/Forms/BorrowForm';
import ExpenseForm from '../../../components/Forms/ExpenseForm';
import IncomeForm from '../../../components/Forms/IncomeForm';
import PaycheckForm from '../../../components/Forms/PaycheckForm';
import PurchaseForm from '../../../components/Forms/PurchaseForm';
import RecurringForm from '../../../components/Forms/RecurringForm';
import RepaymentForm from '../../../components/Forms/RepaymentForm';
import SaleForm from '../../../components/Forms/SaleForm';
import SecurityForm from '../../../components/Forms/SecurityForm';
import TransactionsList from '../../../components/List/TransactionsList';

export function getForm(itemType) {
  switch (itemType) {
    case 'account':
      return AccountForm;
    case 'borrow':
      return BorrowForm;
    case 'expense':
      return ExpenseForm;
    case 'income':
      return IncomeForm;
    case 'paycheck':
      return PaycheckForm;
    case 'purchase':
      return PurchaseForm;
    case 'recurring':
      return RecurringForm;
    case 'repayment':
      return RepaymentForm;
    case 'sale':
      return SaleForm;
    case 'security':
      return SecurityForm;
    case 'transactions':
      return TransactionsList;
    default:
      return null;
  }
}

export default function ItemViewDrawer(props) {
  const { itemType, mode, attrs } = props;
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(closeItemView());
  };

  const Form = getForm(itemType);

  return (
    <Drawer anchor='right' open={true} onClose={onClose}>
      <Box
        sx={{
          width: 450,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          position: 'relative',
          overflowX: 'hidden',
          mt: 2,
        }}
        role='presentation'
      >
        <List sx={{ px: 2 }}>
          <ListItemText
            primary={`${startCase(mode)} ${startCase(itemType)}`}
            slotProps={{
              primary: { align: 'center' },
            }}
          />
          <Form mode={mode} attrs={attrs} />
        </List>
      </Box>
    </Drawer>
  );
}
