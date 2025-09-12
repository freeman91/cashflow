import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WorkIcon from '@mui/icons-material/Work';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';

import { openItemView } from '../../../store/itemView';
import ReactiveButton from '../../../components/ReactiveButton';

const DEFAULT_TYPES = ['expense', 'income', 'paycheck', 'repayment'];

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
  zIndex: 1,
}));

const getTypeIcon = (type) => {
  switch (type) {
    case 'expense':
      return AttachMoneyIcon;
    case 'income':
      return AccountBalanceWalletIcon;
    case 'paycheck':
      return WorkIcon;
    case 'repayment':
      return CreditCardIcon;
    default:
      return AddIcon;
  }
};

export default function CreateTransactionButton(props) {
  const {
    types = DEFAULT_TYPES,
    useButtonOnMobile = false,
    attrs = {},
  } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleMenuItemClick = (type) => {
    dispatch(
      openItemView({
        itemType: type,
        mode: 'create',
        attrs,
      })
    );
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <ReactiveButton
        ref={anchorRef}
        label='Transaction'
        handleClick={handleToggle}
        Icon={AddIcon}
        color='primary'
        useButtonOnMobile={useButtonOnMobile}
      />
      {isMobile ? (
        <SwipeableDrawer
          anchor='bottom'
          open={open}
          onOpen={() => {}} // Prevent opening on swipe up
          onClose={handleClose}
          sx={{
            '& .MuiDrawer-paper': {
              height: '40%',
              overflow: 'visible',
              backgroundColor: (theme) => theme.palette.surface[250],
              backgroundImage: 'unset',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            },
          }}
        >
          <Puller />
          <List disablePadding sx={{ px: 2, pt: 4, bgcolor: 'unset' }}>
            {types.map((type) => {
              const IconComponent = getTypeIcon(type);
              return (
                <ListItemButton
                  key={type}
                  onClick={() => handleMenuItemClick(type)}
                  sx={{
                    my: 1,
                    bgcolor: 'surface.200',
                    borderRadius: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': {
                      bgcolor: 'surface.300',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      position: 'absolute',
                      left: 16,
                      minWidth: 'auto',
                      zIndex: 1,
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText
                    primary={startCase(type)}
                    sx={{ textAlign: 'center' }}
                    slotProps={{
                      primary: {
                        sx: { fontWeight: 500 },
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </SwipeableDrawer>
      ) : (
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Box>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    id='split-button-menu'
                    autoFocusItem
                    disablePadding
                    sx={{
                      bgcolor: 'surface.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.shadows[4],
                    }}
                  >
                    {types.map((type) => (
                      <MenuItem
                        key={type}
                        onClick={() => handleMenuItemClick(type)}
                      >
                        {startCase(type)}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Box>
            </Grow>
          )}
        </Popper>
      )}
    </>
  );
}
