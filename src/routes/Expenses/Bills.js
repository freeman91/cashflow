import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

import NewTransactionButton from '../../components/NewTransactionButton';

export default function Bills() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const bills = useSelector((state) => state.bills.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(sortBy(bills, 'day'));
  }, [bills]);

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
    <>
      <Card
        raised
        sx={{
          maxWidth: theme.breakpoints.maxWidth,
          mt: 2,
        }}
      >
        <CardContent
          sx={{
            p: 1,
            pt: 0,
            pb: '4px !important',
          }}
        >
          <TableContainer component='div'>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align='right'>vendor</TableCell>
                  <TableCell align='right'>amount</TableCell>
                  <TableCell align='right'>day</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {map(tableData, (bill, idx) => {
                  return (
                    <TableRow
                      hover={true}
                      key={bill.bill_id}
                      onClick={() => handleClick(bill)}
                    >
                      <CustomTableCell idx={idx}>{bill.name}</CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {bill.vendor}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(bill.amount)}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {bill.day}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <NewTransactionButton transactionTypes={['bill']} />
    </>
  );
}
