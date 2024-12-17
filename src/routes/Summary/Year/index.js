import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
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

  const [showAverage, setShowAverage] = useState(false);
  const [numMonths, setNumMonths] = useState(1);
  const [tab, setTab] = useState(TOTALS);
  const [selectedYear, setSelectedYear] = useState(year);
  const [incomeSumByMonth, setIncomeSumByMonth] = useState([]);
  const [expenseSumByMonth, setExpenseSumByMonth] = useState([]);
  const [groupedExpenses, setGroupedExpenses] = useState([]);
  const [groupedIncomes, setGroupedIncomes] = useState([]);
  const [groupedPaychecks, setGroupedPaychecks] = useState([]);

  const {
    allExpenses,
    repayments,
    groupedExpenses: originalGroupedExpenses,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
  } = useExpenseSummaryData(Number(selectedYear));

  const {
    incomes,
    groupedIncomes: originalGroupedIncomes,
    incomeSum,
    groupedPaychecks: originalGroupedPaychecks,
    paychecks,
    paycheckSum,
  } = useIncomeSummaryData(Number(selectedYear));

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (showAverage) {
      const numIncomeMonths = incomeSumByMonth.filter(
        (month) => month > 0
      ).length;
      const numExpenseMonths = expenseSumByMonth.filter(
        (month) => month > 0
      ).length;
      setNumMonths(Math.floor(Math.min(numIncomeMonths, numExpenseMonths)));
    } else {
      setNumMonths(1);
    }
  }, [showAverage, incomeSumByMonth, expenseSumByMonth]);

  useEffect(() => {
    let _groupedIncomes = Object.entries(originalGroupedIncomes).reduce(
      (acc, [key, values]) => {
        acc[key] = values.map((item) => ({
          ...item,
          amount: item.amount / numMonths,
        }));
        return acc;
      },
      {}
    );
    let _groupedPaychecks = Object.entries(originalGroupedPaychecks).reduce(
      (acc, [key, values]) => {
        acc[key] = values.map((item) => ({
          ...item,
          take_home: item.take_home / numMonths,
          taxes: item.taxes / numMonths,
          benefits: item.benefits / numMonths,
          retirement: item.retirement / numMonths,
          other: item.other / numMonths,
        }));
        return acc;
      },
      {}
    );
    setGroupedIncomes(_groupedIncomes);
    setGroupedPaychecks(_groupedPaychecks);
    setGroupedExpenses(
      originalGroupedExpenses.map((expense) => {
        return {
          ...expense,
          value: expense.value / numMonths,
          subcategories: expense.subcategories.map((subcategory) => ({
            ...subcategory,
            value: subcategory.value / numMonths,
          })),
        };
      })
    );
  }, [
    originalGroupedIncomes,
    originalGroupedPaychecks,
    originalGroupedExpenses,
    numMonths,
  ]);

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
        right={
          <Tooltip
            title={showAverage ? 'show total' : 'show average'}
            placement='left'
          >
            <IconButton
              size='medium'
              onClick={() => setShowAverage(!showAverage)}
              color='info'
            >
              {showAverage ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </Tooltip>
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
            incomeTotal={(incomeSum + paycheckSum) / numMonths}
          />
        )}
        {tab === SPENT && (
          <ExpensesByCategory
            groupedExpenses={groupedExpenses}
            expenseTotal={
              (expenseSum + principalSum + interestSum + escrowSum) / numMonths
            }
          />
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
              expenseSum={expenseSum / numMonths}
              principalSum={principalSum / numMonths}
              interestSum={interestSum / numMonths}
              escrowSum={escrowSum / numMonths}
              incomeSum={incomeSum / numMonths}
              paycheckSum={paycheckSum / numMonths}
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
            incomeSum={incomeSum / numMonths}
            paycheckSum={paycheckSum / numMonths}
            groupedPaychecks={groupedPaychecks}
            groupedIncomes={groupedIncomes}
          />
        )}
        {tab === SPENT && (
          <Spent
            groupedExpenses={groupedExpenses}
            repayments={repayments}
            principalSum={principalSum / numMonths}
            interestSum={interestSum / numMonths}
            escrowSum={escrowSum / numMonths}
          />
        )}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
