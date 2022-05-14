import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, Button, Stack } from '@mui/material';

import { setCreateDialog } from '../../store/settings';
import ExpenseForm from '../Form/ExpenseForm';
import IncomeForm from '../Form/IncomeForm';
import HourForm from '../Form/HourForm';

export default function CreateRecordDialog() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState('');
  const { createDialog } = useSelector((state) => state.settings);

  const handleClose = () => {
    setCategory('');
    dispatch(
      setCreateDialog({
        date: null,
        open: false,
      })
    );
  };

  const handleKeyPress = (event) => {
    console.log('event: ', event);
  };

  const renderContent = () => {
    if (!category) {
      return null;
    } else {
      if (category === 'expense') {
        return (
          <ExpenseForm
            handleDialogClose={handleClose}
            mode='create'
            date={createDialog.date}
          />
        );
      } else if (category === 'income') {
        return (
          <IncomeForm
            handleDialogClose={handleClose}
            mode='create'
            date={createDialog.date}
          />
        );
      } else {
        return (
          <HourForm
            handleDialogClose={handleClose}
            mode='create'
            date={createDialog.date}
          />
        );
      }
    }
  };

  return (
    <Dialog open={createDialog.open} onClose={handleClose}>
      <DialogContent sx={{ width: '30rem' }}>
        <Stack
          direction='row'
          spacing={2}
          justifyContent='space-around'
          alignItems='center'
        >
          <Button
            variant={category === 'expense' ? 'contained' : 'outlined'}
            onClick={() => setCategory('expense')}
            onKeyUp={handleKeyPress}
          >
            Expense
          </Button>
          <Button
            variant={category === 'income' ? 'contained' : 'outlined'}
            onClick={() => setCategory('income')}
          >
            Income
          </Button>
          <Button
            variant={category === 'hour' ? 'contained' : 'outlined'}
            onClick={() => setCategory('hour')}
          >
            Hour
          </Button>
        </Stack>
        {category ? <div style={{ marginBottom: '1rem' }} /> : null}
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
