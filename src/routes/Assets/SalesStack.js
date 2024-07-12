import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import dayjs from 'dayjs';

const SaleBox = (props) => {
  const { sale } = props;
  const theme = useTheme();
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
          ml: 2,
        }}
      >
        <BoxFlexColumn alignItems='space-between'>
          <BoxFlexCenter>
            <Typography variant='h6' color='grey.0'>
              $
            </Typography>
            <Typography variant='h6' color='grey.0' fontWeight='bold'>
              {/* {_numberToCurrency.format(sale.price)} */}
              {sale.price}
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
            {sale.shares}
          </Typography>
          <Typography variant='body2' color='grey.0'>
            shares
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {dayjs(sale.date).format('MMM D')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(sale.amount)}
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

  return map(sales, (sale) => {
    return <SaleBox key={sale.sale_id} sale={sale} />;
  });
}
