import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

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

const PurchaseBox = (props) => {
  const { purchase } = props;
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({
        type: purchase._type,
        mode: 'edit',
        id: purchase.purchase_id,
        attrs: purchase,
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
            {dayjs(purchase.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter justifyContent='flex-start'>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {numberToCurrency(purchase.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='body2' color='text.secondary'>
              $
            </Typography>
            <Typography variant='body1' fontWeight='bold'>
              {numberToCurrency(purchase.price)}
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
            {numberToCurrency(purchase.shares)}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            shares
          </Typography>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function PurchasesStack(props) {
  const { assetId } = props;
  const allPurchases = useSelector((state) => state.purchases.data);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    let _purchases = filter(allPurchases, { asset_id: assetId });
    setPurchases(sortBy(_purchases, 'date').reverse());
  }, [allPurchases, assetId]);

  return (
    <Card sx={{ width: '100%', mx: 1 }}>
      <Stack spacing={1} direction='column' pt={1} pb={1}>
        {map(purchases, (purchase, idx) => {
          return (
            <React.Fragment key={purchase.purchase_id}>
              <PurchaseBox purchase={purchase} />
              {idx < purchases.length - 1 && (
                <Divider sx={{ mx: '8px !important' }} />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Card>
  );
}
