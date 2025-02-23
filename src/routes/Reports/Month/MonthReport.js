import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import get from 'lodash/get';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import {
  OVERVIEW,
  INCOMES,
  EXPENSES,
  REPAYMENTS,
  CATEGORIES,
  MERCHANTS,
} from '../../Layout/CustomAppBar/ReportsAppBar';
import useMonthInflows from '../../../store/hooks/useMonthInflows';
import useMonthOutflows from '../../../store/hooks/useMonthOutflows';
import MonthOverview from './Overview';
import RepaymentsView from '../RepaymentsView';
import IncomesView from '../IncomesView';
import ExpensesView from '../ExpensesView';
import CategoriesView from '../CategoriesView';
import MerchantsView from '../MerchantsView';

export const VIEWS = [
  OVERVIEW,
  INCOMES,
  EXPENSES,
  REPAYMENTS,
  CATEGORIES,
  MERCHANTS,
];

export default function MonthReport() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [date, setDate] = useState(dayjs());
  const location = useLocation();

  const view = get(location.pathname.split('/'), '3', OVERVIEW);

  const { earnedIncomes, passiveIncomes, otherIncomes } = useMonthInflows(
    date.year(),
    date.month()
  );
  const {
    principalSum,
    interestSum,
    escrowSum,
    otherExpenseSum,
    expenses,
    repayments,
    lossSales,
  } = useMonthOutflows(date.year(), date.month());

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: 2,
            mx: 2,
          }}
        >
          <DatePicker
            size='medium'
            value={date}
            onChange={(value) => {
              setDate(value.date(15));
            }}
            format='MMMM YYYY'
            views={['month', 'year']}
            sx={{ width: 180 }}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                inputProps: { style: { fontSize: 20 } },
              },
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <Box>
            <IconButton onClick={() => setDate(date.subtract(1, 'month'))}>
              <ArrowBack />
            </IconButton>
            <IconButton
              onClick={() => {
                setDate(date.add(1, 'month'));
              }}
              disabled={dayjs().isSame(date, 'month')}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      </Grid>
      {view === OVERVIEW && (
        <MonthOverview
          date={date}
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
          principalSum={principalSum}
          interestSum={interestSum}
          escrowSum={escrowSum}
          otherExpenseSum={otherExpenseSum}
          expenses={expenses}
          repayments={repayments}
        />
      )}
      {view === INCOMES && (
        <IncomesView
          date={date}
          earnedIncomes={earnedIncomes}
          passiveIncomes={passiveIncomes}
          otherIncomes={otherIncomes}
        />
      )}
      {view === EXPENSES && (
        <ExpensesView date={date} expenses={expenses} repayments={repayments} />
      )}
      {view === REPAYMENTS && (
        <RepaymentsView date={date} repayments={repayments} />
      )}
      {view === CATEGORIES && (
        <CategoriesView
          expenses={expenses}
          repayments={repayments}
          lossSales={lossSales}
        />
      )}
      {view === MERCHANTS && (
        <MerchantsView
          expenses={expenses}
          repayments={repayments}
          lossSales={lossSales}
        />
      )}
    </>
  );
}
