import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import CustomAppBar from '../../components/CustomAppBar';
import Expenses from './Expenses';
import Incomes from './Incomes';

const EXPENSES = 'expenses';
const INCOMES = 'incomes';
const OPTIONS = [EXPENSES, INCOMES];

export default function Search() {
  const location = useLocation();
  const dispatch = useDispatch();
  const toolbarRef = useRef(null);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const option = get(location.pathname.split('/'), '2');
    setSelected(option);
  }, [location]);

  const handleClick = (type) => {
    dispatch(push(`/search/${type}`));
  };

  const marginTop = toolbarRef?.current?.offsetHeight || 90;
  return (
    <Box sx={{ height: '100%', width: '100%', mb: 18 }}>
      <CustomAppBar
        ref={toolbarRef}
        title={
          <Typography
            variant='h6'
            fontWeight='bold'
            onClick={() => {
              dispatch(push('/search'));
            }}
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
          >
            search
          </Typography>
        }
      />
      <Box sx={{ height: marginTop + 'px', pt: 1 }} />
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
                  '&:hover': { backgroundColor: 'surface.250' },
                  backgroundColor: 'surface.300',
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
