import React from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Typography from '@mui/material/Typography';

import {
  findAmount,
  findCategory,
  findSource,
} from '../../helpers/transactions';
import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../BoxFlexCenter';
import BoxFlexColumn from '../BoxFlexColumn';

export default function Transaction(props) {
  const { transaction } = props;
  const bills = useSelector((state) => state.bills.data);

  const amount = findAmount(transaction);
  const source = findSource(transaction, bills);
  const category = findCategory(transaction);
  const subcategory = transaction?.subcategory;

  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='body1'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {source}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {category} {subcategory ? `- ${subcategory}` : ''}
        </Typography>
      </BoxFlexColumn>
      <BoxFlexColumn alignItems='space-between'>
        <Typography align='right' variant='body2' color='text.secondary'>
          {dayjs(transaction.date).format('MMM Do')}
        </Typography>
        <BoxFlexCenter>
          <Typography variant='h6' color='text.secondary'>
            $
          </Typography>
          <Typography variant='h5' color='white' fontWeight='bold'>
            {_numberToCurrency.format(amount)}
          </Typography>
        </BoxFlexCenter>
      </BoxFlexColumn>
    </>
  );
}
