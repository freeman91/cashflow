import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';

import { openItemView } from '../../../store/itemView';
import ReactiveButton from '../../../components/ReactiveButton';

const DEFAULT_TYPES = [
  'expense',
  'income',
  'paycheck',
  'repayment',
  'transfer',
];

export default function CreateTransactionButton(props) {
  const { types = DEFAULT_TYPES, attrs = {} } = props;
  const dispatch = useDispatch();
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
      <ReactiveButton
        ref={anchorRef}
        label='Transaction'
        handleClick={handleToggle}
        Icon={AddIcon}
        color='primary'
      />
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
    </>
  );
}
