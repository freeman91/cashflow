import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SummarizeIcon from '@mui/icons-material/Summarize';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import useExpenseSummaryData from '../../../store/hooks/useExpenseSummaryData';
import useIncomeSummaryData from '../../../store/hooks/useIncomeSummaryData';
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import CustomToggleButton from '../../../components/CustomToggleButton';
import MonthSelectButton from '../../../components/MonthSelectButton';
import MonthPieCharts from '../../../components/summary/MonthPieCharts';
import ExpensesByCategory from '../../../components/summary/ExpensesByCategory';
import IncomesByEmployerCategory from '../../../components/summary/IncomesByEmployerCategory';
import Earned from '../Earned';
import Spent from '../Spent';
import YearTotals from '../Totals';

const TOTALS = 'totals';
const EARNED = 'earned';
const SPENT = 'spent';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();
  const today = dayjs();

  const [date, setDate] = useState(null);
  const [tab, setTab] = useState(TOTALS);

  const {
    repayments,
    groupedExpenses,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
  } = useExpenseSummaryData(date?.year(), date?.month());

  const { incomes, groupedIncomes, incomeSum, groupedPaychecks, paycheckSum } =
    useIncomeSummaryData(date?.year(), date?.month());

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (year && month) {
      setDate(dayjs(`${year}-${month}-15`));
    }
  }, [year, month]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handlePrevMonth = () => {
    const previousMonth = date?.subtract(1, 'month');
    setDate(previousMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = date?.add(1, 'month');
    setDate(nextMonth);
  };

  const handleOpenYearlySummary = () => {
    dispatch(push(`/summary/${year}`));
  };

  const diff = today.diff(date, 'month');
  const format = diff > 10 ? 'MMMM YYYY' : 'MMMM';

  if (!date) return null;
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            summary
          </Typography>
        }
        right={
          <Tooltip title={`${date?.format('YYYY')} summary`} placement='left'>
            <IconButton
              size='medium'
              onClick={handleOpenYearlySummary}
              color='info'
            >
              <SummarizeIcon />
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
              onClick={handlePrevMonth}
            />
            <Typography variant='h5' fontWeight='bold'>
              {date?.format(format)}
            </Typography>
            <MonthSelectButton
              Icon={ChevronRightIcon}
              onClick={handleNextMonth}
            />
          </Box>
        </Grid>
        {tab === TOTALS && (
          <MonthPieCharts
            groupedIncomes={groupedIncomes}
            groupedPaychecks={groupedPaychecks}
            groupedExpenses={groupedExpenses}
          />
        )}
        {tab === EARNED && (
          <IncomesByEmployerCategory
            groupedIncomes={groupedIncomes}
            groupedPaychecks={groupedPaychecks}
            incomeTotal={incomeSum + paycheckSum}
          />
        )}
        {tab === SPENT && (
          <ExpensesByCategory
            groupedExpenses={groupedExpenses}
            expenseTotal={expenseSum + principalSum + interestSum + escrowSum}
          />
        )}
        <Grid item xs={12} display='flex' justifyContent='center' mx={1} mt={0}>
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
          <YearTotals
            expenseSum={expenseSum}
            principalSum={principalSum}
            interestSum={interestSum}
            escrowSum={escrowSum}
            incomeSum={incomeSum}
            paycheckSum={paycheckSum}
          />
        )}
        {tab === EARNED && (
          <Earned
            year={year}
            month={month}
            incomes={incomes}
            incomeSum={incomeSum}
            paycheckSum={paycheckSum}
            groupedPaychecks={groupedPaychecks}
            groupedIncomes={groupedIncomes}
          />
        )}
        {tab === SPENT && (
          <Spent
            year={year}
            month={month}
            groupedExpenses={groupedExpenses}
            repayments={repayments}
            principalSum={principalSum}
            interestSum={interestSum}
            escrowSum={escrowSum}
          />
        )}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
