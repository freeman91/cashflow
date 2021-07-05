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

export default function TableComponent({ title, data, handleClick, attrs }) {
  const classes = useStyles();

  const renderTableRows = () => {
    return data.map((row, i) => {
      return (
        <TableRow key={`table-row-${i}`} onClick={() => handleClick(row)} hover>
          {attrs.map((attr, j) => {
            if (attr === 'date') {
              return (
                <TableCell
                  key={`table-row-${i}-cell${j}`}
                  component='th'
                  scope='row'
                  className={classes.cell}
                >
                  <Typography>{row.displayDate}</Typography>
                </TableCell>
              );
            } else if (attr === 'category') {
              return (
                <TableCell
                  key={`table-row-${i}-cell${j}`}
                  align='left'
                  className={classes.cell}
                >
                  <Typography>{row.category}</Typography>
                </TableCell>
              );
            } else if (attr === 'amount') {
              return (
                <TableCell
                  key={`table-row-${i}-cell${j}`}
                  align='right'
                  className={classes.cell}
                >
                  <Typography>
                    {row.category === 'hour'
                      ? row.amount
                      : numberToCurrency.format(row.amount)}
                  </Typography>
                </TableCell>
              );
            } else if (attr === 'source') {
              return (
                <TableCell
                  key={`table-row-${i}-cell${j}`}
                  align='right'
                  className={classes.cell}
                >
                  <Typography>{row.vendor || row.source}</Typography>
                </TableCell>
              );
            } else if (attr === 'name') {
              return (
                <TableCell
                  key={`table-row-${i}-cell${j}`}
                  align='center'
                  className={classes.cell}
                >
                  <Typography>{row.name}</Typography>
                </TableCell>
              );
            } else return null;
          })}
        </TableRow>
      );
    });
  };

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
              {data.length > 0 ? (
                <TableBody>{renderTableRows()}</TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell align='center'>
                      <Typography>No Data</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      </CardContent>
    </Card>
  );
}
