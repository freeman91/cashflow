import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';

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
import { deactivateAccount } from '../../../store/accounts';
import { deleteBorrow } from '../../../store/borrows';
import { deleteExpense } from '../../../store/expenses';
import { deleteIncome } from '../../../store/incomes';
import { deletePaycheck } from '../../../store/paychecks';
import { deletePurchase } from '../../../store/purchases';
import { deactivateRecurring } from '../../../store/recurrings';
import { deleteRepayment } from '../../../store/repayments';
import { deleteSale } from '../../../store/sales';
import { deactivateSecurity } from '../../../store/securities';

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

const OptionsButton = (props) => {
  const { itemType, mode, attrs, handleCloseDrawer } = props;
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (itemType === 'borrow') {
      dispatch(deleteBorrow(attrs.borrow_id));
    } else if (itemType === 'expense') {
      dispatch(deleteExpense(attrs.expense_id));
    } else if (itemType === 'income') {
      dispatch(deleteIncome(attrs.income_id));
    } else if (itemType === 'paycheck') {
      dispatch(deletePaycheck(attrs.paycheck_id));
    } else if (itemType === 'purchase') {
      dispatch(deletePurchase(attrs.purchase_id));
    } else if (itemType === 'repayment') {
      dispatch(deleteRepayment(attrs.repayment_id));
    } else if (itemType === 'sale') {
      dispatch(deleteSale(attrs.sale_id));
    }
    handleCloseDrawer();
  };

  const handleDeactivate = () => {
    if (itemType === 'security') {
      dispatch(deactivateSecurity(attrs.security_id));
    } else if (itemType === 'recurring') {
      dispatch(deactivateRecurring(attrs.recurring_id));
    } else if (itemType === 'account') {
      dispatch(deactivateAccount(attrs.account_id));
    }
    handleCloseDrawer();
  };

  if (
    mode !== 'create' &&
    ![
      'account',
      'borrow',
      'expense',
      'income',
      'paycheck',
      'purchase',
      'recurring',
      'repayment',
      'sale',
      'security',
    ].includes(itemType)
  )
    return null;

  return (
    <>
      <IconButton ref={anchorRef} onClick={handleToggle}>
        <MoreVertIcon />
      </IconButton>
      <Popper
        sx={{ zIndex: 1400 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        placement='bottom-end'
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Box>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  id='split-button-menu'
                  autoFocusItem
                  disablePadding
                  sx={{
                    bgcolor: 'surface.300',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: (theme) => theme.shadows[4],
                  }}
                >
                  {[
                    'borrow',
                    'expense',
                    'income',
                    'paycheck',
                    'purchase',
                    'repayment',
                    'sale',
                  ].includes(itemType) && (
                    <MenuItem onClick={() => handleDelete()} sx={{ gap: 2 }}>
                      Delete
                      <DeleteIcon color='error' />
                    </MenuItem>
                  )}
                  {['account', 'recurring', 'security'].includes(itemType) && (
                    <MenuItem
                      onClick={() => handleDeactivate()}
                      sx={{ gap: 2 }}
                    >
                      Deactivate
                      <RemoveCircleOutlineIcon color='error' />
                    </MenuItem>
                  )}
                </MenuList>
              </ClickAwayListener>
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  );
};

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
          <ListItem
            secondaryAction={
              <OptionsButton
                itemType={itemType}
                mode={mode}
                attrs={attrs}
                handleCloseDrawer={onClose}
              />
            }
          >
            <ListItemText
              primary={`${startCase(mode)} ${startCase(itemType)}`}
              slotProps={{
                primary: { align: 'center' },
              }}
            />
          </ListItem>

          <Form mode={mode} attrs={attrs} />
        </List>
      </Box>
    </Drawer>
  );
}
