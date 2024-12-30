import React from 'react';

import PersonIcon from '@mui/icons-material/PersonTwoTone';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';

import LogoImg from '../../../components/CustomAppBar/LogoImg';

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
          borderBottom: (theme) => `1px solid ${theme.palette.surface[200]}`,
        }}
      >
        <Toolbar>
          <Grid
            container
            spacing={1}
            sx={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Grid item xs>
              <ListItem>
                <ListItemIcon sx={{ minWidth: 'fit-content', mr: 1 }}>
                  <LogoImg />
                </ListItemIcon>
                <ListItemText
                  primary='cashflow'
                  primaryTypographyProps={{
                    fontWeight: 'bold',
                    variant: 'h4',
                    color: 'success.main',
                    lineHeight: 1,
                  }}
                />
              </ListItem>
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
    </React.Fragment>
  );
}

Header.propTypes = {};

export default Header;
