import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
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
    setTableData(sortBy(_repayments, 'date').reverse());
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
    <TableContainer component='div'>
      <Table size='medium'>
        <TableBody>
          {map(tableData, (repayment, idx) => {
            return (
              <TableRow
                hover={true}
                key={repayment.repayment_id}
                onClick={() => handleClick(repayment)}
              >
                <CustomTableCell idx={idx} component='th' column='date'>
                  {dayjs(repayment.date).format('YYYY MMM D')}
                </CustomTableCell>
                <CustomTableCell idx={idx} align='right'>
                  {numberToCurrency.format(
                    repayment.principal +
                      repayment.interest +
                      (repayment.escrow ? repayment.escrow : 0)
                  )}
                </CustomTableCell>
                <TableCell scope='row' align='right'>
                  <Checkbox
                    edge='start'
                    checked={!repayment.pending}
                    tabIndex={-1}
                    size='small'
                    sx={{
                      '&.MuiButtonBase-root': { padding: 0 },
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
