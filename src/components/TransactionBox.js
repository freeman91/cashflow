import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  findAmount,
  findCategory,
  findColor,
  findIcon,
  findSource,
} from '../helpers/transactions';
import { openDialog } from '../store/dialogs';
import { _numberToCurrency } from '../helpers/currency';
import BoxFlexCenter from './BoxFlexCenter';
import BoxFlexColumn from './BoxFlexColumn';
import CustomIconButton from './CustomIconButton';

const TransactionBox = (props) => {
  const { transaction } = props;
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.data);

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: transaction[`${transaction._type}_id`],
        attrs: transaction,
      })
    );
  };

  const amount = findAmount(transaction);
  const source = findSource(transaction, bills);
  const category = findCategory(transaction);
  const subcategory = transaction?.subcategory;
  const color = findColor(transaction);
  const icon = findIcon(transaction);

  return (
    <Box
      onClick={() => handleClick(transaction)}
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
          mr: 1,
        }}
      >
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
            {dayjs(transaction.date).format('MMM D')}
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
      </Box>
      <CustomIconButton color={color}>{icon}</CustomIconButton>
    </Box>
  );
};

export default TransactionBox;
