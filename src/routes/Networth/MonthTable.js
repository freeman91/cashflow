import React from 'react';
import map from 'lodash/map';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function MonthTable(props) {
  const { title, items } = props;

  return (
    <TableContainer sx={{ width: '45%' }} component='div'>
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
          {map(items, (item, idx) => {
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
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
