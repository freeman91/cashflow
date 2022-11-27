import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../../store/dialogs';
import { startCase } from 'lodash';

import AccountForm from '../../Form/AccountForm';
import AssetForm from '../../Form/AssetForm';
import DebtForm from '../../Form/DebtForm';
import ExpenseForm from '../../Form/ExpenseForm';
import IncomeForm from '../../Form/IncomeForm';

export default function CreateDialog() {
  const dispatch = useDispatch();
  const { open, attrs } = useSelector((state) => state.dialogs.create);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const renderForm = () => {
    switch (attrs.type) {
      case 'expense':
        return (
          <ExpenseForm
            mode='create'
            date={attrs.date}
            handleClose={handleClose}
          />
        );

      case 'income':
        return (
          <IncomeForm
            mode='create'
            date={attrs.date}
            handleClose={handleClose}
          />
        );

      case 'account':
        return <AccountForm mode='create' handleClose={handleClose} />;

      case 'asset':
        return (
          <AssetForm mode='create' handleClose={handleClose} asset={attrs} />
        );

      case 'debt':
        return (
          <DebtForm mode='create' handleClose={handleClose} debt={attrs} />
        );

      default:
        break;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {`Create ${startCase(attrs.type)}`}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: '30rem' }}>{renderForm()}</DialogContent>
    </Dialog>
  );
}
