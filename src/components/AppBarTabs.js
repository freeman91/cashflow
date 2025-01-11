import React from 'react';

import styled from '@mui/material/styles/styled';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const AppBarTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 60,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiTabs-scrollButtons': {
    color: theme.palette.primary.main,
  },
  minHeight: 'unset',
}));

const AppBarTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  paddingTop: 8,
  paddingBottom: 8,
  width: 100,
  minHeight: 'unset',
  '&.Mui-selected': { fontWeight: 'bold', color: theme.palette.text.primary },
}));

export { AppBarTabs, AppBarTab };
