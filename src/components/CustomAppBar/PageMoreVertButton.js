import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { openDialog } from '../../store/dialogs';
import { CreateButton } from '../../routes/Mobile/Home/HomeButtons';
import { findIcon } from '../../helpers/transactions';

const OPTIONS = {
  account: ['asset', 'debt'],
  asset: ['purchase', 'sale'],
  debt: ['repayment', 'income'],
};

export default function PageMoreVertButton(props) {
  const { item } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditClick = () => {
    dispatch(openDialog({ type: item._type, mode: 'edit', attrs: item }));
  };

  const handleCreateClick = (type) => {
    let attrs = {};
    if (type === 'repayment') {
      attrs = {
        user_id: item.user_id,
        category: item.category,
        subcategory: item.subcategory,
        pending: true,
        debt_id: item.debt_id,
      };
    }
    dispatch(openDialog({ type, mode: 'create', attrs }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton size='medium' onClick={handleClick} color='info'>
        <MoreVertIcon />
      </IconButton>
      <Backdrop open={open}>
        <Menu
          anchorEl={anchorEl}
          id='transaction-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          MenuListProps={{ sx: { mr: 0, px: 2, py: 1 } }}
          transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          sx={{
            right: 75,
            top: 50,
            '& .MuiMenu-paper': {
              backgroundColor: 'unset',
              backgroundImage: 'unset',
              boxShadow: 'unset',
            },
          }}
        >
          <CreateButton
            Icon={EditIcon}
            label='edit'
            onClick={handleEditClick}
          />
          {OPTIONS[item?._type]?.map((type) => (
            <CreateButton
              key={type}
              darken
              Icon={findIcon(type)}
              label={type}
              onClick={() => handleCreateClick(type)}
            />
          ))}
        </Menu>
      </Backdrop>
    </>
  );
}
