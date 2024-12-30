import React from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import useTheme from '@mui/material/styles/useTheme';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../../helpers/currency';
import {
  findAmount,
  findColor,
  findIcon,
  findId,
  findSource,
} from '../../../../helpers/transactions';
import { openDialog } from '../../../../store/dialogs';

const CustomBox = React.forwardRef((props, ref) => {
  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
        borderRadius: 1,
        border: (theme) => `1px solid ${theme.palette.surface[250]}`,
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function TransactionsTable(props) {
  const { transactions, label = null, showDate = true } = props;
  const theme = useTheme();
  const dispatch = useDispatch();

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
    <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <TableContainer component={CustomBox}>
          {label && (
            <Typography
              sx={{ p: 1, pl: 2 }}
              variant='h5'
              color='text.secondary'
            >
              {label}
            </Typography>
          )}
          <Table>
            <TableBody>
              {transactions.map((transaction, idx) => {
                const prevDate = idx > 0 ? transactions[idx - 1].date : null;
                const type = transaction._type;
                const id = findId(transaction);
                const amount = findAmount(transaction);
                let date = dayjs(transaction.date).format('MMM Do');
                if (
                  prevDate &&
                  dayjs(transaction.date).isSame(prevDate, 'day')
                ) {
                  date = '';
                }

                const category =
                  transaction.category || findSource(transaction);
                const Icon = findIcon(type, transaction?.pending);

                return (
                  <TableRow
                    key={id}
                    sx={{
                      borderColor: (theme) => theme.palette.surface[250],
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                    onClick={() => openTransaction(transaction)}
                  >
                    {showDate && (
                      <TableCell
                        component='th'
                        scope='row'
                        sx={{
                          width: '15%',
                          borderBottom: (theme) =>
                            `1px solid ${theme.palette.surface[250]}`,
                          fontSize: '1rem',
                        }}
                      >
                        {date}
                      </TableCell>
                    )}
                    <TableCell
                      align='left'
                      sx={{
                        width: '15%',
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.surface[250]}`,
                      }}
                    >
                      <Tooltip title={type} placement='top'>
                        <Icon sx={{ color: findColor(type, theme) }} />
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        width: '20%',
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.surface[250]}`,
                        fontSize: '1rem',
                      }}
                    >
                      {numberToCurrency.format(amount)}
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        width: '20%',
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.surface[250]}`,
                        fontSize: '1rem',
                      }}
                    >
                      {category}
                    </TableCell>
                    <TableCell
                      align='right'
                      sx={{
                        width: '20%',
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.surface[250]}`,
                        fontSize: '1rem',
                      }}
                    >
                      {transaction?.subcategory}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Grid>
  );
}
