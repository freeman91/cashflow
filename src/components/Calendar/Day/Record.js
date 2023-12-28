import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';

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
      if (!get(data, 'pending', false)) {
        color = [numberToCurrency.format(data.amount), theme.palette.red[600]];
      } else {
        color = [numberToCurrency.format(data.amount), theme.palette.red[300]];
      }
    } else {
      color = [numberToCurrency.format(data.amount), theme.palette.green[500]];
    }
    setColor(color);
  }, [data, theme.palette]);

  const handleClick = () => {
    dispatch(openDialog({ type: data._type, mode: 'edit', id }));
  };

  const renderTooltip = () => {
    let tooltipContent = [
      <Typography key={`tooltip-amount-${data.id}`}>
        amount: {numberToCurrency.format(value)}
      </Typography>,
    ];

    if (data._type === 'expense' && data.vendor !== '') {
      tooltipContent.push(
        <Typography key={`tooltip-vendor-${data.id}`}>
          vendor: {data.vendor}
        </Typography>
      );
    }

    if (data._type === 'repayment') {
      tooltipContent.push(
        <Typography key={`tooltip-lender-${data.id}`}>
          lender: {data.lender}
        </Typography>
      );
    }

    if (data._type === 'income') {
      tooltipContent.push(
        <Typography key={`tooltip-source-${data.id}`}>
          source: {data.source}
        </Typography>
      );
    }

    if (data._type === 'paycheck') {
      tooltipContent.push(
        <Typography key={`tooltip-employer-${data.id}`}>
          employer: {data.employer}
        </Typography>
      );
    }

    if (data.description && data.description !== '') {
      tooltipContent.push(
        <Typography key={`tooltip-description-${data.id}`}>
          description: {data.description}
        </Typography>
      );
    }

    return tooltipContent;
  };

  return (
    <Tooltip
      title={renderTooltip()}
      onClick={handleClick}
      placement='right-start'
    >
      <Box
        bgcolor={color}
        height='1rem'
        borderRadius='3px'
        mt='.25rem'
        mr='.25rem'
        ml='.25rem'
      >
        <Typography variant='body2' sx={{ lineHeight: '1rem' }}>
          {numberToCurrency.format(value)}
        </Typography>
      </Box>
    </Tooltip>
  );
}
