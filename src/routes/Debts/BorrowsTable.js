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

export default function BorrowsTable(props) {
  const { debtId } = props;
  const dispatch = useDispatch();
  const borrows = useSelector((state) => state.borrows.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _borrows = filter(borrows, { debt_id: debtId });

    setTableData(sortBy(_borrows, 'date'));
  }, [borrows, debtId]);

  const handleClick = (borrow) => {
    dispatch(
      openDialog({
        type: borrow._type,
        mode: 'edit',
        id: borrow.borrow_id,
        attrs: borrow,
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
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important', width: '100%' }}>
        <TableContainer
          sx={{
            width: '100%',
          }}
          component='div'
        >
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>date</TableCell>
                <TableCell align='right'>amount</TableCell>
                <TableCell align='right'>lender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(tableData, (borrow, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={borrow.borrow_id}
                    onClick={() => handleClick(borrow)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {dayjs(borrow.date).format('YYYY MMMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(borrow.amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {borrow.lender}
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
