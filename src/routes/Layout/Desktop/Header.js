import React from 'react';

import PersonIcon from '@mui/icons-material/PersonTwoTone';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Header() {
  return (
    <React.Fragment>
      <AppBar
        component='div'
        color='primary'
        position='sticky'
        elevation={0}
        sx={{
          zIndex: 0,
          bgcolor: '#2D2D58',
        }}
      >
        <Toolbar>
          <Grid container spacing={1} sx={{ alignItems: 'center' }}>
            <Grid item xs>
              <Typography color='inherit' variant='h5' component='h1'>
                home
              </Typography>
            </Grid>
            <Grid item>
              <IconButton>
                <Avatar>
                  <PersonIcon color='info' />
                </Avatar>
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {/* <AppBar
        component='div'
        position='sticky'
        elevation={0}
        sx={{
          zIndex: 0,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.25),
        }}
      >
        <Tabs value={0} textColor='inherit'>
          <Tab label='Users' />
          <Tab label='Sign-in method' />
          <Tab label='Templates' />
          <Tab label='Usage' />
        </Tabs>
      </AppBar> */}
    </React.Fragment>
  );
}

Header.propTypes = {};

export default Header;
