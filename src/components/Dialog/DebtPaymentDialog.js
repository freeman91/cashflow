import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

import { debtPayment } from '../../store/debts';

const useStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': { width: '40%' },
  },
});

export default function DebtPaymentDialog({ open, handleClose, debt }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [amount, setAmount] = useState(0);

  const handleDialogClose = async () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      debtPayment({
        amount: Number(amount),
        debt,
      })
    );
    handleClose();
  };

  const handleChange = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  if (!debt) return null;

  return (
    <Dialog className={classes.dialog} open={open} onClose={handleDialogClose}>
      <DialogTitle id='debt-dialog-title'>Payoff Debt</DialogTitle>
      <DialogContent>
        <Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id='name-input'
              label='name'
              name='name'
              disabled
              value={debt.name}
              variant='outlined'
              margin='dense'
            />
            <TextField
              fullWidth
              id='amount-input'
              label='amount'
              name='amount'
              value={amount}
              variant='outlined'
              placeholder='0'
              margin='dense'
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              id='cancel'
              sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
              variant='outlined'
              color='info'
              onClick={handleDialogClose}
            >
              Cancel
            </Button>
            <Button
              id='submit'
              type='submit'
              sx={{ mt: '1rem', mr: '1rem', width: '5rem' }}
              variant='outlined'
              onClick={handleSubmit}
              color='success'
            >
              Submit
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
