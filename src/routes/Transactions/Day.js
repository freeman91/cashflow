import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { alpha } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

import { openItemView } from '../../store/itemView';
import { findAmount, findColor, findSource } from '../../helpers/transactions';
import { numberToCurrency } from '../../helpers/currency';

export default function Day(props) {
  const { month, date, transactions } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const isToday = dayjs().isSame(date, 'day');

  const handleClick = (transaction) => {
    dispatch(
      openItemView({
        itemType: transaction._type,
        mode: 'edit',
        attrs: transaction,
      })
    );
  };

  const showAll = (transactions) => {
    dispatch(
      openItemView({
        itemType: 'transactions',
        mode: 'view',
        attrs: {
          date,
          transactions,
        },
      })
    );
  };

  const dateColor = (() => {
    if (isToday) return theme.palette.primary.main;
    if (date.isSame(month, 'month')) return theme.palette.text.primary;
    return theme.palette.surface[400];
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? 140 : 155,
        py: 0.5,
        px: 0.25,
        position: 'relative',
        width: '100%',
      }}
    >
      <Typography
        align='center'
        variant='h6'
        sx={{
          color: dateColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          right: 4,
          mr: 1,
        }}
        fontWeight={isToday ? 'bold' : 'regular'}
      >
        {date.date() === 1
          ? date.format(isMobile ? 'M/D' : 'MMM Do')
          : date.date()}
      </Typography>
      <Stack
        direction='column'
        justifyContent='flex-start'
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginTop: 3,
          gap: 0.25,
        }}
      >
        {transactions.map((transaction, idx) => {
          const color = findColor(
            transaction?.item_type || transaction._type,
            theme
          );
          const merchant = findSource(transaction);
          const amount = findAmount(transaction);

          if (idx > 4) return null;
          return (
            <Box
              key={idx}
              onClick={() => handleClick(transaction)}
              sx={{
                backgroundColor: alpha(color, 0.35),
                width: '100%',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundImage: `linear-gradient(to bottom, ${color}, ${theme.palette.surface[300]})`,
                },
                border:
                  transaction._type === 'recurring' ? '1px solid' : 'none',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                px: 0.5,
              }}
            >
              <Typography
                variant='caption'
                color='textSecondary'
                align='left'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {merchant}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {transaction?.pending && (
                  <Tooltip title='Pending' placement='top'>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,
                        backgroundColor: 'warning.main',
                        borderRadius: '50%',
                        mr: 0.25,
                      }}
                    />
                  </Tooltip>
                )}
                <Typography
                  variant='caption'
                  color='textSecondary'
                  align='right'
                >
                  {isMobile
                    ? new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(amount)
                    : numberToCurrency.format(amount)}
                </Typography>
              </Box>
            </Box>
          );
        })}
        {transactions.length > 5 && (
          <Typography
            variant='caption'
            color='textSecondary'
            onClick={() => showAll(transactions)}
            sx={{
              '&:hover': { textDecoration: 'underline' },
              cursor: 'pointer',
            }}
          >
            {transactions.length - 5} more...
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
