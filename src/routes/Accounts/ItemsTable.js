import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function ItemsTable(props) {
  const { items } = props;
  const theme = useTheme();
  const dispatch = useDispatch();
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));

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
                <CustomTableCell idx={idx} component='th' sx={{ p: 1 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        openDialog({
                          type: item._type,
                          mode: 'edit',
                          id: item[`${item._type}_id`],
                        })
                      );
                    }}
                  >
                    <EditIcon sx={{ hieght: 25, width: 25 }} />
                  </IconButton>
                </CustomTableCell>
                <CustomTableCell idx={idx} component='th'>
                  {name}
                </CustomTableCell>
                {greaterThanSM && (
                  <CustomTableCell idx={idx} component='th'>
                    {item.category}
                  </CustomTableCell>
                )}
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
