import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'redux-first-history';

import BackIcon from '@mui/icons-material/ArrowBack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

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
    <>
      {/* <Box
        component='img'
        src='/images/wave1.svg'
        alt='Wave'
        title='Wave'
        sx={{ position: 'absolute' }}
      /> */}
      {/* <Box
        style={{
          width: `${650}px`,
          height: `${650}px`,
          overflow: 'hidden',
          backgroundColor: '#3d99f8',
          borderRadius: '50%',
          transition: 'width 0.1s, height 0.1s',
          position: 'absolute',
          zIndex: '-1',
          top: -500,
          left: -160,
          opacity: '1',
        }}
      /> */}
      <Grid
        container
        justifyContent='center'
        sx={{
          maxWidth: 700,
          // mb: '25px',
          p: 1,
        }}
      >
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
    </>
  );
}
