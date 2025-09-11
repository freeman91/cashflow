import React from 'react';
import { useDispatch } from 'react-redux';
import startCase from 'lodash/startCase';

import styled from '@mui/material/styles/styled';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../../store/itemView';

const Puller = styled('div')(({ theme }) => ({
  width: 40,
  height: 6,
  backgroundColor: theme.palette.surface[400],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 20px)',
}));

const DEFAULT_TYPES = ['expense', 'income', 'paycheck', 'repayment'];

export default function TransactionTypeDrawer({ open, onClose }) {
  const dispatch = useDispatch();

  const handleMenuItemClick = (type) => {
    dispatch(
      openItemView({
        itemType: type,
        mode: 'create',
        attrs: {},
      })
    );
    onClose();
  };

  return (
    <SwipeableDrawer
      anchor='bottom'
      open={open}
      onOpen={() => {}} // Prevent opening on swipe up
      onClose={onClose}
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
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant='h6' sx={{ textAlign: 'center', mb: 1 }}>
          Create Transaction
        </Typography>
      </Box>
      <List disablePadding sx={{ px: 1, bgcolor: 'unset' }}>
        {DEFAULT_TYPES.map((type) => (
          <ListItemButton
            key={type}
            onClick={() => handleMenuItemClick(type)}
            sx={{
              my: 1,
              bgcolor: 'surface.200',
              borderRadius: 1,
              '&:hover': {
                bgcolor: 'surface.300',
              },
            }}
          >
            <ListItemText
              primary={startCase(type)}
              sx={{ textAlign: 'center' }}
              slotProps={{
                primary: {
                  align: 'center',
                  sx: { fontWeight: 500 },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </SwipeableDrawer>
  );
}
