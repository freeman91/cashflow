import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBack';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { goBack } from 'redux-first-history';

const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

export const BackButton = (props) => {
  const { onClick } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      dispatch(goBack());
    }
  };

  return (
    <IconButton onClick={handleClick}>
      <BackIcon sx={{ hieght: 25, width: 25 }} />
    </IconButton>
  );
};

export default function CustomAppBar() {
  const { title, leftAction, rightAction } = useSelector(
    (state) => state.appSettings.appBar
  );

  return (
    <Box>
      <AppBar position='fixed'>
        <Toolbar>
          <Grid container justifyContent='center'>
            <Grid item xs={3} display='flex' justifyContent='flex-start'>
              {leftAction}
            </Grid>
            <Grid item xs={6} sx={{ alignSelf: 'center' }}>
              {title && (
                <Typography
                  align='center'
                  variant='h5'
                  fontWeight='bold'
                  sx={{ height: '100%' }}
                >
                  {title}
                </Typography>
              )}
            </Grid>
            <Grid item xs={3} display='flex' justifyContent='flex-end'>
              {rightAction}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Offset />
    </Box>
  );
}
