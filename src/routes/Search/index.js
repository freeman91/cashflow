import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash/get';

import Box from '@mui/material/Box';

import Expenses from './Expenses';
import Incomes from './Incomes';
import Bills from './Bills';
import SearchAppBar from './SearchAppBar';

export const OPTIONS = {
  expenses: Expenses,
  incomes: Incomes,
  bills: Bills,
};

export default function Search() {
  const location = useLocation();

  const defaultOption = Object.keys(OPTIONS)[0];
  const [trigger, setTrigger] = useState(false);
  const [selected, setSelected] = useState(defaultOption);

  useEffect(() => {
    const type = get(location.pathname.split('/'), '2', defaultOption);
    setSelected(type);
  }, [location, defaultOption]);

  const toggleTrigger = () => {
    setTrigger(!trigger);
  };

  const renderTypeTable = () => {
    const Component = OPTIONS[selected];
    return <Component trigger={trigger} toggleTrigger={toggleTrigger} />;
  };

  return (
    <Box sx={{ mb: 9 }}>
      <SearchAppBar title={selected} toggleTrigger={toggleTrigger} />
      {renderTypeTable()}
    </Box>
  );
}
