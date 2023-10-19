import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filter, isEmpty, map } from 'lodash';

import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import { closeDialog, openDialog } from '../../store/dialogs';
import { numberToCurrency } from '../../helpers/currency';

export default function AssetsDialog() {
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const { open, attrs: account } = useSelector((state) => state.dialogs.assets);

  const [assets, setAssets] = useState([]);

  useEffect(
    (state) => {
      if (!isEmpty(account)) {
        setAssets(filter(allAssets, { account_id: account.id }));
      }
    },
    [account, allAssets]
  );

  const handleClick = (asset) => {
    dispatch(openDialog({ mode: 'update', attrs: asset }));
  };

  const handleClose = () => {
    dispatch(closeDialog());
  };

  const renderShares = (asset) => {
    if (asset.type === 'crypto' || asset.type === 'stock') {
      return (
        <ListItemText primaryTypographyProps={{ align: 'right' }}>
          {Math.round(asset.shares * 10000) / 10000}
        </ListItemText>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {account.name}
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: '30rem' }}>
        <List>
          <ListItemButton disabled>
            <ListItemText primaryTypographyProps={{ align: 'left' }}>
              asset
            </ListItemText>
            <ListItemText primaryTypographyProps={{ align: 'right' }}>
              shares
            </ListItemText>
            <ListItemText
              primaryTypographyProps={{ align: 'right' }}
              sx={{ minWidth: '10rem' }}
            >
              value
            </ListItemText>
          </ListItemButton>
          {map(assets, (asset) => {
            return (
              <ListItemButton key={asset.id} onClick={() => handleClick(asset)}>
                <ListItemText primaryTypographyProps={{ align: 'left' }}>
                  {asset.name}
                </ListItemText>
                {renderShares(asset)}
                <ListItemText
                  primaryTypographyProps={{ align: 'right' }}
                  sx={{ minWidth: '10rem' }}
                >
                  {numberToCurrency.format(asset.value)}
                </ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
