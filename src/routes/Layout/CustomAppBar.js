import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { goBack, push } from 'redux-first-history';

import BackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import Card from '@mui/material/Card';
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
    <Card raised>
      <IconButton onClick={handleClick}>
        <BackIcon />
      </IconButton>
    </Card>
  );
};

export const SettingsButton = () => {
  const dispatch = useDispatch();
  return (
    <Card raised>
      <IconButton onClick={() => dispatch(push('/settings'))}>
        <SettingsIcon />
      </IconButton>
    </Card>
  );
};

export const CalendarButton = (props) => {
  const { year, month } = props;
  const dispatch = useDispatch();

  const [path, setPath] = useState('');

  useEffect(() => {
    if (year && month) {
      setPath(`/${year}/${month}`);
    } else {
      setPath('');
    }
  }, [year, month]);

  return (
    <Card raised>
      <IconButton onClick={() => dispatch(push(`/calendar${path}`))}>
        <CalendarMonthIcon />
      </IconButton>
    </Card>
  );
};

export default function CustomAppBar() {
  const { title, leftAction, rightAction } = useSelector(
    (state) => state.appSettings.appBar
  );

  return (
    <Grid container justifyContent='center' sx={{ maxWidth: 700, p: 1 }}>
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
  );
}
