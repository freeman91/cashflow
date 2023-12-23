import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import map from 'lodash/map';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { sortBy } from 'lodash';
import { openDialog } from '../../store/dialogs';

const CustomTableCell = ({ idx, column, record, children, ...restProps }) => {
  return (
    <TableCell
      scope='row'
      {...restProps}
      sx={{
        borderBottom: 0,
        borderTop: idx === 0 ? '1px solid rgba(81, 81, 81, .5)' : 0,
        fontWeight: column === 'date' ? 800 : 500,
      }}
    >
      {children}
    </TableCell>
  );
};

export default function IncomesTable() {
  const dispatch = useDispatch();
  const incomes = useSelector((state) => state.incomes.data);
  const paychecks = useSelector((state) => state.paychecks.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let allData = [...incomes, ...paychecks];
    setTableData(sortBy(allData, 'date'));
  }, [incomes, paychecks]);

  const handleClick = (income) => {
    dispatch(
      openDialog({
        type: income._type,
        mode: 'edit',
        id: income.paycheck_id ? income.paycheck_id : income.income_id,
        attrs: income,
      })
    );
  };

  return (
    <>
      <Card
        raised
        sx={{
          width: '100%',
        }}
      >
        <CardHeader
          title='recent incomes'
          titleTypographyProps={{ align: 'left' }}
        />
      </Card>
      <TableContainer
        raised
        sx={{
          mt: 2,
          maxWidth: 1000,
        }}
        component={Card}
      >
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align='right'>amount</TableCell>
              <TableCell align='right'>type</TableCell>
              <TableCell align='right'>source</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {map(tableData, (income, idx) => {
              return (
                <TableRow
                  hover={true}
                  key={
                    income.paycheck_id ? income.paycheck_id : income.income_id
                  }
                  onClick={() => handleClick(income)}
                >
                  <CustomTableCell idx={idx} component='th' column='date'>
                    {dayjs(income.date).format('MMM D')}
                  </CustomTableCell>
                  <CustomTableCell idx={idx} align='right'>
                    {numberToCurrency.format(
                      income.take_home ? income.take_home : income.amount
                    )}
                  </CustomTableCell>
                  <CustomTableCell idx={idx} align='right'>
                    {income._type}
                  </CustomTableCell>
                  <CustomTableCell idx={idx} align='right'>
                    {income.employer ? income.employer : income.source}
                  </CustomTableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
