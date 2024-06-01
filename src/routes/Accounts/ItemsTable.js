import React from 'react';
import { useDispatch } from 'react-redux';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { openDialog } from '../../store/dialogs';
import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function ItemsTable(props) {
  const { items } = props;
  const dispatch = useDispatch();

  const handleRowClick = (item) => {
    dispatch(
      openDialog({
        type: item._type,
        mode: 'edit',
        id: item[item._type + '_id'],
      })
    );
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
