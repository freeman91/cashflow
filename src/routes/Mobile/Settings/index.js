import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'redux-first-history';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import lowerCase from 'lodash/lowerCase';
import map from 'lodash/map';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import BillTemplates from './BillTemplates';
import PaycheckSettings from './PaycheckSettings';
import OptionsList from './OptionsList';
import CategoryList from './CategoryList';
import CustomAppBar from '../../../components/CustomAppBar';

const MERCHANTS = 'merchants';
const EXPENSE_CATEGORIES = 'expense-categories';
const INCOME_SOURCES = 'income-sources';
const INCOME_CATEGORIES = 'income-categories';
const ASSET_CATEGORIES = 'asset-categories';
const PAYCHECK_TEMPLATES = 'paycheck-templates';
const BILL_TEMPLATES = 'bill-templates';

const DETAILS = [
  MERCHANTS,
  EXPENSE_CATEGORIES,
  INCOME_SOURCES,
  INCOME_CATEGORIES,
  ASSET_CATEGORIES,
];
const TEMPLATES = [PAYCHECK_TEMPLATES, BILL_TEMPLATES];

const CustomListItemButton = (props) => {
  const { option, handleClick } = props;
  return (
    <ListItemButton
      onClick={() => handleClick(option)}
      sx={{
        py: 1,
        cursor: 'pointer',
      }}
    >
      <ListItemText
        primary={lowerCase(option)}
        primaryTypographyProps={{ align: 'left' }}
      />
      <ListItemIcon sx={{ minWidth: 'unset' }}>
        <ChevronRightIcon />
      </ListItemIcon>
    </ListItemButton>
  );
};

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
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='center'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        {!selected && (
          <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
            <Card sx={{ width: '100%' }}>
              <List disablePadding sx={{ px: 1, py: 1, bgcolor: 'unset' }}>
                <ListItemText
                  primary='details'
                  sx={{ ml: 2 }}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
                <Divider sx={{ mx: '8px !important' }} />
                {map(DETAILS, (option, idx) => {
                  return (
                    <CustomListItemButton
                      key={`${option}-${idx}`}
                      option={option}
                      handleClick={handleClick}
                    />
                  );
                })}
              </List>
            </Card>
          </Grid>
        )}
        {!selected && (
          <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
            <Card sx={{ width: '100%' }}>
              <List disablePadding sx={{ px: 1, py: 1, bgcolor: 'unset' }}>
                <ListItemText
                  primary='templates'
                  sx={{ ml: 2 }}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
                <Divider sx={{ mx: '8px !important' }} />
                {map(TEMPLATES, (option, idx) => {
                  return (
                    <CustomListItemButton
                      key={`${option}-${idx}`}
                      option={option}
                      handleClick={handleClick}
                    />
                  );
                })}
              </List>
            </Card>
          </Grid>
        )}
        {selected === MERCHANTS && (
          <OptionsList optionType='merchant' placeholder='merchant' />
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
      </Grid>
      <Grid item xs={12} mb={12} />
    </Box>
  );
}
