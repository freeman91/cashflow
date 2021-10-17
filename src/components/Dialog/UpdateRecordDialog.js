import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import { setDialog } from '../../store/settings';
import { settings as initialState } from '../../store/initialState';
import ExpenseForm from '../Form/ExpenseForm';
import IncomeForm from '../Form/IncomeForm';
import HourForm from '../Form/HourForm';

export default function UpdateRecordDialog() {
  const dispatch = useDispatch();
  const { dialog } = useSelector((state) => state.settings);

  const handleClose = () => {
    dispatch(
      setDialog({
        open: initialState.dialog.open,
        record: initialState.dialog.record,
      })
    );
  };

  const showRecordForm = () => {
    let { record } = dialog;
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
      return null;
    } else if (category === 'debt') {
      return null;
    } else if (category === 'goal') {
      return null;
    } else return null;
  };

  return (
    <Dialog open={dialog.open} onClose={handleClose}>
      <DialogTitle>Update Record</DialogTitle>
      <DialogContent>{showRecordForm()}</DialogContent>
    </Dialog>
  );
}
