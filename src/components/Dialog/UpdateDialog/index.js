import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../../store/dialogs';
import { startCase } from 'lodash';

import AccountForm from '../../Form/AccountForm';
import ExpenseForm from '../../Form/ExpenseForm';
import IncomeForm from '../../Form/IncomeForm';
import AssetForm from '../../Form/AssetForm';
import DebtForm from '../../Form/DebtForm';
import BillForm from '../../Form/BillForm';

export default function UpdateDialog() {
  const dispatch = useDispatch();
  const { open, attrs: record } = useSelector((state) => state.dialogs.update);

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const renderForm = () => {
    switch (record.category) {
      case 'expense':
        return (
          <ExpenseForm
            mode='update'
            expense={record}
            handleClose={handleClose}
          />
        );

      case 'income':
        return (
          <IncomeForm mode='update' income={record} handleClose={handleClose} />
        );

      case 'bill':
        return (
          <BillForm mode='update' bill={record} handleClose={handleClose} />
        );

      case 'account':
        return (
          <AccountForm
            mode='update'
            account={record}
            handleClose={handleClose}
          />
        );

      case 'asset':
        return (
          <AssetForm mode='update' asset={record} handleClose={handleClose} />
        );

      case 'debt':
        return (
          <DebtForm mode='update' debt={record} handleClose={handleClose} />
        );

      default:
        break;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {`Update ${startCase(record?.category)}`}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: '30rem' }}>{renderForm()}</DialogContent>
    </Dialog>
  );
}
