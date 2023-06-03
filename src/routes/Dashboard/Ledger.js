import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Stats from '../../components/Calendar/Month/Stats';
import { useDispatch, useSelector } from 'react-redux';
import { concat, filter, get, includes, map } from 'lodash';
import dayjs from 'dayjs';
import { numberToCurrency } from '../../helpers/currency';
import { green, grey } from '@mui/material/colors';
import { openDialog } from '../../store/dialogs';
import { Paper } from '@mui/material';

const CustomTableCell = ({
  idx,
  column,
  record,
  children,
  color,
  ...restProps
}) => {
  return (
    <TableCell
      scope='row'
      {...restProps}
      sx={{
        color: color,
        borderBottom: 0,
        borderTop: idx === 0 ? '1px solid rgba(81, 81, 81, .5)' : 0,
        fontWeight: column === 'date' ? 800 : 500,
      }}
    >
      {children}
    </TableCell>
  );
};

export default function Ledger({
  day,
  showExpenses,
  showIncomes,
  selectedTypes,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const findRecords = (allRecords, date) => {
      return filter(allRecords, (record) => {
        return (
          get(record, 'date') === date.format('YYYY-MM-DD') &&
          (record.category === 'expense'
            ? includes(selectedTypes, get(record, 'type'))
            : true)
        );
      });
    };

    let date = day.startOf('month');
    let items = [];

    while (date.month() === day.month()) {
      let expenses = showExpenses ? findRecords(allExpenses, date) : [];
      let incomes = showIncomes ? findRecords(allIncomes, date) : [];

      items.push({ date, records: concat(incomes, expenses) });
      date = date.add(1, 'day');
    }

    setListItems(items);
  }, [allExpenses, allIncomes, day, showExpenses, showIncomes, selectedTypes]);

  const handleRecordClick = (record) => {
    dispatch(openDialog({ mode: 'update', attrs: record }));
  };

  const renderTable = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer sx={{ mt: 2, maxWidth: 1000 }} component={Paper}>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align='right'>amount</TableCell>
                <TableCell align='right'>type</TableCell>
                <TableCell align='right'>vendor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(listItems, ({ date, records }) => {
                if (records) {
                  return map(records, (record, idx) => {
                    let color = () => {
                      if (record.category === 'expense') {
                        if (get(record, 'paid', true)) {
                          return 'white';
                        } else {
                          return grey[500];
                        }
                      } else {
                        return green[700];
                      }
                    };

                    return (
                      <TableRow
                        hover={true}
                        key={record.id}
                        onClick={() => handleRecordClick(record)}
                      >
                        <CustomTableCell
                          idx={idx}
                          component='th'
                          column='date'
                          color={color}
                        >
                          {idx === 0
                            ? dayjs(record.date).format('MMM Do')
                            : null}
                        </CustomTableCell>
                        <CustomTableCell idx={idx} align='right' color={color}>
                          {numberToCurrency.format(record.amount)}
                        </CustomTableCell>
                        <CustomTableCell idx={idx} align='right' color={color}>
                          {record.type}
                        </CustomTableCell>
                        <CustomTableCell idx={idx} align='right' color={color}>
                          {record.vendor ? record.vendor : record.source}
                        </CustomTableCell>
                      </TableRow>
                    );
                  });
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <div style={{ marginTop: theme.spacing(1) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing(1),
        }}
      >
        <Stats
          date={day}
          showExpenses={showExpenses}
          showIncomes={showIncomes}
          selectedTypes={selectedTypes}
        />
      </div>
      {renderTable()}
    </div>
  );
}
