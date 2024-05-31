import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from 'redux-first-history';

import find from 'lodash/find';
import reduce from 'lodash/reduce';

import BackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import DebtsTable from './DebtsTable';
import DebtPage from './DebtPage';
import PageSelect from '../../components/Selector/PageSelect';

export default function Debts() {
  const dispatch = useDispatch();
  const location = useLocation();
  const debts = useSelector((state) => state.debts.data);

  const [debt, setDebt] = useState(null);
  const [debtSum, setDebtSum] = useState(0);
  const [id, setId] = useState('');

  useEffect(() => {
    let _pathname = location.pathname;
    let _id = _pathname.replace('/debts', '');
    _id = _id.replace('/', '');
    setId(_id);
  }, [location.pathname]);

  useEffect(() => {
    if (id) {
      let _debt = find(debts, { debt_id: id });
      setDebt(_debt);
      setDebtSum(0);
    } else {
      setDebt(null);
      setDebtSum(reduce(debts, (sum, debt) => sum + debt.amount, 0));
    }
  }, [debts, id]);

  const renderComponent = () => {
    if (debt) {
      return <DebtPage debt={debt} />;
    }
    return <DebtsTable />;
  };

  return (
    <>
      <AppBar position='static'>
        <Toolbar sx={{ minHeight: '40px' }}>
          <IconButton onClick={() => dispatch(goBack())}>
            <BackIcon />
          </IconButton>
          <Typography
            align='center'
            variant='h6'
            sx={{ flexGrow: 1, fontWeight: 800 }}
          >
            debts
          </Typography>
          {debt ? (
            <IconButton
              onClick={() =>
                dispatch(
                  openDialog({
                    type: 'debt',
                    mode: 'edit',
                    id: debt.debt_id,
                  })
                )
              }
            >
              <EditIcon />
            </IconButton>
          ) : (
            <PageSelect />
          )}
        </Toolbar>
      </AppBar>
      <Grid
        container
        spacing={1}
        sx={{
          pl: 1,
          pr: 1,
          pt: 1,
          mb: 8,
        }}
      >
        {!debt && (
          <Grid item xs={12}>
            <Card raised>
              <CardContent sx={{ p: 1, pt: '4px', pb: '0 !important' }}>
                <Typography
                  align='center'
                  variant='h4'
                  color={(theme) => theme.palette.green[600]}
                >
                  {numberToCurrency.format(debtSum)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {renderComponent()}
      </Grid>
    </>
  );
}
