import React, { useEffect } from 'react';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Paper,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
  Toolbar,
  Typography,
} from '@material-ui/core';

import { numberToCurrency } from '../helpers/currency';

const useStyles = makeStyles((theme) => ({
  header: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: theme.palette.grey[700],
    minHeight: `50px`,
    textAlign: 'left',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
}));

function createData(category, date, amount, type, vendor) {
  return { category, date, amount, type, vendor };
}

const rows = [
  createData('expense', '06/24/2021', 9.15, 'food', 'Chipotle'),
  createData('expense', '06/25/2021', 77.34, 'grocery', 'Kroger'),
  createData('income', '06/25/2021', 1848.36, 'paycheck', 'DES'),
  createData('hour', '06/25/2021', 5, '', 'DES'),
];

export default function TableComponent({ title, data }) {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <Card className={classes.container}>
      <Toolbar className={classes.toolbar}>
        <Typography variant='h6' color='inherit' className={classes.header}>
          {title}
        </Typography>
      </Toolbar>
      <CardContent>
        <div className={classes.root}>
          <TableContainer component={Paper}>
            <Table size='medium'>
              <TableBody>
                {data.map((row) => {
                  return (
                    <TableRow key={`${row.category}-${row.date}-${row.amount}`}>
                      <TableCell component='th' scope='row'>
                        <Typography>{row.displayDate}</Typography>
                      </TableCell>
                      <TableCell align='left'>
                        <Typography>{row.category}</Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography>
                          {row.category === 'hour'
                            ? row.amount
                            : numberToCurrency.format(row.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align='right'>
                        <Typography>{row.vendor || row.source}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  );
}
