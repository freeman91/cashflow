import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import { findColor, findIcon } from '../../helpers/transactions';
import { openDialog } from '../../store/dialogs';
import Repayment from './Repayment';
import Transaction from './Transaction';
import AssetTransaction from './AssetTransaction';
import SubAccount from './SubAccount';
import Borrow from './Borrow';
import Bill from './Bill';
import Account from './Account';

export default function ItemBox(props) {
  const { item, detailed = false } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

  const [type, setType] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [Icon, setIcon] = useState(null);
  const [color, setColor] = useState(null);

  useEffect(() => {
    let _itemId = null;
    let _type = item._type;

    if (!_type) {
      _itemId = item?.asset_id || item?.debt_id;
      _type = _itemId.split(':')[0];
    } else {
      _itemId = item[`${_type}_id`];
    }

    const _Icon = findIcon(_type, item?.pending);
    const _color = findColor(_type, theme);

    setType(_type);
    setItemId(_itemId);
    setIcon(_Icon);
    setColor(_color);
  }, [item, theme]);

  const handleClick = () => {
    if (['asset', 'debt', 'account'].includes(type)) {
      dispatch(push(`/${type}`, { [`${type}Id`]: itemId }));
    } else {
      dispatch(
        openDialog({
          type: item._type,
          mode: 'edit',
          id: itemId,
          attrs: item,
        })
      );
    }
  };

  if (!type) return null;
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        pl: 1,
        pr: 2,
        cursor: 'pointer',
      }}
    >
      <IconButton
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
          boxShadow: 6,
          borderRadius: '50%',
          p: '4px',
          color,
        }}
      >
        {Icon && <Icon />}
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 1,
        }}
      >
        {type === 'account' && <Account account={item} />}
        {type === 'repayment' && detailed && <Repayment transaction={item} />}
        {['expense', 'repayment', 'paycheck', 'income'].includes(type) &&
          !detailed && <Transaction transaction={item} />}
        {['purchase', 'sale'].includes(type) && (
          <AssetTransaction transaction={item} />
        )}
        {type === 'borrow' && <Borrow transaction={item} />}
        {['asset', 'debt'].includes(type) && <SubAccount item={item} />}
        {type === 'bill' && <Bill bill={item} />}
      </Box>
    </Box>
  );
}
