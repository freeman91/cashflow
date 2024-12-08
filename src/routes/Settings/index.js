import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import BillTemplates from './BillTemplates';
import PaycheckSettings from './PaycheckSettings';
import OptionsList from './OptionsList';
import CategoryList from './CategoryList';
import CustomAppBar from '../../components/CustomAppBar';

const EXPENSE_VENDORS = 'expense-vendors';
const EXPENSE_CATEGORIES = 'expense-categories';
const INCOME_SOURCES = 'income-sources';
const INCOME_CATEGORIES = 'income-categories';
const ASSET_CATEGORIES = 'asset-categories';
const PAYCHECK_TEMPLATES = 'paycheck-templates';
const BILL_TEMPLATES = 'bill-templates';

const OPTIONS = [
  EXPENSE_VENDORS,
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  INCOME_CATEGORIES,
  ASSET_CATEGORIES,
  PAYCHECK_TEMPLATES,
  BILL_TEMPLATES,
];

export default function Settings() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const option = get(location.pathname.split('/'), '2');
    setSelected(option);
  }, [location]);

  const handleClick = (type) => {
    dispatch(push(`/settings/${type}`));
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {selected ? lowerCase(selected) : 'settings'}
          </Typography>
        }
      />
      <Box sx={{ height: '46px' }} />
      {!selected && (
        <Stack orientation='column'>
          {OPTIONS.map((option) => {
            return (
              <Box
                key={option}
                sx={{
                  m: 1,
                  p: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'surface.200',
                    color: 'primary.main',
                  },
                  backgroundColor: 'surface.250',
                  borderRadius: '5px',
                }}
                onClick={() => handleClick(option)}
              >
                <Typography variant='body1' align='center'>
                  {lowerCase(option)}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
      {selected && (
        <Typography variant='h6' align='center' fontWeight='bold'>
          {lowerCase(selected)}
        </Typography>
      )}
      {selected === EXPENSE_VENDORS && (
        <OptionsList optionType='expense_vendor' placeholder='vendor' />
      )}
      {selected === EXPENSE_CATEGORIES && (
        <CategoryList categoryType='expense' placeholder='category' />
      )}
      {selected === INCOME_SOURCES && (
        <OptionsList optionType='income_source' placeholder='source' />
      )}
      {selected === INCOME_CATEGORIES && (
        <OptionsList optionType='income_category' placeholder='category' />
      )}
      {selected === ASSET_CATEGORIES && (
        <OptionsList optionType='asset_category' placeholder='category' />
      )}
      {selected === PAYCHECK_TEMPLATES && <PaycheckSettings />}
      {selected === BILL_TEMPLATES && <BillTemplates />}
    </Box>
  );
}
