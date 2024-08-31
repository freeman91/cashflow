import React, { useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullToRefresh';
import Overview from './Overview';
import Summary from './Summary';
import Accounts from './Accounts';
import Networth from './Networth';
import CustomAppBar from '../../components/CustomAppBar';

const TABS = ['overview', 'summary', 'accounts', 'networth'];

export default function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const ref = useRef(null);
  const toolbarRef = useRef(null);
  const today = dayjs();

  const [showMonthSelect, setShowMonthSelect] = useState(true);
  const [month, setMonth] = useState(dayjs());
  const [tab, setTab] = useState(TABS[0]);

  const onRefresh = async () => {
    dispatch(refresh());
  };

  const { isRefreshing, pullPosition } = usePullToRefresh({ onRefresh });

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tab = pathParts[2];
    const subtab = pathParts[3];
    if (!subtab) {
      if (tab && TABS.includes(tab)) {
        setTab(tab);
      } else {
        setTab(TABS[0]);
      }
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const tab = location.pathname.split('/')[2];
    if (['accounts', 'networth'].includes(tab)) {
      setShowMonthSelect(false);
    } else {
      setShowMonthSelect(true);
    }
  }, [location.pathname]);

  const changeTab = (e, newTab) => {
    dispatch(push(`/dashboard/${newTab}`));
  };

  const handleNextMonth = () => {
    const nextMonth = month.add(1, 'month');
    setMonth(nextMonth);
  };

  const handlePrevMonth = () => {
    const prevMonth = month.subtract(1, 'month');
    setMonth(prevMonth);
  };

  const handleCalendarClick = () => {
    dispatch(push('/calendar', { month }));
  };

  const marginTop = toolbarRef?.current?.offsetHeight || 90;
  const diff = today.diff(month, 'month');
  const format = diff > 10 ? 'MMMM YYYY' : 'MMMM';
  const nextDisabled = today.isSameOrBefore(month, 'month');

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
        width: '100%',
      }}
    >
      <CustomAppBar
        ref={toolbarRef}
        title={
          showMonthSelect && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <IconButton size='large' onClick={handlePrevMonth}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant='h6'>{month.format(format)}</Typography>
              <IconButton
                size='large'
                onClick={handleNextMonth}
                disabled={nextDisabled}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )
        }
        rightIcon={
          <IconButton size='large' edge='end' onClick={handleCalendarClick}>
            <CalendarMonthIcon />
          </IconButton>
        }
        tabs={TABS}
        tab={tab}
        changeTab={changeTab}
      />
      <Grid
        ref={ref}
        container
        spacing={2}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ pt: 1, mt: marginTop + 'px' }}
      >
        {(isRefreshing || pullPosition > 100) && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress sx={{ mt: 1 }} />
          </Grid>
        )}
        {tab === 'overview' && <Overview month={month} />}
        {tab === 'summary' && <Summary date={month} />}
        {tab === 'accounts' && <Accounts />}
        {tab === 'networth' && <Networth />}
        <Grid item xs={12} mb={16} />
      </Grid>
    </Box>
  );
}
