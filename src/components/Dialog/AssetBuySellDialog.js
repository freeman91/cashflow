import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  TextField,
} from '@mui/material';
import { AttachMoney as AttachMoneyIcon } from '@mui/icons-material';

import { buyAsset, sellAsset } from '../../store/assets';
import { get } from 'lodash';

const useStyles = makeStyles({
  dialog: {
    '& .MuiPaper-root': { width: '40%' },
  },
});

export default function AssetBuySellDialog({ open, handleClose, asset, mode }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const user = useSelector((state) => state.user);

  const [shares, setShares] = useState(0);
  const [price, setPrice] = useState(0);
  const [vendor, setVendor] = useState('');

  const handleDialogClose = async () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'buy') {
      dispatch(
        buyAsset({
          shares,
          price,
          asset,
          vendor,
        })
      );
    } else {
      if (shares <= get(asset, 'shares')) {
        dispatch(
          sellAsset({
            shares,
            price,
            asset,
            vendor,
          })
        );
      }
    }
    handleClose();
  };

  const calculateValue = () => {
    if (isNaN(shares) || isNaN(price)) {
      return 0;
    } else {
      return Number(shares) * Number(price);
    }
  };

  if (!asset) return null;

  return (
    <Dialog className={classes.dialog} open={open} onClose={handleDialogClose}>
      <DialogTitle id='asset-dialog-title'>
        {mode === 'buy' ? `Purchase Shares` : `Sell Shares`}
      </DialogTitle>
      <DialogContent>
        <Box>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id='name-input'
              label='name'
              name='name'
              disabled
              value={asset.name}
              variant='outlined'
              margin='dense'
            />
            <TextField
              fullWidth
              id='value-input'
              label='value'
              name='value'
              disabled
              value={calculateValue()}
              variant='outlined'
              placeholder='0'
              margin='dense'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              id='shares-input'
              label='shares'
              name='shares'
              required
              value={shares}
              variant='outlined'
              placeholder='0'
              onChange={(e) => setShares(e.target.value)}
              margin='dense'
            />
            <TextField
              fullWidth
              id='price-input'
              label='price'
              name='price'
              required
              value={price}
              variant='outlined'
              placeholder='0'
              onChange={(e) => setPrice(e.target.value)}
              margin='dense'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Autocomplete
              id='vendor-select'
              autoComplete
              freeSolo
              value={vendor}
              options={user.expense.vendors}
              getOptionLabel={(option) => option}
              onChange={(e, value) => setVendor(value ? value : '')}
              autoSelect
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='vendor'
                  variant='outlined'
                  margin='dense'
                />
              )}
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
              {mode === 'buy' ? 'Buy' : 'Sell'}
            </Button>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
