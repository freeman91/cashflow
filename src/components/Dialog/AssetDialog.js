import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import MenuItem from '@mui/material/MenuItem';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextFieldListItem from '../List/TextFieldListItem';

import { deleteAsset, postAsset, putAsset } from '../../store/assets';
import { closeDialog } from '../../store/dialogs';
import BaseDialog from './BaseDialog';
import AccountSelect from '../Selector/AccountSelect';
import DecimalFieldListItem from '../List/DecimalFieldListItem';
import SelectOption from '../Selector/SelectOption';

const defaultAsset = {
  asset_id: '',
  date: dayjs().hour(12).minute(0).second(0),
  account_id: '',
  _type: 'asset',
  name: '',
  value: '',
  category: '',
  shares: '',
  price: '',
  can_deposit_to: false,
  can_pay_from: false,
};

function AssetDialog() {
  const dispatch = useDispatch();
  const optionLists = useSelector((state) => state.optionLists.data);
  const assets = useSelector((state) => state.assets.data);
  const { mode, id, attrs } = useSelector((state) => state.dialogs.asset);
  const [asset, setAsset] = useState(defaultAsset);

  const hasShares = asset.category === 'stock' || asset.category === 'crypto';
  const assetCategories = find(optionLists, {
    option_type: 'asset_category',
  });

  useEffect(() => {
    if (id) {
      let _asset = find(assets, { asset_id: id });
      setAsset(_asset);
    }
  }, [id, assets]);

  useEffect(() => {
    if (!isEmpty(attrs)) {
      setAsset((e) => ({ ...e, ...attrs }));
    }
  }, [attrs]);

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let _asset = { ...asset };

    if (!hasShares) {
      _asset.shares = null;
      _asset.price = null;
    }

    if (mode === 'create') {
      dispatch(postAsset(_asset));
    } else dispatch(putAsset(_asset));
    handleClose();
  };

  const handleDelete = () => {
    dispatch(deleteAsset(asset.asset_id));
    handleClose();
  };

  const handleClose = () => {
    dispatch(closeDialog('asset'));
    setAsset(defaultAsset);
  };

  const titleOptions = [
    mode === 'edit' && (
      <MenuItem key='purchase' onClick={() => {}}>
        purchase
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='sale' onClick={() => {}}>
        sale
      </MenuItem>
    ),
    mode === 'edit' && (
      <MenuItem key='delete' onClick={handleDelete}>
        delete
      </MenuItem>
    ),
  ].filter(Boolean);
  return (
    <BaseDialog
      type={defaultAsset._type}
      title={`${mode} ${defaultAsset._type}`}
      handleClose={handleClose}
      titleOptions={titleOptions}
    >
      <form style={{ width: '100%' }}>
        <List>
          {/* {mode !== 'create' && (
            <TextFieldListItem
              id='asset_id'
              label='asset_id'
              value={asset.asset_id}
              InputProps={{
                readOnly: true,
                disableUnderline: true,
              }}
            />
          )} */}
          <AccountSelect resource={asset} setResource={setAsset} />
          <TextFieldListItem
            id='name'
            label='name'
            value={asset.name}
            onChange={handleChange}
          />
          <DecimalFieldListItem id='value' item={asset} setItem={setAsset} />
          <SelectOption
            id='category'
            label='category'
            value={asset.category}
            options={get(assetCategories, 'options', [])}
            onChange={handleChange}
          />
          {hasShares && (
            <DecimalFieldListItem
              id='shares'
              item={asset}
              setItem={setAsset}
              startAdornment={null}
            />
          )}
          {hasShares && (
            <DecimalFieldListItem id='price' item={asset} setItem={setAsset} />
          )}

          <ListItem disableGutters disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() =>
                setAsset((prevAsset) => ({
                  ...prevAsset,
                  can_deposit_to: !prevAsset.can_deposit_to,
                }))
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={asset.can_deposit_to}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText primary='can deposit to' />
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters disablePadding>
            <ListItemButton
              role={undefined}
              onClick={() =>
                setAsset((prevAsset) => ({
                  ...prevAsset,
                  can_pay_from: !prevAsset.can_pay_from,
                }))
              }
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge='start'
                  checked={asset.can_pay_from}
                  tabIndex={-1}
                />
              </ListItemIcon>
              <ListItemText primary='can pay from' />
            </ListItemButton>
          </ListItem>

          <ListItem
            key='buttons'
            disableGutters
            sx={{ justifyContent: 'space-around' }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              color='info'
              sx={{ width: '45%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '45%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </form>
    </BaseDialog>
  );
}

export default AssetDialog;
