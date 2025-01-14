import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import useMediaQuery from '@mui/material/useMediaQuery';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';

import { openItemView } from '../../../store/itemView';

const DEFAULT_TYPES = [
  // 'borrow',
  'expense',
  'income',
  'paycheck',
  // 'purchase',
  'repayment',
  // 'sale',
  'transfer',
];

export default function CreateTransactionButton(props) {
  const { types = DEFAULT_TYPES, attrs = {} } = props;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

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
      {isMobile ? (
        <IconButton ref={anchorRef} color='primary' onClick={handleToggle}>
          <AddIcon />
        </IconButton>
      ) : (
        <Button
          ref={anchorRef}
          variant='contained'
          color='primary'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleToggle}
        >
          Add Transaction
        </Button>
      )}
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
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu' autoFocusItem>
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
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
