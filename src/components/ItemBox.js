import React from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@emotion/react';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../helpers/currency';
import { openDialog } from '../store/dialogs';
import BoxFlexColumn from './BoxFlexColumn';
import BoxFlexCenter from './BoxFlexCenter';

export default function ItemBox(props) {
  const { item } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const location = useLocation();

  const item_id = item[`${item._type}_id`];

  const handleClick = (e, item) => {
    const path = `/${item._type}s/` + item_id;
    if (location.pathname === path) {
      handleEditClick(e);
    } else {
      dispatch(push(`/${item._type}s/` + item_id));
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    dispatch(
      openDialog({
        type: item._type,
        mode: 'edit',
        id: item[`${item._type}_id`],
      })
    );
  };

  const amount = 'amount' in item ? item.amount : item.value;
  const color =
    item._type === 'asset' ? theme.palette.green[400] : theme.palette.red[400];
  const Icon =
    item._type === 'asset' ? AccountBalanceWalletIcon : CreditCardIcon;
  return (
    <Box
      key={item.asset_id}
      onClick={(e) => handleClick(e, item)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        cursor: 'pointer',
      }}
    >
      <IconButton
        onClick={(e) => handleEditClick(e)}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
          boxShadow: 6,
          borderRadius: '50%',
          p: '4px',
          color,
        }}
      >
        <Icon />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {item.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {item.category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexCenter>
          <Typography variant='h5' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(amount)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    </Box>
  );
}
