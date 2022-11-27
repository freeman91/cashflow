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

export default function DebtsDialog() {
  const dispatch = useDispatch();
  const allDebts = useSelector((state) => state.debts.data);
  const { open, attrs: account } = useSelector((state) => state.dialogs.debts);

  const [debts, setDebts] = useState([]);

  useEffect(
    (state) => {
      if (!isEmpty(account)) {
        setDebts(filter(allDebts, { account_id: account.id }));
      }
    },
    [account, allDebts]
  );

  const handleClick = (debt) => {
    dispatch(openDialog({ mode: 'update', attrs: debt }));
  };

  const handleClose = () => {
    dispatch(closeDialog());
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
              debt
            </ListItemText>
            <ListItemText
              primaryTypographyProps={{ align: 'right' }}
              sx={{ minWidth: '10rem' }}
            >
              value
            </ListItemText>
          </ListItemButton>
          {map(debts, (debt) => {
            return (
              <ListItemButton key={debt.id} onClick={() => handleClick(debt)}>
                <ListItemText primaryTypographyProps={{ align: 'left' }}>
                  {debt.name}
                </ListItemText>
                <ListItemText primaryTypographyProps={{ align: 'right' }}>
                  {numberToCurrency.format(debt.value)}
                </ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
