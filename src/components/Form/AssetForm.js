import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { find, get, map } from 'lodash';
import dayjs from 'dayjs';
import {
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

import AssetBuySellDialog from '../Dialog/AssetBuySellDialog';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Button,
  InputAdornment,
  TextField,
  Stack,
  List,
  ListItem,
} from '@mui/material';

import { putAsset, postAsset, deleteAsset } from '../../store/assets';
import { TextFieldListItem } from '../List/TextFieldListItem';
import { AutocompleteListItem } from '../List/AutocompleteListItem';

const defaultState = {
  account_id: '',
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

export default function AssetForm({ mode, asset, handleClose }) {
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState(defaultState);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('');

  useEffect(() => {
    if (mode === 'update') {
      setValues({
        account_id: get(asset, 'account_id', ''),
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
    if (mode === 'create') {
      setValues({
        ...defaultState,
        account_id: get(asset, 'account_id', ''),
      });
    }
  }, [mode, asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAsset = {
      ...values,
      value: Number(values.value),
      invested: Number(values.invested),
      price: Number(values.price),
      shares: Number(values.shares),
      last_update: dayjs(values.date).format('MM-DD-YYYY'),
    };
    dispatch(postAsset(newAsset));
    handleClose();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    let updatedAsset = {
      ...asset,
      value: Number(values.value),
      shares: values.shares,
      price: values.price,
      invested: values.invested,
      name: values.name,
      description: values.description,
    };
    dispatch(putAsset(updatedAsset));
    handleClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    dispatch(deleteAsset(asset.id));
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

  const renderButtons = () => {
    let buttons = [];

    if (mode === 'create') {
      buttons.push(
        <Button
          type='submit'
          id='submit'
          key='submit=button'
          disabled={!validate()}
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
            variant='outlined'
            onClick={(e) => handleClick(e, 'buy')}
            color='warning'
          >
            Buy
          </Button>,
          <Button
            id='sell'
            key='sell-button'
            variant='outlined'
            onClick={(e) => handleClick(e, 'sell')}
            color='success'
          >
            Sell
          </Button>
        );
      }
      buttons.push(
        <Button
          type='submit'
          id='update'
          key='update-button'
          disabled={
            asset.price === values.price &&
            asset.shares === values.shares &&
            asset.value === values.value &&
            asset.invested === values.invested &&
            asset.name === values.name &&
            asset.description === values.description
          }
          variant='outlined'
          onClick={handleUpdate}
          color='success'
        >
          Update
        </Button>,
        <Button
          id='delete'
          key='delete-button'
          variant='outlined'
          onClick={handleDelete}
          color='error'
        >
          Delete
        </Button>
      );
    }

    return (
      <ListItem>
        <Stack
          direction='row'
          justifyContent='flex-end'
          spacing={2}
          sx={{ width: '100%' }}
        >
          {map(buttons, (button) => button)}
        </Stack>
      </ListItem>
    );
  };

  const account = find(accounts, { id: values.account_id });

  console.log('values: ', values);

  return (
    <>
      <form onSubmit={handleFormEnterClick}>
        <List>
          <TextFieldListItem
            id='account-input'
            label='account'
            name='account'
            value={get(account, 'name', '')}
            variant='standard'
            margin='dense'
            InputProps={{
              readOnly: true,
              disableUnderline: true,
            }}
          />
          <TextFieldListItem
            id='name-input'
            label='name'
            name='name'
            value={values.name}
            variant='standard'
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            margin='dense'
            fullWidth
          />
          <AutocompleteListItem
            data-lpignore='true'
            id='type-select'
            autoComplete
            autoHighlight
            autoSelect
            freeSolo
            disabled={mode === 'update'}
            value={values.type}
            options={user.asset_types}
            getOptionLabel={(option) => option}
            onChange={(e, value) =>
              setValues({ ...values, type: value ? value : '' })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                disabled={mode === 'update'}
                label='type'
                variant='standard'
                margin='dense'
                InputProps={{
                  readOnly: mode === 'update',
                }}
              />
            )}
          />
          <TextFieldListItem
            fullWidth
            type='number'
            id='value-input'
            label='current value'
            name='value'
            required={!isSharedAsset}
            value={Math.round(values.value * 100) / 100}
            variant='standard'
            placeholder='0'
            onChange={(e) => {
              setValues({ ...values, value: e.target.value });
            }}
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
              <TextFieldListItem
                fullWidth
                id='shares-input'
                label='shares'
                name='shares'
                value={
                  mode === 'create'
                    ? values.shares
                    : Math.round(values.shares * 100000000) / 100000000
                }
                variant='standard'
                placeholder='0'
                onChange={(e) =>
                  setValues({ ...values, shares: e.target.value })
                }
                margin='dense'
              />
              <TextFieldListItem
                fullWidth
                id='price-input'
                label='price'
                name='price'
                required
                value={values.price}
                variant='standard'
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
            <TextFieldListItem
              fullWidth
              id='invested-input'
              label='invested'
              name='invested'
              value={values.invested}
              variant='standard'
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

          <TextFieldListItem
            fullWidth
            id='description'
            label='description'
            name='description'
            value={values.description}
            variant='standard'
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
          <ListItem>
            <DatePicker
              disabled
              label='date'
              value={values.last_update}
              onChange={(value) => {
                setValues({ ...values, last_update: value });
              }}
              renderInput={(params) => (
                <TextField
                  fullWidth
                  {...params}
                  margin='dense'
                  required
                  variant='standard'
                />
              )}
            />
          </ListItem>
          {renderButtons()}
        </List>
      </form>
      <AssetBuySellDialog
        open={dialogOpen}
        handleClose={handleAssetBuySellDialogClose}
        asset={asset}
        mode={dialogMode}
      />
    </>
  );
}
