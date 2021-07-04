import React from 'react';
import { makeStyles } from '@material-ui/styles';
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

const useStyles = makeStyles(() => ({
  header: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: '#616161',
    minHeight: `50px`,
    textAlign: 'left',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cell: {
    width: '8rem',
  },
}));

export default function TableComponent({ title, data }) {
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
                {data.map((row, i) => {
                  return (
                    <TableRow
                      key={`${row.category}-${row.date}-${row.amount}-${i}`}
                      onClick={() => console.log(row)}
                      hover
                    >
                      <TableCell
                        component='th'
                        scope='row'
                        className={classes.cell}
                      >
                        <Typography>{row.displayDate}</Typography>
                      </TableCell>
                      <TableCell align='left' className={classes.cell}>
                        <Typography>{row.category}</Typography>
                      </TableCell>
                      <TableCell align='right' className={classes.cell}>
                        <Typography>
                          {row.category === 'hour'
                            ? row.amount
                            : numberToCurrency.format(row.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align='right' className={classes.cell}>
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
