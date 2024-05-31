import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function SalesTable(props) {
  const { assetId } = props;
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.sales.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _sales = filter(sales, { asset_id: assetId });
    setTableData(sortBy(_sales, 'date'));
  }, [sales, assetId]);

  const handleClick = (sale) => {
    dispatch(
      openDialog({
        type: sale._type,
        mode: 'edit',
        id: sale.sale_id,
        attrs: sale,
      })
    );
  };

  return (
    <TableContainer component='div'>
      <Table size='medium'>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 800 }}>date</TableCell>
            <TableCell sx={{ fontWeight: 800 }} align='right'>
              total payment
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }} align='right'>
              amount
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }} align='right'>
              shares
            </TableCell>
            <TableCell sx={{ fontWeight: 800 }} align='right'>
              price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(tableData, (sale, idx) => {
            return (
              <TableRow
                hover={true}
                key={sale.sale_id}
                onClick={() => handleClick(sale)}
              >
                <CustomTableCell idx={idx} component='th' column='date'>
                  {dayjs(sale.date).format('YYYY MMMM D')}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(sale.amount)}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(sale.amount)}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {sale.shares}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(sale.price)}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
