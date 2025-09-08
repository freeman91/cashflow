import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
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
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const type = get(location.pathname.split('/'), '2', MONTH);
  const view = get(location.pathname.split('/'), '3', OVERVIEW);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (newView) => {
    dispatch(push(`/reports/${type}/${newView}`));
    handleMenuClose();
  };

  const handleTypeChange = (newType) => {
    dispatch(push(`/reports/${newType}`));
    handleMenuClose();
  };

  if (isMobile) {
    // Mobile Layout: Center title + Right menu button
    return (
      <>
        <Typography
          variant='h5'
          fontWeight='bold'
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '60%',
          }}
        >
          Reports
        </Typography>
        <Box sx={{ ml: 'auto' }}>
          <IconButton onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {/* View Selection */}
          {VIEWS.map((_view) => (
            <MenuItem
              key={_view}
              onClick={() => handleViewChange(_view)}
              selected={view === _view}
            >
              <Typography variant='body2'>{startCase(_view)}</Typography>
            </MenuItem>
          ))}
          <Divider />
          {/* Month/Year Switch */}
          {TYPES.map((_type) => (
            <MenuItem
              key={_type}
              onClick={() => handleTypeChange(_type)}
              selected={type === _type}
            >
              <Typography variant='body2'>{startCase(_type)}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // Desktop Layout: Original layout
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
