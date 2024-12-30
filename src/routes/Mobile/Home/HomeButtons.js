import React from 'react';
import { useDispatch } from 'react-redux';

import useTheme from '@mui/material/styles/useTheme';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';

import { darken as _darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../../store/dialogs';

export const CreateButton = (props) => {
  const { Icon, label, onClick, darken } = props;
  const theme = useTheme();

  const color = darken
    ? _darken(theme.palette.primary.main, 0.7)
    : theme.palette.primary.main;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          borderRadius: '50%',
          backgroundColor: color,
        }}
      >
        <IconButton size='large' color='white' onClick={onClick}>
          <Icon />
        </IconButton>
      </Box>
      <Typography
        variant='body1'
        color='primary'
        align='center'
        fontWeight='bold'
      >
        {label}
      </Typography>
    </Box>
  );
};

export default function HomeButtons() {
  const dispatch = useDispatch();

  const handleCreateClick = (type) => {
    if (type !== 'more') {
      dispatch(openDialog({ type, mode: 'create' }));
    }
  };

  return (
    <Grid item xs={12} display='flex' justifyContent='center'>
      <Stack
        direction='row'
        spacing={1}
        justifyContent='space-around'
        width='100%'
        sx={{ px: 2, mt: 2 }}
      >
        <CreateButton
          Icon={CreditCardIcon}
          label='expense'
          onClick={() => handleCreateClick('expense')}
        />
        <CreateButton
          Icon={AttachMoneyIcon}
          label='income'
          darken={true}
          onClick={() => handleCreateClick('income')}
        />
        <CreateButton
          Icon={LocalAtmIcon}
          label='paycheck'
          darken={true}
          onClick={() => handleCreateClick('paycheck')}
        />
      </Stack>
    </Grid>
  );
}
