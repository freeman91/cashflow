import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function DebtsTable() {
  const dispatch = useDispatch();
  const allDebts = useSelector((state) => state.debts.data);
  const [debts, setDebts] = useState([]);

  useEffect(() => {
    let _debts = allDebts;
    setDebts(sortBy(_debts, 'amount').reverse());
  }, [allDebts]);

  const handleClick = (debt) => {
    dispatch(push('/debts/' + debt.debt_id));
  };

  return (
    <Grid item xs={12}>
      <Card raised>
        <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
          <TableContainer component={'div'}>
            <Table size='medium'>
              <TableBody>
                {debts.map((debt, idx) => {
                  return (
                    <TableRow
                      hover={true}
                      key={debt.debt_id}
                      onClick={() => handleClick(debt)}
                    >
                      <CustomTableCell
                        idx={idx}
                        component='th'
                        sx={{ height: 20 }}
                      >
                        {debt.name}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(debt.amount)}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}
