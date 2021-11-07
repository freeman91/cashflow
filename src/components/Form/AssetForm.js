import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { get, map } from 'lodash';
import dayjs from 'dayjs';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

import AssetBuySellDialog from '../Dialog/AssetBuySellDialog';
import DatePicker from '@mui/lab/DatePicker';
import Autocomplete from '@mui/lab/Autocomplete';
import { Box, Button, InputAdornment, TextField } from '@mui/material';

import { _numberToCurrency } from '../../helpers/currency';
import { putAsset, postAsset } from '../../store/assets';

const default_state = {
  name: '',
  shares: '',
  price: '',
  value: '',
  vendor: '',
  invested: '',
  type: '',
  description: '',
  last_update: new Date(),
};

export default function AssetForm({ handleClose, mode, asset }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(default_state);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('');

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        name: get(asset, 'name', ''),
        shares: get(asset, 'shares', 0),
        price: get(asset, 'price', 0),
        value: get(asset, 'value', 0),
        vendor: get(asset, 'vendor', 0),
        invested: get(asset, 'invested', 0),
        type: get(asset, 'type', ''),
        description: get(asset, 'description', ''),
        last_update: new Date(get(asset, 'last_update')),
      });
    }
  }, [mode, asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = calculateValue();
    const new_asset = {
      ...values,
      value: Number(value.replace(',', '')),
      invested: Number(values.invested),
      price: Number(values.price),
      shares: Number(values.shares),
      last_update: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(postAsset(new_asset));
    handleClose();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let updatedAsset = {
      ...asset,
      value: values.value,
    };
    dispatch(putAsset(updatedAsset));
    handleClose();
  };

  const handleUpdatePrice = (e) => {
    e.preventDefault();
    let updatedAsset = {
      ...asset,
      price: values.price,
    };
    dispatch(putAsset(updatedAsset));
    handleClose();
  };

  const handleClick = (e, dialogMode) => {
    e.preventDefault();
    setDialogMode(dialogMode);
    setDialogOpen(true);
  };

  const handleAssetBuySellDialogClose = () => {
    setDialogOpen(false);
    handleClose();
  };

  const handleFormEnterClick = () => {
    // TODO: check values befor submit
    if (mode === 'create') {
      handleSubmit();
    } else if (mode === 'update') {
      handleUpdate();
    } else {
      handleClose();
    }
  };

  const validate = () => {
    if (
      isNaN(values.value) ||
      !values.name ||
      values.type.length === 0 ||
      !values.last_update
    )
      return false;
    else return true;
  };

  let isSharedAsset = values.type === 'stock' || values.type === 'crypto';

  const calculateValue = () => {
    if (mode === 'create') {
      if (isSharedAsset) {
        return _numberToCurrency.format(values.shares * values.price);
      } else {
        return values.value;
      }
    } else {
      if (isSharedAsset) {
        return _numberToCurrency.format(values.value);
      } else {
        return values.value;
      }
    }
  };

  const renderButtons = () => {
    let buttons = [
      <Button
        id='cancel-button'
        key='cancel-button'
        sx={{ mr: '1rem', mt: '1rem', width: '5rem' }}
        variant='outlined'
        color='info'
        onClick={handleClose}
      >
        Cancel
      </Button>,
    ];

    if (mode === 'create') {
      buttons.push(
        <Button
          type='submit'
          id='submit'
          key='submit=button'
          disabled={!validate()}
          sx={{ mt: '1rem', width: '5rem' }}
          variant='outlined'
          onClick={handleSubmit}
          color='success'
        >
          Submit
        </Button>
      );
    } else {
      if (isSharedAsset) {
        buttons.push(
          <Button
            id='buy'
            key='buy-button'
            sx={{ mt: '1rem', mr: '1rem', width: '5rem' }}
            variant='outlined'
            onClick={(e) => handleClick(e, 'buy')}
            color='warning'
          >
            Buy
          </Button>
        );
        buttons.push(
          <Button
            id='sell'
            key='sell-button'
            sx={{ mt: '1rem', mr: '1rem', width: '5rem' }}
            variant='outlined'
            onClick={(e) => handleClick(e, 'sell')}
            color='success'
          >
            Sell
          </Button>
        );
        buttons.push(
          <Button
            type='submit'
            id='update-price'
            key='update-price-button'
            disabled={asset.price === values.price}
            sx={{ mt: '1rem', width: '5rem' }}
            variant='outlined'
            onClick={handleUpdatePrice}
            color='info'
          >
            Update
          </Button>
        );
      } else
        buttons.push(
          <Button
            type='submit'
            id='update-value'
            key='update-value-button'
            disabled={asset.value === values.value}
            sx={{ mt: '1rem', width: '5rem' }}
            variant='outlined'
            onClick={handleUpdate}
            color='success'
          >
            Update
          </Button>
        );
    }

    return <>{map(buttons, (button) => button)}</>;
  };

  return (
    <>
      <Box>
        <form onSubmit={handleFormEnterClick}>
          <TextField
            fullWidth
            id='name-input'
            label='name'
            name='name'
            required={mode === 'create'}
            disabled={mode === 'update'}
            value={values.name}
            variant='outlined'
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            margin='dense'
          />
          <Autocomplete
            data-lpignore='true'
            id='type-select'
            freeSolo
            disabled={mode === 'update'}
            value={values.type}
            options={user.asset.types}
            getOptionLabel={(option) => option}
            onChange={(e, value) => setValues({ ...values, type: value })}
            renderInput={(params) => (
              <TextField
                {...params}
                required={mode === 'create'}
                disabled={mode === 'update'}
                label='type'
                variant='outlined'
                margin='dense'
              />
            )}
          />
          <Autocomplete
            id='vendor-select'
            autoComplete
            freeSolo
            value={values.vendor}
            options={user.expense.vendors}
            getOptionLabel={(option) => option}
            onChange={(e, value) => setValues({ ...values, vendor: value })}
            autoSelect
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={mode === 'update'}
                label='vendor'
                variant='outlined'
                margin='dense'
              />
            )}
          />
          <TextField
            fullWidth
            id='value-input'
            label='value'
            name='value'
            disabled={isSharedAsset}
            required={!isSharedAsset}
            value={calculateValue()}
            variant='outlined'
            placeholder='0'
            onChange={(e) => setValues({ ...values, value: e.target.value })}
            margin='dense'
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <AttachMoneyIcon />
                </InputAdornment>
              ),
            }}
          />
          {isSharedAsset ? (
            <>
              <TextField
                fullWidth
                id='shares-input'
                label='shares'
                name='shares'
                disabled={mode === 'update' ? true : false}
                value={
                  mode === 'create'
                    ? values.shares
                    : Math.round(values.shares * 100000) / 100000
                }
                variant='outlined'
                placeholder='0'
                onChange={(e) =>
                  setValues({ ...values, shares: e.target.value })
                }
                margin='dense'
              />
              <TextField
                fullWidth
                id='price-input'
                label='price'
                name='price'
                required
                value={values.price}
                variant='outlined'
                placeholder='0'
                onChange={(e) =>
                  setValues({ ...values, price: e.target.value })
                }
                margin='dense'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AttachMoneyIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          ) : null}
          {mode === 'create' || isSharedAsset ? (
            <TextField
              fullWidth
              id='invested-input'
              label='invested'
              name='invested'
              disabled={mode === 'update' ? true : false}
              value={values.invested}
              variant='outlined'
              placeholder='0'
              onChange={(e) =>
                setValues({ ...values, invested: e.target.value })
              }
              margin='dense'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                ),
              }}
            />
          ) : null}

          <TextField
            fullWidth
            id='description-input'
            label='description'
            name='description'
            value={values.description}
            variant='outlined'
            margin='dense'
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <DescriptionIcon />
                </InputAdornment>
              ),
            }}
          />
          <DatePicker
            disabled
            label='date'
            value={values.last_update}
            onChange={(value) => {
              setValues({ ...values, last_update: value });
            }}
            renderInput={(params) => (
              <TextField fullWidth {...params} margin='dense' required />
            )}
          />
          {renderButtons()}
        </form>
      </Box>
      <AssetBuySellDialog
        open={dialogOpen}
        handleClose={handleAssetBuySellDialogClose}
        asset={asset}
        mode={dialogMode}
      />
    </>
  );
}
