import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';
import dayjs from 'dayjs';

import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { styled } from '@mui/material/styles';

import { closeItemView, openItemView } from '../../../store/itemView';
import { deactivateAccount } from '../../../store/accounts';
import { deleteBorrow } from '../../../store/borrows';
import { deleteExpense } from '../../../store/expenses';
import { deleteIncome } from '../../../store/incomes';
import { deletePaycheck } from '../../../store/paychecks';
import { deletePurchase } from '../../../store/purchases';
import {
  deactivateRecurring,
  generateNextRecurring,
} from '../../../store/recurrings';
import { deleteRepayment } from '../../../store/repayments';
import { deleteSale } from '../../../store/sales';
import { deactivateSecurity } from '../../../store/securities';
import { getForm } from './ItemViewDrawer';

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
  zIndex: 1,
}));

const OptionsButton = (props) => {
  const { itemType, mode, attrs, handleCloseDialog } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
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
    handleCloseDialog();
  };

  const handleDuplicate = () => {
    let _attrs = { ...attrs };
    _attrs[_attrs._type + '_id'] = null;
    _attrs.date = dayjs();

    setOpen(false);
    handleCloseDialog();
    dispatch(openItemView({ itemType, mode: 'create', attrs: _attrs }));
  };

  const handleDeactivate = () => {
    if (itemType === 'security') {
      dispatch(deactivateSecurity(attrs.security_id));
    } else if (itemType === 'recurring') {
      dispatch(deactivateRecurring(attrs.recurring_id));
    } else if (itemType === 'account') {
      dispatch(deactivateAccount(attrs.account_id));
    }
    handleCloseDialog();
  };

  const generateNext = () => {
    dispatch(generateNextRecurring(attrs.recurring_id));
    handleCloseDialog();
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
      <IconButton onClick={handleToggle}>
        <MoreVertIcon />
      </IconButton>
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onClose={handleClose}
        sx={{
          zIndex: 1400,
          '& .MuiDrawer-paper': {
            height: '40%',
            overflow: 'visible',
            backgroundColor: (theme) => theme.palette.surface[250],
            backgroundImage: 'unset',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
        }}
      >
        <Puller />
        <List disablePadding sx={{ px: 1, pt: 4, bgcolor: 'unset' }}>
          {[
            'borrow',
            'expense',
            'income',
            'paycheck',
            'purchase',
            'repayment',
            'sale',
          ].includes(itemType) && (
            <ListItemButton
              onClick={() => handleDelete()}
              sx={{
                my: 1,
                bgcolor: 'surface.200',
                borderRadius: 1,
                position: 'relative',
                minHeight: 48,
                py: 1,
                '&:hover': {
                  bgcolor: 'surface.300',
                },
              }}
            >
              <DeleteIcon
                color='error'
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <ListItemText
                primary='Delete'
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                slotProps={{
                  primary: {
                    align: 'center',
                    sx: {
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
          {[
            'borrow',
            'expense',
            'income',
            'paycheck',
            'purchase',
            'repayment',
            'sale',
          ].includes(itemType) && (
            <ListItemButton
              onClick={() => handleDuplicate()}
              sx={{
                my: 1,
                bgcolor: 'surface.200',
                borderRadius: 1,
                position: 'relative',
                minHeight: 48,
                py: 1,
                '&:hover': {
                  bgcolor: 'surface.300',
                },
              }}
            >
              <ContentCopyIcon
                color='info'
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <ListItemText
                primary='Duplicate'
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                slotProps={{
                  primary: {
                    align: 'center',
                    sx: {
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
          {['account', 'recurring', 'security'].includes(itemType) && (
            <ListItemButton
              onClick={() => handleDeactivate()}
              sx={{
                my: 1,
                bgcolor: 'surface.200',
                borderRadius: 1,
                position: 'relative',
                minHeight: 48,
                py: 1,
                '&:hover': {
                  bgcolor: 'surface.300',
                },
              }}
            >
              <RemoveCircleOutlineIcon
                color='error'
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <ListItemText
                primary='Deactivate'
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                slotProps={{
                  primary: {
                    align: 'center',
                    sx: {
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
          {itemType === 'recurring' && (
            <ListItemButton
              onClick={() => generateNext()}
              sx={{
                my: 1,
                bgcolor: 'surface.200',
                borderRadius: 1,
                position: 'relative',
                minHeight: 48,
                py: 1,
                '&:hover': {
                  bgcolor: 'surface.300',
                },
              }}
            >
              <LaunchIcon
                color='primary'
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <ListItemText
                primary='Generate Next'
                sx={{
                  textAlign: 'center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                slotProps={{
                  primary: {
                    align: 'center',
                    sx: {
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                    },
                  },
                }}
              />
            </ListItemButton>
          )}
        </List>
      </SwipeableDrawer>
    </>
  );
};

function ItemViewDialog(props) {
  const { itemType, mode, attrs } = props;

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeItemView());
  };

  const Form = getForm(itemType);

  return (
    <Dialog fullScreen={true} open={true} onClose={handleClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {`${startCase(mode)} ${startCase(itemType)}`}
        <Box
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
          }}
        >
          {itemType !== 'transactions' && (
            <OptionsButton
              itemType={itemType}
              mode={mode}
              attrs={attrs}
              handleCloseDialog={handleClose}
            />
          )}
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          px: 0,
          width: '100%',
        }}
      >
        <List sx={{ px: 2, width: '100%' }}>
          <Form mode={mode} attrs={attrs} />
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default ItemViewDialog;
