import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash/get';

import Box from '@mui/material/Box';

import Expenses from './Expenses';
import Incomes from './Incomes';
import Bills from './Bills';
import Accounts from './Accounts';
import Assets from './Assets';
import Debts from './Debts';

export default function Search() {
  const location = useLocation();
  const [selected, setSelected] = useState('expenses');

  useEffect(() => {
    const type = get(location.pathname.split('/'), '3', 'expenses');
    setSelected(type);
  }, [location]);

  const renderTypeTable = () => {
    switch (selected) {
      case 'expenses':
        return <Expenses />;
      case 'incomes':
        return <Incomes />;
      case 'bills':
        return <Bills />;
      case 'accounts':
        return <Accounts />;
      case 'assets':
        return <Assets />;
      case 'debts':
        return <Debts />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1000 }}>
      <>select type</>
      {renderTypeTable()}
    </Box>
  );
}
