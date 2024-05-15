import React from 'react';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';
import TablePaginationActions, {
  rowsPerPage,
} from '../../components/Table/TablePaginationActions';
import { Typography } from '@mui/material';

export default function MonthTable(props) {
  const { title, total, items } = props;
  const [page, setPage] = React.useState(0);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  return (
    <Card raised sx={{ minWidth: '45%' }}>
      <CardHeader
        sx={{ pt: 1, pb: 1, pl: 4, pr: 4 }}
        title={
          <Stack direction='row'>
            <Typography variant='h6'>{title}</Typography>
            <Typography sx={{ fontWeight: 800, ml: 'auto' }}>
              {numberToCurrency.format(total)}
            </Typography>
          </Stack>
        }
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer sx={{ width: '100%' }} component='div'>
          <Table size='small'>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ fontWeight: 800 }}>name</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  value
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(
                items.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                ),
                (item, idx) => {
                  return (
                    <TableRow key={`${title}-item-${idx}`}>
                      <CustomTableCell idx={idx} column='name'>
                        {item.name}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(item.value)}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {item.category}
                      </CustomTableCell>
                    </TableRow>
                  );
                }
              )}
            </TableBody>
            {items.length > 10 && (
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    colSpan={6}
                    count={items.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    slotProps={{ select: { native: true } }}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
