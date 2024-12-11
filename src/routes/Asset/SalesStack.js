import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

const numberToCurrency = (value) => {
  if (value < 1)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    }).format(value);
  else if (value < 100)
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const SaleBox = (props) => {
  const { sale } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: sale._type,
        mode: 'edit',
        id: sale.sale_id,
        attrs: sale,
      })
    );
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 1,
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography variant='body2' color='text.secondary'>
            {dayjs(sale.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter justifyContent='flex-start'>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {numberToCurrency(sale.amount + sale.fee)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='body2' color='text.secondary'>
              $
            </Typography>
            <Typography variant='body1' fontWeight='bold'>
              {numberToCurrency(sale.price)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='text.secondary'>
            price
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='body1'
            fontWeight='bold'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {numberToCurrency(sale.shares)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            shares
          </Typography>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function SalesStack(props) {
  const { sales } = props;

  return (
    <Card sx={{ width: '100%', mx: 1 }}>
      <Stack spacing={1} direction='column' pt={1} pb={1}>
        {map(sales, (sale, idx) => {
          return (
            <React.Fragment key={sale.sale_id}>
              <SaleBox sale={sale} />
              {idx < sales.length - 1 && (
                <Divider sx={{ mx: '8px !important' }} />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
