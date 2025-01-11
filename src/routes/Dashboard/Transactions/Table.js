import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import { alpha } from '@mui/material/styles';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../../store/dialogs';
import { numberToCurrency } from '../../../helpers/currency';
import { findAmount, findId, findSource } from '../../../helpers/transactions';

export default function TransactionsTable(props) {
  const { transactions } = props;
  const dispatch = useDispatch();

  const [data, setData] = useState([]);

  useEffect(() => {
    let days = [];
    transactions.forEach((transaction) => {
      const date = dayjs(transaction.date).format('MMMM Do, YYYY');
      const existing = find(days, { date });
      if (!existing) {
        days.push({ date, transactions: [transaction] });
      } else {
        existing.transactions.push(transaction);
      }
    });
    days = map(days, (day) => {
      let transactions = map(day.transactions, (transaction) => {
        return transaction;
      });
      return {
        ...day,
        transactions,
        sum: reduce(
          transactions,
          (sum, transaction) => {
            let amount = findAmount(transaction);
            if (
              ['expense', 'repayment', 'purchase'].includes(transaction._type)
            ) {
              amount = -amount;
            }
            return sum + amount;
          },
          0
        ),
      };
    });
    setData(days);
  }, [transactions]);

  const openTransaction = (transaction) => {
    dispatch(
      openDialog({
        type: transaction._type,
        mode: 'edit',
        id: findId(transaction),
        attrs: transaction,
      })
    );
  };

  if (transactions.length === 0) {
    return null;
  }

  return (
    (<List disablePadding>
      {data.map((day, idx) => {
        return (
          (<React.Fragment key={idx}>
            <ListItem key={idx} sx={{ backgroundColor: 'surface.300' }}>
              <ListItemText primary={day.date} />
              {day.transactions.length > 1 && (
                <ListItemText
                  primary={numberToCurrency.format(day.sum)}
                  slotProps={{
                    primary: { align: 'right' }
                  }}
                />
              )}
            </ListItem>
            {day.transactions.map((transaction, idx) => {
              let amount = findAmount(transaction);
              if (
                ['expense', 'repayment', 'purchase'].includes(transaction._type)
              ) {
                amount = -amount;
              }
              return (
                (<ListItemButton
                  disableGutters
                  key={idx}
                  onClick={() => openTransaction(transaction)}
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.05),
                    },
                    borderRadius: 1,
                    mx: 0.5,
                    px: 1.5,
                    py: 0.5,
                    my: 0.5,
                  }}
                >
                  <ListItemText
                    primary={findSource(transaction)}
                    sx={{ width: '40%' }}
                    slotProps={{
                      primary: {
                        sx: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }
                    }}
                  />
                  <ListItemText
                    primary={transaction._type}
                    sx={{ width: '20%' }}
                    slotProps={{
                      primary: { align: 'left' }
                    }}
                  />
                  <ListItem
                    sx={{
                      width: '30%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      flexDirection: 'row',
                    }}
                  >
                    {transaction?.pending && (
                      <Tooltip title='Pending' placement='top'>
                        <Box
                          sx={{
                            width: '10px',
                            height: '10px',
                            backgroundColor: 'warning.main',
                            borderRadius: '50%',
                            mr: 1,
                          }}
                        />
                      </Tooltip>
                    )}
                    <Typography variant='body1'>
                      {numberToCurrency.format(amount)}
                    </Typography>
                  </ListItem>
                  <ListItemIcon sx={{ minWidth: 'unset' }}>
                    <ChevronRight />
                  </ListItemIcon>
                </ListItemButton>)
              );
            })}
          </React.Fragment>)
        );
      })}
    </List>)
  );
}
