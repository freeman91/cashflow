import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import get from 'lodash/get';

import FilterListIcon from '@mui/icons-material/FilterList';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Expenses from './Expenses';
import Incomes from './Incomes';
import Bills from './Bills';

import { BackButton, SettingsButton } from '../Layout/CustomAppBar';
import { setAppBar } from '../../store/appSettings';
import { push } from 'redux-first-history';

export const OPTIONS = {
  expenses: Expenses,
  incomes: Incomes,
  bills: Bills,
};

export default function Search() {
  const location = useLocation();
  const dispatch = useDispatch();

  const defaultOption = Object.keys(OPTIONS)[0];
  const [anchorEl, setAnchorEl] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const [selected, setSelected] = useState(defaultOption);

  const toggleTrigger = useCallback(() => {
    setTrigger(!trigger);
  }, [trigger]);

  useEffect(() => {
    dispatch(
      setAppBar({
        leftAction: <BackButton />,
        rightAction: (
          <Stack spacing={1} direction='row'>
            <Card raised>
              <IconButton onClick={toggleTrigger}>
                <FilterListIcon />
              </IconButton>
            </Card>
            <Card raised>
              <IconButton onClick={handleMenuClick}>
                <MenuIcon />
              </IconButton>
            </Card>
            <SettingsButton />
          </Stack>
        ),
      })
    );
  }, [dispatch, toggleTrigger]);

  useEffect(() => {
    const type = get(location.pathname.split('/'), '2', defaultOption);
    setSelected(type);
  }, [location, defaultOption]);

  const renderTypeTable = () => {
    const Component = OPTIONS[selected];
    return <Component trigger={trigger} toggleTrigger={toggleTrigger} />;
  };

  const handleMenuClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (type) => {
    dispatch(push(`/search/${type}`));
  };

  const open = Boolean(anchorEl);
  const options = Object.keys(OPTIONS);
  const availableOptions = options.filter((option) => option !== selected);
  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Grid container spacing={1} pb={10}>
        <Grid item xs={12}>
          {renderTypeTable()}
        </Grid>
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
                  {option}
                </Typography>
              </MenuItem>
            );
          })}
        </Menu>
      </Grid>
    </Box>
  );
}
