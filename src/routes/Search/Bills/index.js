import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openDialog } from '../../../store/dialogs';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { CustomTableCell } from '../../../components/Table/CustomTableCell';
import { numberToCurrency } from '../../../helpers/currency';

export default function Bills(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));

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
    <Card raised sx={{ m: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <TableContainer component={'div'}>
          <Table>
            <TableHead>
              <TableRow key='headers'>
                <TableCell
                  sx={{
                    p: 1,
                    pl: 1,
                    pb: 0,
                    width: greaterThanSM ? '15%' : '20%',
                  }}
                >
                  day
                </TableCell>
                <TableCell
                  sx={{ p: 1, pb: 0, width: greaterThanSM ? '30%' : '33%' }}
                >
                  vendor
                </TableCell>
                {greaterThanSM && (
                  <TableCell sx={{ p: 1, pb: 0 }}>category</TableCell>
                )}
                <TableCell sx={{ p: 1, pr: 2, pb: 0 }} align='right'>
                  amount
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
                    <CustomTableCell
                      idx={idx}
                      column='day'
                      sx={{ width: greaterThanSM ? '15%' : '20%' }}
                    >
                      {sameDateAsPrevious ? '' : bill.day}
                    </CustomTableCell>
                    <CustomTableCell
                      idx={idx}
                      sx={{ width: greaterThanSM ? '30%' : '33%' }}
                    >
                      {bill.vendor}
                    </CustomTableCell>
                    {greaterThanSM && (
                      <CustomTableCell idx={idx}>
                        {bill.category}
                      </CustomTableCell>
                    )}
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(bill.amount)}
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
