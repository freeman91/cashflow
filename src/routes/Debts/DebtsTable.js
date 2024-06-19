import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function DebtsTable() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));
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
                      <CustomTableCell idx={idx} component='th' sx={{ p: 1 }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              openDialog({
                                type: debt._type,
                                mode: 'edit',
                                id: debt.debt_id,
                              })
                            );
                          }}
                        >
                          <EditIcon sx={{ hieght: 25, width: 25 }} />
                        </IconButton>
                      </CustomTableCell>
                      <CustomTableCell idx={idx} component='th'>
                        {debt.name}
                      </CustomTableCell>
                      {greaterThanSM && (
                        <CustomTableCell idx={idx} component='th'>
                          {debt.category}
                        </CustomTableCell>
                      )}
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
