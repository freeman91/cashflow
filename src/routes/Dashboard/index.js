import React, { useState } from 'react';
import { AppBar, Box, Grid, Tab, Tabs } from '@mui/material';
import ExpensesTable from '../../components/Table/ExpensesTable';
import IncomesTable from '../../components/Table/IncomesTable';
import HoursTable from '../../components/Table/HoursTable';
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews';
import { useTheme } from '@mui/styles';

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Box sx={{ bgcolor: 'background.paper', width: '100%' }}>
          <AppBar position='static'>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='secondary'
              textColor='inherit'
              variant='fullWidth'
              aria-label='full width tabs example'
            >
              <Tab label='Expenses' {...a11yProps(0)} />
              <Tab label='Incomes' {...a11yProps(1)} />
              <Tab label='Hours' {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={value} index={0} dir={theme.direction}>
              <ExpensesTable />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
              <IncomesTable />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
              <HoursTable />
            </TabPanel>
          </SwipeableViews>
        </Box>
      </Grid>
    </Grid>
  );
}
