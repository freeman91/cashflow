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

export default function PurchasesTable(props) {
  const { assetId } = props;
  const dispatch = useDispatch();
  const purchases = useSelector((state) => state.purchases.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _purchases = filter(purchases, { asset_id: assetId });
    setTableData(sortBy(_purchases, 'date').reverse());
  }, [purchases, assetId]);

  const handleClick = (purchase) => {
    dispatch(
      openDialog({
        type: purchase._type,
        mode: 'edit',
        id: purchase.purchase_id,
        attrs: purchase,
      })
    );
  };

  return (
    <TableContainer component='div'>
      <Table size='medium'>
        <TableHead>
          <TableRow>
            <TableCell sx={{ p: 1, pl: 2, pb: 0 }}>date</TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              amount
            </TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              shares
            </TableCell>
            <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
              price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(tableData, (purchase, idx) => {
            return (
              <TableRow
                hover={true}
                key={purchase.purchase_id}
                onClick={() => handleClick(purchase)}
              >
                <CustomTableCell idx={idx} component='th' column='date'>
                  {dayjs(purchase.date).format('YYYY MMM D')}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(purchase.amount)}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {purchase.shares}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(purchase.price)}
                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
