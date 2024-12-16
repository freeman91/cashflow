import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import useExpenseSummaryData from '../../../store/hooks/useExpenseSummaryData';
import useIncomeSummaryData from '../../../store/hooks/useIncomeSummaryData';
import { findAmount } from '../../../helpers/transactions';
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import CustomToggleButton from '../../../components/CustomToggleButton';
import MonthSelectButton from '../../../components/MonthSelectButton';
import ExpensesByCategory from '../../../components/summary/ExpensesByCategory';
import IncomesByEmployerCategory from '../../../components/summary/IncomesByEmployerCategory';
import MonthlyLineChart, { MONTHS } from './MonthlyLineChart';
import MonthlyBreakdown from './MonthlyBreakdown';
import Earned from '../Earned';
import Spent from '../Spent';
import YearTotals from '../Totals';

const TOTALS = 'totals';
const EARNED = 'earned';
const SPENT = 'spent';

export default function YearSummary(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const [tab, setTab] = useState(TOTALS);
  const [selectedYear, setSelectedYear] = useState(year);
  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);

  const {
    allExpenses,
    repayments,
    groupedExpenses,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
  } = useExpenseSummaryData(Number(selectedYear));

  const {
    incomes,
    groupedIncomes,
    incomeSum,
    groupedPaychecks,
    paychecks,
    paycheckSum,
  } = useIncomeSummaryData(Number(selectedYear));

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    let yearIncomes = [...incomes, ...paychecks];

    let _months = map(MONTHS, (month) => {
      let _incomes = filter(yearIncomes, (income) => {
        if (!income.date) return false;
        return dayjs(income.date).month() === month;
      });
      return reduce(_incomes, (sum, income) => sum + findAmount(income), 0);
    });
    setIncomeSumByMonth(_months);
  }, [incomes, paychecks]);

  useEffect(() => {
    let _months = map(MONTHS, (month) => {
      let _expenses = filter(
        allExpenses,
        (expense) => dayjs(expense.date).month() === month
      );
      return reduce(_expenses, (sum, expense) => sum + findAmount(expense), 0);
    });
    setExpenseSumByMonth(_months);
  }, [allExpenses]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  if (!selectedYear) return null;
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            summary
          </Typography>
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '100%',
              py: 1,
            }}
          >
            <MonthSelectButton
              Icon={ChevronLeftIcon}
              onClick={handlePrevYear}
            />
            <Typography variant='h5' fontWeight='bold'>
              {selectedYear}
            </Typography>
            <MonthSelectButton
              Icon={ChevronRightIcon}
              onClick={handleNextYear}
            />
          </Box>
        </Grid>
        {tab === TOTALS && (
          <MonthlyLineChart
            incomeSumByMonth={incomeSumByMonth}
            expenseSumByMonth={expenseSumByMonth}
          />
        )}
        {tab === EARNED && (
          <IncomesByEmployerCategory
            groupedIncomes={groupedIncomes}
            groupedPaychecks={groupedPaychecks}
          />
        )}
        {tab === SPENT && (
          <ExpensesByCategory groupedExpenses={groupedExpenses} />
        )}
        <Grid item xs={12} display='flex' justifyContent='center' mx={1} mt={1}>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
          >
            <CustomToggleButton value={TOTALS}>totals</CustomToggleButton>
            <CustomToggleButton value={EARNED}>earned</CustomToggleButton>
            <CustomToggleButton value={SPENT}>spent</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {tab === TOTALS && (
          <>
            <YearTotals
              expenseSum={expenseSum}
              principalSum={principalSum}
              interestSum={interestSum}
              escrowSum={escrowSum}
              incomeSum={incomeSum}
              paycheckSum={paycheckSum}
            />
            <MonthlyBreakdown
              year={selectedYear}
              incomeSumByMonth={incomeSumByMonth}
              expenseSumByMonth={expenseSumByMonth}
            />
          </>
        )}
        {tab === EARNED && (
          <Earned
            incomes={incomes}
            incomeSum={incomeSum}
            paycheckSum={paycheckSum}
            groupedPaychecks={groupedPaychecks}
            groupedIncomes={groupedIncomes}
          />
        )}
        {tab === SPENT && (
          <Spent
            groupedExpenses={groupedExpenses}
            repayments={repayments}
            expenseSum={expenseSum}
            principalSum={principalSum}
            interestSum={interestSum}
            escrowSum={escrowSum}
            incomeTotal={incomeSum + paycheckSum}
          />
        )}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
