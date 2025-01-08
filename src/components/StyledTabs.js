import React from 'react';

import styled from '@mui/material/styles/styled';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export const StyledTabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 0,
  },
  minHeight: 'unset',
  backgroundColor: theme.palette.surface[400],
  borderRadius: '8px',
  height: 'fit-content',
}));

export const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  paddingTop: 10,
  paddingBottom: 10,
  minHeight: 'unset',
  fontWeight: 'bold',
  borderRadius: '8px',
  color: theme.palette.primary.contrastText,
  transition: 'background-color 0.3s ease, color 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));
