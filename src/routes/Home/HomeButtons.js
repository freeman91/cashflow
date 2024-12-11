import React from 'react';
import { useDispatch } from 'react-redux';

import useTheme from '@mui/material/styles/useTheme';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';

const CreateButton = (props) => {
  const { Icon, label, color, onClick } = props;
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
  const theme = useTheme();
  const dispatch = useDispatch();
  const lightColor = alpha(theme.palette.primary.main, 0.2);

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
          color='primary.main'
          onClick={() => handleCreateClick('expense')}
        />
        <CreateButton
          Icon={AttachMoneyIcon}
          label='income'
          color={lightColor}
          onClick={() => handleCreateClick('income')}
        />
        <CreateButton
          Icon={LocalAtmIcon}
          label='paycheck'
          color={lightColor}
          onClick={() => handleCreateClick('paycheck')}
        />
        <CreateButton
          Icon={MoreHorizIcon}
          label='more'
          color={lightColor}
          onClick={() => handleCreateClick('more')}
        />
      </Stack>
    </Grid>
  );
}
