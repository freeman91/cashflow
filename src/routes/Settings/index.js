import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import includes from 'lodash/includes';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';
import OptionsList from './OptionsList';
import CategoryList from './CategoryList';
import PaycheckSettings from './PaycheckSettings';

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
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
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

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: (
          <Card raised>
            <IconButton onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
          </Card>
        ),
      })
    );
  }, [dispatch]);

  const toggleTrigger = () => {
    setTrigger(!trigger);
    if (!trigger) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type) => {
    dispatch(push(`/settings/${type}`));
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

    if (selected === 'paycheck') {
      return <PaycheckSettings />;
    }

    return null;
  };

  const open = Boolean(anchorEl);
  const options = Object.keys(OPTIONS);
  const availableOptions = options.filter((option) => option !== selected);
  return (
    <Box sx={{ px: 1 }}>
      <Typography variant='h5' align='center' fontWeight='bold' sx={{ mb: 1 }}>
        {selected.replace('_', ' ')}
      </Typography>
      <Card raised sx={{ mb: 10, borderRadius: '10px' }}>
        {renderOptionComponent()}
      </Card>
      <Menu
        anchorEl={anchorEl}
        id='type-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{ sx: { p: 0 } }}
        transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        sx={{
          '& .MuiMenu-paper': {
            backgroundColor: 'unset',
            backgroundImage: 'unset',
            boxShadow: 'unset',
          },
        }}
      >
        {availableOptions.map((option) => {
          return (
            <MenuItem
              key={option}
              onClick={() => handleClick(option)}
              sx={{
                my: 1,
                p: '12px',
                borderRadius: 1,
                backgroundColor: 'surface.300',
              }}
            >
              <Typography
                variant='h5'
                align='center'
                sx={{ width: '100%' }}
                fontWeight='bold'
              >
                {option.replace('_', ' ')}
              </Typography>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
