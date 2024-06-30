import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import reduce from 'lodash/reduce';

import PieChartIcon from '@mui/icons-material/PieChart';
import ViewListIcon from '@mui/icons-material/ViewList';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../../helpers/currency';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';
import CustomPieChart from './CustomPieChart';

export default function ExpensesByCategory(props) {
  const { year, month } = props;

  const [view, setView] = useState('list');
  const allExpenses = useSelector((state) => state.expenses.data);
  const allRepayments = useSelector((state) => state.repayments.data);

  const [groupedExpenses, setGroupedExpenses] = useState([]);

  useEffect(() => {
    let repayments = filter(allRepayments, (repayment) => {
      const tDate = dayjs(repayment.date);
      return (
        tDate.year() === year &&
        tDate.month() === month - 1 &&
        !repayment.pending
      );
    });

    let expenses = filter(allExpenses, (expense) => {
      const tDate = dayjs(expense.date);
      return (
        tDate.year() === Number(year) &&
        tDate.month() === month - 1 &&
        !expense.pending
      );
    });

    const items = [
      ...repayments.map((repayment) => ({
        ...repayment,
        amount:
          repayment.principal +
          repayment.interest +
          (repayment.escrow ? repayment.escrow : 0),
      })),
      ...expenses,
    ];

    let _groupedExpenses = groupBy(items, 'category');
    _groupedExpenses = Object.keys(_groupedExpenses).map((key) => {
      return {
        id: key,
        label: key,
        category: key,
        value: reduce(
          _groupedExpenses[key],
          (sum, item) => sum + item.amount,
          0
        ),
      };
    });
    _groupedExpenses.sort((a, b) => b.value - a.value);
    setGroupedExpenses(_groupedExpenses);
  }, [year, month, allExpenses, allRepayments]);

  const handleClick = (group) => {
    console.log('group: ', group);
  };

  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // borderRadius: '10px',
        background: (theme) =>
          `linear-gradient(0deg, ${theme.palette.surface[200]}, ${theme.palette.surface[300]})`,
      }}
    >
      <Stack spacing={1} direction='column'>
        <Box
          sx={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography
            variant='h6'
            color='grey.0'
            fontWeight='bold'
            sx={{ pl: 2, mt: 1 }}
          >
            by category
          </Typography>
          <ToggleButtonGroup value={view} exclusive onChange={handleChange}>
            <ToggleButton value='list'>
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value='pie'>
              <PieChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {view === 'list' && (
          <TableContainer component='div'>
            <Table size='medium'>
              <TableBody>
                {groupedExpenses.map((group, idx) => {
                  return (
                    <TableRow
                      hover={true}
                      key={group.category}
                      onClick={() => handleClick(group)}
                    >
                      <CustomTableCell idx={idx} component='th'>
                        {group.category}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(group.value)}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {view === 'pie' && <CustomPieChart groupedExpenses={groupedExpenses} />}
      </Stack>
    </Box>
  );
}
