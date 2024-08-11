import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
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
  const theme = useTheme();
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
        position: 'relative',
        background: `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[250]})`,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        p: '4px',
        mt: 1,
        pr: 2,
        border: `2px solid ${theme.palette.surface[500]}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ml: 1,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <Typography variant='body2' color='grey.0'>
            {dayjs(purchase.date).format('MMM D, YYYY')}
          </Typography>
          <BoxFlexCenter justifyContent='flex-start'>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {numberToCurrency(purchase.amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='h6' color='grey.0'>
              $
            </Typography>
            <Typography variant='h6' color='grey.0' fontWeight='bold'>
              {numberToCurrency(purchase.price)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='grey.0'>
            price
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            color='grey.0'
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
          <Typography variant='body2' color='grey.0'>
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

  return map(purchases, (purchase) => {
    return <PurchaseBox key={purchase.purchase_id} purchase={purchase} />;
  });
}
