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
    dispatch(openDialog({ mode: 'update', attrs: data }));
  };

  const [value, color] = (() => {
    if (data.category === 'expense') {
      if (get(data, 'paid', true)) {
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

    if (data.category === 'expense' || data.category === 'income') {
      tooltipContent.push(
        <Typography key={`tooltip-amount-${data.id}`}>
          Amount: {numberToCurrency.format(data.amount)}
        </Typography>
      );
      tooltipContent.push(
        <Typography key={`tooltip-type-${data.id}`}>
          Type: {data.type}
        </Typography>
      );

      if (data.category === 'expense') {
        tooltipContent.push(
          <Typography key={`tooltip-vendor-${data.id}`}>
            Vendor: {data.vendor}
          </Typography>
        );
      }
    }

    if (data.category === 'income') {
      tooltipContent.push(
        <Typography key={`tooltip-source-${data.id}`}>
          Source: {data.source}
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
