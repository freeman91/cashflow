import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'lodash/get';
import includes from 'lodash/includes';

import Box from '@mui/material/Box';

import SettingsAppBar from './SettingsAppBar';
import OptionsList from './OptionsList';
import CategoryList from './CategoryList';

export const OPTIONS = {
  vendors: {
    type: 'expense_vendor',
    placeholder: 'vendor',
  },
  expense_categories: {
    type: 'expense',
    placeholder: 'category',
  },
  sources: {
    type: 'income_source',
    placeholder: 'source',
  },
  income_categories: {
    type: 'income_category',
    placeholder: 'category',
  },
  asset_categories: {
    type: 'asset_category',
    placeholder: 'category',
  },
  paycheck: {},
};

export default function Settings() {
  const location = useLocation();

  const [selected, setSelected] = useState(Object.keys(OPTIONS)[0]);
  const [trigger, setTrigger] = useState(null);

  useEffect(() => {
    const option = get(
      location.pathname.split('/'),
      '2',
      Object.keys(OPTIONS)[0]
    );
    setSelected(option);
  }, [location]);

  const toggleTrigger = () => {
    setTrigger(!trigger);
    if (!trigger) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderOptionComponent = () => {
    const option = get(OPTIONS, selected);
    if (
      includes(
        ['vendors', 'sources', 'income_categories', 'asset_categories'],
        selected
      )
    )
      return (
        <OptionsList
          optionType={option.type}
          placeholder={option.placeholder}
          trigger={trigger}
          toggleTrigger={toggleTrigger}
        />
      );

    if (selected === 'expense_categories') {
      return (
        <CategoryList
          categoryType={option.type}
          placeholder={option.placeholder}
          trigger={trigger}
          toggleTrigger={toggleTrigger}
        />
      );
    }

    return null;
  };

  return (
    <Box sx={{ mb: 7, mt: 1 }}>
      <SettingsAppBar title={selected} toggleTrigger={toggleTrigger} />
      {renderOptionComponent()}
    </Box>
  );
}
