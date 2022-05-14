import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';

import { numberToCurrency } from '../../../helpers/currency';

export default function Record({ data }) {
  const theme = useTheme();

  const [value, color] = (() => {
    if (data.category === 'hour') {
      return [`${data.amount} hours`, theme.palette.blue[500]];
    } else if (data.category === 'expense') {
      return [numberToCurrency.format(data.amount), theme.palette.red[500]];
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

    if (data.category === 'hour' || data.category === 'income') {
      if (data.category === 'hour') {
        tooltipContent.push(
          <Typography key={`tooltip-amount-${data.id}`}>
            Amount: {`${data.amount} hours`}
          </Typography>
        );
      }
      tooltipContent.push(
        <Typography key={`tooltip-source-${data.id}`}>
          Source: {data.source}
        </Typography>
      );
    }

    return tooltipContent;
  };

  return (
    <Tooltip title={renderTooltip()}>
      <Box
        bgcolor={color}
        height={'1rem'}
        ml={'.25rem'}
        mr={'.25rem'}
        mb={'.25rem'}
        borderRadius={'3px'}
      >
        <Typography variant='body2'>{value}</Typography>
      </Box>
    </Tooltip>
  );
}
