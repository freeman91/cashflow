import React from 'react';

import { styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const StyledSubtabs = styled((props) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className='MuiTabs-indicatorSpan' /> }}
  />
))({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  minHeight: 'unset',
  marginBottom: '4px',
  borderRadius: '5px',
  paddingBottom: 'unset !important',
});

const StyledSubtab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  padding: 8,
  minHeight: 'unset',
  '&.Mui-selected': {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: theme.palette.surface[250],
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export { StyledSubtabs, StyledSubtab };
