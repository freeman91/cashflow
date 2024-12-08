import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Backdrop from '@mui/material/Backdrop';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';

import { openDialog } from '../../store/dialogs';

const styles = {
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
  '&:hover': {
    backgroundColor: 'primary.dark',
  },
  mb: 1,
};

const AccountPageButton = (props) => {
  const { account } = props;

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEditAccountClick = () => {
    dispatch(openDialog({ type: 'account', mode: 'edit', attrs: account }));
  };

  const handleCreateClick = (type) => {
    dispatch(openDialog({ type, mode: 'create' }));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <IconButton size='medium' onClick={handleClick}>
        <MoreVertIcon sx={{ color: 'button' }} />
      </IconButton>
      <Backdrop open={open}>
        <Menu
          anchorEl={anchorEl}
          id='transaction-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          MenuListProps={{ sx: { pr: 2, pt: 0 } }}
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
          <IconButton size='large' onClick={handleEditAccountClick} sx={styles}>
            <EditIcon />
          </IconButton>
          <IconButton
            size='large'
            onClick={() => handleCreateClick('asset')}
            sx={styles}
          >
            <AccountBalanceWalletIcon />
          </IconButton>
          <IconButton
            size='large'
            onClick={() => handleCreateClick('debt')}
            sx={styles}
          >
            <CreditCardIcon />
          </IconButton>
        </Menu>
      </Backdrop>
    </>
  );
};

export default AccountPageButton;
