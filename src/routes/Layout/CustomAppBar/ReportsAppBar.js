import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

export const MONTH = 'month';
// const QUARTER = 'quarter';
export const YEAR = 'year';
export const TYPES = [MONTH, YEAR];
export const OVERVIEW = 'overview';
export const INCOMES = 'incomes';
export const EXPENSES = 'expenses';
export const REPAYMENTS = 'repayments';
export const CATEGORIES = 'categories';
export const MERCHANTS = 'merchants';
export const VIEWS = [
  OVERVIEW,
  INCOMES,
  EXPENSES,
  REPAYMENTS,
  CATEGORIES,
  MERCHANTS,
];
export default function ReportsAppBar() {
  const dispatch = useDispatch();
  const location = useLocation();

  const type = get(location.pathname.split('/'), '2', MONTH);
  const view = get(location.pathname.split('/'), '3', OVERVIEW);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Select
        variant='standard'
        disableUnderline
        value={view}
        onChange={(e) => dispatch(push(`/reports/${type}/${e.target.value}`))}
        MenuProps={{
          MenuListProps: {
            disablePadding: true,
          },
        }}
      >
        {VIEWS.map((_view) => (
          <MenuItem key={_view} value={_view}>
            <Typography variant='h6' fontWeight='bold'>
              {startCase(_view)}
            </Typography>
          </MenuItem>
        ))}
      </Select>
      {TYPES.map((_type) => (
        <Box
          key={_type}
          onClick={() => {
            dispatch(push(`/reports/${_type}`));
          }}
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) =>
              type === _type ? theme.vars.overlays[24] : 'unset',
            boxShadow: (theme) => (type === _type ? theme.shadows[4] : 'unset'),
            borderRadius: 4,
            py: 0.5,
            px: 3,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'background.paper',
              backgroundImage: (theme) => theme.vars.overlays[24],
            },
          }}
        >
          <Typography
            variant='body2'
            color={type === _type ? 'text.primary' : 'text.secondary'}
          >
            {startCase(_type)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
