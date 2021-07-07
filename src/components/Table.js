import React, { useState } from 'react';
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
  TablePagination,
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

export default function TableComponent({
  title,
  data,
  handleClick,
  attrs,
  paginate,
  size,
  rowsPerPage,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const _rowsPerPage = rowsPerPage ? rowsPerPage : 15;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const renderTableRows = () => {
    return data
      .slice(0 + page * _rowsPerPage, (page + 1) * _rowsPerPage)
      .map((row, i) => {
        return (
          <TableRow
            key={`table-row-${i}`}
            onClick={() => handleClick(row)}
            hover
          >
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
                    align='left'
                    className={classes.cell}
                  >
                    <Typography>{row.name}</Typography>
                  </TableCell>
                );
              } else if (attr === 'value') {
                return (
                  <TableCell
                    key={`table-row-${i}-cell${j}`}
                    align='left'
                    className={classes.cell}
                  >
                    <Typography>
                      {numberToCurrency.format(row.value)}
                    </Typography>
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
            <Table size={size ? size : 'medium'}>
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
          {paginate ? (
            <TablePagination
              component='div'
              count={data.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={_rowsPerPage ? _rowsPerPage : 15}
              rowsPerPageOptions={[_rowsPerPage]}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
