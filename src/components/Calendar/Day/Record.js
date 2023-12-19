import React from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';

export default function Record({ data }) {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleClick = () => {
    let id;
    if (data._type === 'expense') {
      id = data.expense_id;
    } else if (data._type === 'income') {
      id = data.income_id;
    }
    dispatch(openDialog({ type: data._type, mode: 'edit', id }));
  };

  const [value, color] = (() => {
    if (data._type === 'expense') {
      if (!get(data, 'pending', false)) {
        return [numberToCurrency.format(data.amount), theme.palette.red[600]];
      } else {
        return [numberToCurrency.format(data.amount), theme.palette.red[300]];
      }
    } else {
      return [numberToCurrency.format(data.amount), theme.palette.green[500]];
    }
  })();

  const renderTooltip = () => {
    let tooltipContent = [];

    if (data._type === 'expense' || data._type === 'income') {
      tooltipContent.push(
        <Typography key={`tooltip-amount-${data.id}`}>
          amount: {numberToCurrency.format(data.amount)}
        </Typography>
      );

      if (data._type === 'expense') {
        tooltipContent.push(
          <Typography key={`tooltip-vendor-${data.id}`}>
            vendor: {data.vendor}
          </Typography>
        );
      }
    }

    if (data._type === 'income') {
      tooltipContent.push(
        <Typography key={`tooltip-source-${data.id}`}>
          Source: {data.source}
        </Typography>
      );
    }

    if (data.description !== '') {
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
          {value}
        </Typography>
      </Box>
    </Tooltip>
  );
}
