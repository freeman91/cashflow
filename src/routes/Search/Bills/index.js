import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../../store/dialogs';
import sortBy from 'lodash/sortBy';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect } from 'react';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';
import { numberToCurrency } from '../../../helpers/currency';

export default function Bills(props) {
  const dispatch = useDispatch();
  const allBills = useSelector((state) => state.bills.data);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    setBills(sortBy(allBills, 'day'));
  }, [allBills]);

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
    <TableContainer component={'div'}>
      <Table>
        <TableHead>
          <TableRow key='headers'>
            <TableCell sx={{ p: 1, pl: 2, pb: 0 }}>day</TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              amount
            </TableCell>
            <TableCell sx={{ p: 1, pb: 0 }} align='right'>
              category
            </TableCell>
            <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
              vendor
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map((bill, idx, array) => {
            const sameDateAsPrevious =
              idx === 0 ? false : bill.day === array[idx - 1].day;
            return (
              <TableRow
                key={bill.bill_id || bill.repayment_id}
                hover={true}
                onClick={() => handleClick(bill)}
              >
                <CustomTableCell idx={idx} column='day'>
                  {sameDateAsPrevious ? '' : bill.day}
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
  );
}
