import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Expenses from './Expenses';
import Incomes from './Incomes';
import CustomAppBar from '../../components/CustomAppBar';

const EXPENSES = 'expenses';
const INCOMES = 'incomes';
const OPTIONS = [EXPENSES, INCOMES];

export default function Search() {
  const location = useLocation();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const option = get(location.pathname.split('/'), '2');
    setSelected(option);
  }, [location]);

  const handleClick = (type) => {
    dispatch(push(`/search/${type}`));
  };

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {selected ? lowerCase(selected) : 'search'}
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
      {selected === EXPENSES && <Expenses />}
      {selected === INCOMES && <Incomes />}
    </Box>
  );
}
