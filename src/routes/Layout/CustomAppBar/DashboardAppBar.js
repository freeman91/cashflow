import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import LoopIcon from '@mui/icons-material/Loop';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../../store/itemView';
import { refreshAllData } from '../../../store/user';
import ReactiveButton from '../../../components/ReactiveButton';

const DEFAULT_TYPES = ['expense', 'income', 'paycheck', 'repayment'];

export default function DashboardAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.user.item);

  const [anchorEl, setAnchorEl] = useState(null);
  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false);
  const transactionAnchorRef = useRef(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    dispatch(refreshAllData(user.user_id));
    handleMenuClose();
  };

  const handleTransactionMenuToggle = () => {
    setTransactionMenuOpen((prevOpen) => !prevOpen);
  };

  const handleTransactionMenuClose = (event) => {
    if (
      transactionAnchorRef.current &&
      transactionAnchorRef.current.contains(event.target)
    ) {
      return;
    }
    setTransactionMenuOpen(false);
  };

  const handleMenuItemClick = (type) => {
    dispatch(
      openItemView({
        itemType: type,
        mode: 'create',
        attrs: {},
      })
    );
    setTransactionMenuOpen(false);
  };

  if (isMobile) {
    // Mobile Layout: Center title + Right menu button
    return (
      <>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '60%',
          }}
        >
          Dashboard
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleRefresh}>
            <LoopIcon sx={{ mr: 1 }} />
            <Box>Refresh</Box>
          </MenuItem>
          <MenuItem onClick={handleTransactionMenuToggle}>
            <AddIcon sx={{ mr: 1 }} />
            <Box>Create Transaction</Box>
          </MenuItem>
        </Menu>
        <Popper
          sx={{ zIndex: 1 }}
          open={transactionMenuOpen}
          anchorEl={transactionAnchorRef.current}
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
                <ClickAwayListener onClickAway={handleTransactionMenuClose}>
                  <MenuList
                    id='transaction-menu'
                    autoFocusItem
                    disablePadding
                    sx={{
                      bgcolor: 'surface.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.shadows[4],
                    }}
                  >
                    {DEFAULT_TYPES.map((type) => (
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
      </>
    );
  }

  // Desktop Layout: Left title + Right-aligned buttons
  return (
    <>
      <Typography
        variant='h5'
        fontWeight='bold'
        sx={{
          flexGrow: 1,
          ml: 1,
        }}
      >
        Dashboard
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <ReactiveButton
          ref={transactionAnchorRef}
          label='Transaction'
          handleClick={handleTransactionMenuToggle}
          Icon={AddIcon}
          color='primary'
        />
        <ReactiveButton
          label='Refresh'
          handleClick={handleRefresh}
          Icon={LoopIcon}
          color='primary'
          variant='outlined'
        />
        <Popper
          sx={{ zIndex: 1 }}
          open={transactionMenuOpen}
          anchorEl={transactionAnchorRef.current}
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
                <ClickAwayListener onClickAway={handleTransactionMenuClose}>
                  <MenuList
                    id='transaction-menu'
                    autoFocusItem
                    disablePadding
                    sx={{
                      bgcolor: 'surface.300',
                      borderRadius: 1,
                      overflow: 'hidden',
                      boxShadow: (theme) => theme.shadows[4],
                    }}
                  >
                    {DEFAULT_TYPES.map((type) => (
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
      </Box>
    </>
  );
}
