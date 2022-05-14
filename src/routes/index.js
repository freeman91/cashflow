import React from 'react';

import SwipeableViews from 'react-swipeable-views';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Tabs, Tab, CssBaseline } from '@mui/material';
import {
  AccountBox,
  DateRange,
  Dashboard as DashboardIcon,
  TrendingUp,
} from '@mui/icons-material';
import { useWindowSize } from 'react-use';

import Dashboard from './Dashboard';
import Summary from './Summary';
import Networth from './Networth';
import User from './User';
import UpdateRecordDialog from '../components/Dialog/UpdateRecordDialog';

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
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    display: 'flex',
    height: '100%',
  },
  content: {
    flexGrow: 1,
  },
}));

export default function Navigation() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const { height, width } = useWindowSize();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <div className={classes.root} style={{ width: width }}>
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
            sx={{
              margin: 'auto',
              justifyContent: 'space-between',
            }}
          >
            <Tab
              label='Dashboard'
              icon={<DashboardIcon />}
              wrapped={true}
              {...a11yProps(0)}
              sx={{
                width: '12rem',
              }}
            />
            <Tab
              label='Summary'
              icon={<DateRange />}
              {...a11yProps(1)}
              sx={{
                width: '12rem',
              }}
            />
            <Tab
              label='Net Worth'
              icon={<TrendingUp />}
              {...a11yProps(2)}
              sx={{
                width: '12rem',
              }}
            />
            <Tab
              label='User'
              icon={<AccountBox />}
              {...a11yProps(3)}
              sx={{
                width: '12rem',
              }}
            />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={value}
          onChangeIndex={handleChangeIndex}
          style={{
            width: width < 1000 ? width : theme.breakpoints.maxWidth,
            margin: 'auto',
            justifyContent: 'space-between',
          }}
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
        <UpdateRecordDialog />
      </main>
    </div>
  );
}
