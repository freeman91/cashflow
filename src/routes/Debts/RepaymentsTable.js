import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

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

export default function RepaymentsTable(props) {
  const { debtId } = props;
  const dispatch = useDispatch();
  const repayments = useSelector((state) => state.repayments.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _repayments = filter(repayments, { debt_id: debtId });
    setTableData(sortBy(_repayments, 'date'));
  }, [repayments, debtId]);

  const handleClick = (repayment) => {
    dispatch(
      openDialog({
        type: repayment._type,
        mode: 'edit',
        id: repayment.repayment_id,
        attrs: repayment,
      })
    );
  };

  return (
    <Card
      raised
      sx={{
        width: '75%',
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
                <TableCell>date</TableCell>
                <TableCell align='right'>total payment</TableCell>
                <TableCell align='right'>principal</TableCell>
                <TableCell align='right'>interest</TableCell>
                <TableCell align='right'>lender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(tableData, (repayment, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={repayment.repayment_id}
                    onClick={() => handleClick(repayment)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {dayjs(repayment.date).format('YYYY MMMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(
                        repayment.principal + repayment.interest
                      )}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(repayment.principal)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(repayment.interest)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {repayment.lender}
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
