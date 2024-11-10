import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import Backdrop from '@mui/material/Backdrop';
import Fab from '@mui/material/Fab';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { openDialog } from '../store/dialogs';

export default function FloatingActionButton(props) {
  const { createTypes } = props;
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    if (createTypes.length === 1) {
      dispatch(openDialog({ type: createTypes[0], mode: 'create' }));
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeClick = (type) => {
    dispatch(openDialog({ type, mode: 'create' }));
    handleClose();
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Fab
        color='primary'
        sx={{ position: 'fixed', right: 15, bottom: 85 }}
        onClick={handleClick}
      >
        <AddIcon />
      </Fab>
      <Backdrop open={open}>
        <Menu
          anchorEl={anchorEl}
          id='transaction-menu'
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          MenuListProps={{ sx: { p: 0 } }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          sx={{
            left: -75,
            top: -75,
            '& .MuiMenu-paper': {
              backgroundColor: 'unset',
              backgroundImage: 'unset',
              boxShadow: 'unset',
            },
          }}
        >
          {createTypes.map((type) => {
            return [
              <MenuItem
                key={type}
                onClick={() => handleTypeClick(type)}
                sx={{
                  my: 1,
                  p: '12px',
                  borderRadius: 1,
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <Typography
                  variant='h5'
                  align='center'
                  sx={{ width: '100%' }}
                  fontWeight='bold'
                >
                  {type}
                </Typography>
              </MenuItem>,
            ];
          })}
        </Menu>
      </Backdrop>
    </>
  );
}
