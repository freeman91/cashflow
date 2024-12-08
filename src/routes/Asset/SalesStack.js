import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import dayjs from 'dayjs';

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
        px: 2,
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
          <BoxFlexCenter>
            <Typography variant='h6' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {_numberToCurrency.format(sale.price)}
            </Typography>
          </BoxFlexCenter>
          <Typography variant='body2' color='text.secondary'>
            price
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography
            variant='h6'
            fontWeight='bold'
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical',
            }}
          >
            {sale.shares}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            shares
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='text.secondary'>
            {dayjs(sale.date).format('MMM D')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h5' fontWeight='bold'>
              {_numberToCurrency.format(sale.amount + sale.fee)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};

export default function SalesStack(props) {
  const { assetId } = props;
  const allSales = useSelector((state) => state.sales.data);

  const [sales, setTableData] = useState([]);

  useEffect(() => {
    let _sales = filter(allSales, { asset_id: assetId });
    setTableData(sortBy(_sales, 'date').reverse());
  }, [allSales, assetId]);

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
