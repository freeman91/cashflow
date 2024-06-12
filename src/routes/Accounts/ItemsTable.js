import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function ItemsTable(props) {
  const { items } = props;
  const dispatch = useDispatch();

  const handleRowClick = (item) => {
    const page = item._type + 's';
    const id = item[item._type + '_id'];
    dispatch(push(`/${page}/${id}`));
  };

  return (
    <TableContainer component='div'>
      <Table size='medium'>
        <TableBody>
          {items.map((item, idx) => {
            const value = item?.value ? item.value : item.amount;
            const name = item?.name ? item.name : item.vendor;
            return (
              <TableRow
                hover={true}
                key={item[item._type + '_id']}
                onClick={() => handleRowClick(item)}
              >
                <CustomTableCell idx={idx} component='th'>
                  {name}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(value)}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
