import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { alpha } from '@mui/material/styles';
import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { openDialog } from '../../store/dialogs';
import { findAmount, findColor, findSource } from '../../helpers/transactions';
import { numberToCurrency } from '../../helpers/currency';

export default function Day({ month, date, transactions }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isToday = dayjs().isSame(date, 'day');

  const handleClick = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        attrs: transaction,
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
        height: 150,
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
          top: 4,
          right: 4,
          mr: 1,
        }}
        fontWeight={isToday ? 'bold' : 'regular'}
      >
        {date.date() === 1 ? date.format('MMM D') : date.date()}
      </Typography>
      <Stack
        direction='column'
        justifyContent='flex-start'
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          marginTop: 4,
          gap: 0.25,
        }}
      >
        {transactions.map((transaction, idx) => {
          const color = findColor(transaction._type, theme);
          const merchant = findSource(transaction);
          const amount = findAmount(transaction);

          return (
            <Box
              key={idx}
              onClick={() => handleClick(transaction)}
              sx={{
                backgroundColor: alpha(color, 0.5),
                width: '100%',
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundImage: `linear-gradient(to bottom, ${color}, ${theme.palette.surface[300]})`,
                },
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
                }}
              >
                {merchant}
              </Typography>
              <Typography
                variant='caption'
                color='textSecondary'
                align='right'
                sx={{ display: 'flex', alignItems: 'center' }}
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
                {numberToCurrency.format(amount)}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
