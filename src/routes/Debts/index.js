import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import find from 'lodash/find';
import reduce from 'lodash/reduce';

import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { setAppBar } from '../../store/appSettings';
import { BackButton } from '../Layout/CustomAppBar';
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
    dispatch(
      setAppBar({
        title: 'debts',
        leftAction: <BackButton />,
        rightAction: debt ? (
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
        ),
      })
    );
  }, [dispatch, debt]);

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
    <Grid
      container
      spacing={1}
      sx={{
        pl: 1,
        pr: 1,
        pt: 1,
        mb: 10,
      }}
    >
      {!debt && (
        <Grid item xs={12}>
          <Card raised>
            <CardContent sx={{ p: 1, pt: '4px', pb: '0 !important' }}>
              <Typography
                align='center'
                variant='h4'
                color={(theme) => theme.palette.red[600]}
              >
                {numberToCurrency.format(debtSum)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      {renderComponent()}
    </Grid>
  );
}
