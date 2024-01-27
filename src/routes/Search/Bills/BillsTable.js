import React from 'react';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../../helpers/currency';
import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';

export default function BillsTable(props) {
  const { bills } = props;
  const dispatch = useDispatch();

  const handleClick = (bill) => {
    dispatch(
      openDialog({
        type: bill._type,
        mode: 'edit',
        id: bill.bill_id,
        attrs: bill,
      })
    );
  };

  return (
    <Card raised>
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          sx={{
            maxWidth: 1000,
          }}
          component={'div'}
        >
          <Table size='small'>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ fontWeight: 800 }}>day</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  amount
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  vendor
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(bills, (bill, idx) => {
                return (
                  <TableRow
                    key={bill.bill_id || bill.repayment_id}
                    hover={true}
                    onClick={() => handleClick(bill)}
                  >
                    <CustomTableCell idx={idx} column='day'>
                      {bill.day}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(bill.amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {bill.category}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {bill.vendor}
                    </CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
