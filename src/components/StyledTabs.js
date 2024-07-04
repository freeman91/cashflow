import React from 'react';

import { styled } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

const StyledTabs = styled((props) => <Tabs {...props} />)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const StyledTab = styled((props) => <Tab {...props} />)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(17),
  '&.Mui-selected': {
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: theme.palette.surface[250],
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
}));

export { StyledTabs, StyledTab };
