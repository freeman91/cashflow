import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';

function RecordListItem(props) {
  const { label, value } = props;

  return (
    <ListItem disablePadding disableGutters>
      <ListItemText
        primary={label}
        primaryTypographyProps={{ variant: 'body2' }}
        sx={{ m: 0, mr: 1, p: 0 }}
      />
      <ListItemText
        sx={{ p: 0, m: 0 }}
        primary={value}
        primaryTypographyProps={{
          variant: 'body2',
          align: 'right',
          fontWeight: 800,
        }}
      />
    </ListItem>
  );
}

export default function Record({ data }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [value, setValue] = useState(0);
  const [color, setColor] = useState(theme.palette.red[600]);

  useEffect(() => {
    let id;
    if (data._type === 'expense') {
      id = data.expense_id;
    }
    if (data._type === 'repayment') {
      id = data.repayment_id;
    }
    if (data._type === 'paycheck') {
      id = data.paycheck_id;
    } else if (data._type === 'income') {
      id = data.income_id;
    }
    setId(id);
  }, [data]);

  useEffect(() => {
    let value = 0;

    if (data._type === 'expense' || data._type === 'income') {
      value = data.amount;
    }
    if (data._type === 'repayment') {
      value = data.principal + data.interest + (data.escrow ? data.escrow : 0);
    }
    if (data._type === 'paycheck') {
      value = data.take_home;
    }
    setValue(value);
  }, [data]);

  useEffect(() => {
    let color = theme.palette.red[600];
    if (data._type === 'expense' || data._type === 'repayment') {
      if (get(data, 'pending', false)) {
        color = theme.palette.red[300];
      }
    } else {
      color = theme.palette.green[500];
    }
    setColor(color);
  }, [data, theme.palette]);

  const handleClick = () => {
    dispatch(openDialog({ type: data._type, mode: 'edit', id }));
  };

  return (
    <Tooltip
      title={
        <List sx={{ p: 0 }}>
          <RecordListItem
            label='amount'
            value={numberToCurrency.format(value)}
          />
          {data?.vendor && (
            <RecordListItem label='vendor' value={data.vendor} />
          )}
          {data?.lender && (
            <RecordListItem label='lender' value={data.lender} />
          )}
          {data?.source && (
            <RecordListItem label='source' value={data.source} />
          )}
          {data?.employer && (
            <RecordListItem label='employer' value={data.employer} />
          )}
          {data?.category && (
            <RecordListItem label='category' value={data.category} />
          )}
          {data?.description && (
            <RecordListItem label='description' value={data.description} />
          )}
        </List>
      }
      onClick={handleClick}
      placement='right'
    >
      <Box
        bgcolor={color}
        height='1rem'
        borderRadius='3px'
        mt='.25rem'
        mr='.25rem'
        ml='.25rem'
      >
        <Typography align='center' variant='body2' sx={{ lineHeight: '1rem' }}>
          {numberToCurrency.format(value)}
        </Typography>
      </Box>
    </Tooltip>
  );
}
