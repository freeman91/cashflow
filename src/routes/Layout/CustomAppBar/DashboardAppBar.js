import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import LoopIcon from '@mui/icons-material/Loop';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { refreshAllData } from '../../../store/user';
import ReactiveButton from '../../../components/ReactiveButton';

export default function DashboardAppBar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const user = useSelector((state) => state.user.item);

  const handleRefresh = () => {
    dispatch(refreshAllData(user.user_id));
  };

  if (isMobile) {
    // Mobile Layout: Center title + Right refresh button
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
          <IconButton onClick={handleRefresh}>
            <LoopIcon />
          </IconButton>
        </Box>
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
          label='Refresh'
          handleClick={handleRefresh}
          Icon={LoopIcon}
          color='primary'
          variant='outlined'
        />
      </Box>
    </>
  );
}
