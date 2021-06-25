import React, { useState } from 'react';
import { useLifecycles } from 'react-use';

import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  AppBar,
  Box,
  Tabs,
  Tab,
  Typography,
  CssBaseline,
} from '@material-ui/core';
import {
  AccountBox,
  DateRange,
  Dashboard as DashboardIcon,
  TrendingUp,
} from '@material-ui/icons';
import { useWindowSize } from 'react-use';

import Dashboard from './Dashboard';
import Summary from './Summary';
import Networth from './Networth';
import User from './User';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
    width: '100%',
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const isClient = typeof window === 'object';
  const { height } = useWindowSize();
  // eslint-disable-next-line
  const [windowSize, setWindowSize] = useState(getSize);

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  function handleResize() {
    setWindowSize(getSize());
  }

  useLifecycles(
    () => {
      //mount
      if (!isClient) {
        return false;
      }

      window.addEventListener('resize', handleResize);
    },
    () => {
      //unmount
      window.removeEventListener('resize', handleResize);
    }
  );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <main
        className={classes.content}
        style={{ height: `${height}`, overflow: 'auto' }}
      >
        <AppBar position='static' color='default'>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            variant='fullWidth'
            aria-label='full width tabs example'
          >
            <Tab
              label='Dashboard'
              icon={<DashboardIcon />}
              wrapped={true}
              {...a11yProps(0)}
            />
            <Tab label='Summary' icon={<DateRange />} {...a11yProps(1)} />
            <Tab label='Net Worth' icon={<TrendingUp />} {...a11yProps(2)} />
            <Tab label='User' icon={<AccountBox />} {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Dashboard />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Summary />
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Networth />
          </TabPanel>
          <TabPanel value={value} index={3} dir={theme.direction}>
            <User />
          </TabPanel>
        </SwipeableViews>
      </main>
    </div>
  );
}
