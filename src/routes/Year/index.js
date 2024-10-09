import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import CustomAppBar from '../../components/CustomAppBar';
import YearOverview from './Overview';
import YearIncomes from './Incomes';
import YearExpenses from './Expenses';

const OVERVIEW = 'overview';
const INCOMES = 'incomes';
const EXPENSES = 'expenses';
const TABS = [OVERVIEW, INCOMES, EXPENSES];

export default function Year() {
  const dispatch = useDispatch();
  const location = useLocation();
  const toolbarRef = useRef(null);
  const today = dayjs();

  const [year, setYear] = useState(dayjs());
  const [tab, setTab] = useState(OVERVIEW);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tab = pathParts[2];
    const subtab = pathParts[3];
    if (!subtab) {
      if (tab && TABS.includes(tab)) {
        setTab(tab);
      } else {
        setTab(OVERVIEW);
      }
    }
  }, [location.pathname, dispatch]);

  const changeTab = (e, newTab) => {
    dispatch(push(`/year/${newTab}`));
  };

  const handleNextYear = () => {
    const nextYear = year.add(1, 'year');
    setYear(nextYear);
  };

  const handlePrevYear = () => {
    const prevYear = year.subtract(1, 'year');
    setYear(prevYear);
  };

  const nextDisabled = today.isSameOrBefore(year, 'year');
  const marginTop = toolbarRef?.current?.offsetHeight || 90;
  return (
    <Box
      sx={{
        // overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
      }}
    >
      <CustomAppBar
        ref={toolbarRef}
        title={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <IconButton size='large' onClick={handlePrevYear}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant='h6' fontWeight='bold'>
              {year.format('YYYY')}
            </Typography>
            <IconButton
              size='large'
              onClick={handleNextYear}
              disabled={nextDisabled}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        }
        tabs={TABS}
        tab={tab}
        changeTab={changeTab}
      />
      <Grid
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ pt: 1, mt: marginTop + 'px' }}
      >
        {tab === OVERVIEW && <YearOverview year={year.year()} />}
        {tab === INCOMES && <YearIncomes year={year.year()} />}
        {tab === EXPENSES && <YearExpenses year={year.year()} />}
        <Grid item xs={12} mb={16} />
      </Grid>
    </Box>
  );
}
