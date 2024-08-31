import React from 'react';
import { useLocation } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

// const PAGE_TRANSACTIONS = {
//   calendar: ['expense', 'income', 'paycheck'],
//   dashboard: ['expense', 'income', 'paycheck'],
//   summary: ['expense', 'income', 'paycheck'],
//   search: ['expense'],
//   networth: [],
//   settings: [''],
//   accounts: ['account'],
//   assets: ['asset'],
//   debts: ['debt'],
// };

export default function FloatingActionButton() {
  const location = useLocation();

  const handleClick = () => {
    let path = location.pathname.split('/');
    let pageName = path[1];
    console.log(`FloatingActionButton clicked! :: ${pageName}`);
  };
  return (
    <Fab
      color='primary'
      sx={{ position: 'absolute', right: 15, bottom: 85 }}
      onClick={handleClick}
    >
      <AddIcon />
    </Fab>
  );
}
