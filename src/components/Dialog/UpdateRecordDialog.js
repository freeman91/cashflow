import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get, capitalize } from 'lodash';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { setUpdateDialog } from '../../store/settings';
import ExpenseForm from '../Form/ExpenseForm';
import IncomeForm from '../Form/IncomeForm';
import HourForm from '../Form/HourForm';
import AssetForm from '../Form/AssetForm';
import DebtForm from '../Form/DebtForm';

export default function UpdateRecordDialog() {
  const dispatch = useDispatch();
  const { updateDialog } = useSelector((state) => state.settings);

  const handleClose = () => {
    dispatch(
      setUpdateDialog({
        record: {},
        open: false,
      })
    );
  };

  const showRecordForm = () => {
    let { record } = updateDialog;
    let category = get(record, 'category');
    if (category === 'expense') {
      return (
        <ExpenseForm
          handleDialogClose={handleClose}
          mode='update'
          expense={record}
        />
      );
    } else if (category === 'income') {
      return (
        <IncomeForm
          handleDialogClose={handleClose}
          mode='update'
          income={record}
        />
      );
    } else if (category === 'hour') {
      return (
        <HourForm handleDialogClose={handleClose} mode='update' hour={record} />
      );
    } else if (category === 'asset') {
      return (
        <AssetForm handleClose={handleClose} mode='update' asset={record} />
      );
    } else if (category === 'debt') {
      return <DebtForm handleClose={handleClose} mode='update' debt={record} />;
    } else if (category === 'goal') {
      return null;
    } else return null;
  };

  return (
    <Dialog open={updateDialog.open} onClose={handleClose}>
      <DialogTitle>
        {capitalize(get(updateDialog, 'record.category'))}
      </DialogTitle>
      <DialogContent>{showRecordForm()}</DialogContent>
    </Dialog>
  );
}
