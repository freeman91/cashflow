import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
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

export const TransactionBox = (props) => {
  const { transaction } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

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
  const source = findSource(transaction);
  const category = findCategory(transaction);
  const color = findColor(transaction);
  const icon = findIcon(transaction);

  const [c1, c2] = color.split('.');
  const themeColor = theme.palette[c1][c2];
  return (
    <Box
      onClick={() => handleClick(transaction)}
      sx={{
        position: 'relative',
        background: `linear-gradient(0deg, ${theme.palette.surface[400]}, ${theme.palette.surface[500]})`,
        zIndex: 1,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        p: '4px',
        mt: 1,
        pr: 2,
        border: `2px solid ${themeColor}`,
      }}
    >
      <CustomIconButton color={theme.palette[c1]}>{icon}</CustomIconButton>
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
            {source}
          </Typography>
          <Typography variant='body2' color='grey.0'>
            {category}
          </Typography>
        </BoxFlexColumn>
        <BoxFlexColumn alignItems='space-between'>
          <Typography align='right' variant='body2' color='grey.0'>
            {dayjs(transaction.date).format('MMM D')}
          </Typography>
          <BoxFlexCenter>
            <Typography variant='h5' color='grey.10'>
              $
            </Typography>
            <Typography variant='h5' color='white' fontWeight='bold'>
              {_numberToCurrency.format(amount)}
            </Typography>
          </BoxFlexCenter>
        </BoxFlexColumn>
      </Box>
    </Box>
  );
};
