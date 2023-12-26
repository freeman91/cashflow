import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FilterListIcon from '@mui/icons-material/FilterList';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
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

const start = dayjs().date(1).subtract(1, 'month');
const end = start.add(3, 'month').date(0);

export default function IncomesTable() {
  const dispatch = useDispatch();
  const incomes = useSelector((state) => state.incomes.data);
  const paychecks = useSelector((state) => state.paychecks.data);

  const [range, setRange] = useState({ start, end });
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _incomes = [...incomes, ...paychecks];

    _incomes = filter(_incomes, (income) => {
      return dayjs(income.date).isBetween(range.start, range.end);
    });

    setTableData(sortBy(_incomes, 'date'));
  }, [incomes, paychecks, range]);

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
    <Card raised>
      <CardHeader
        sx={{
          pt: 1,
          pl: 2,
          pr: 2,
          pb: 0,
          '.MuiCardHeader-action': { width: '100%' },
        }}
        action={
          <Stack direction='row' justifyContent='space-around'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <IconButton onClick={() => {}}>
                <CalendarMonthIcon />
              </IconButton>
              <Typography variant='body1'>
                {range.start.format('MMM D')} - {range.end.format('MMM D')}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <IconButton onClick={() => {}}>
                <FilterListIcon />
              </IconButton>
              <Typography variant='body1'>filter</Typography>
            </div>
          </Stack>
        }
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          sx={{
            mt: 2,
            maxWidth: 1000,
          }}
          component='div'
        >
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>date</TableCell>
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
      </CardContent>
    </Card>
  );
}

export { CustomTableCell };
