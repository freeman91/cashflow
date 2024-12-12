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
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import CustomToggleButton from '../../../components/CustomToggleButton';
import MonthSelectButton from '../../../components/MonthSelectButton';
import MonthTotals from './Totals';
import MonthEarned from './Earned';
import MonthSpent from './Spent';

const TOTALS = 'totals';
const EARNED = 'earned';
const SPENT = 'spent';

export default function MonthSummary(props) {
  const { year, month } = props;
  const dispatch = useDispatch();

  const today = dayjs();

  const [date, setDate] = useState(null);
  const [tab, setTab] = useState(TOTALS);

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

  if (!date) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            month summary
          </Typography>
        }
        right={
          <Tooltip title={`${date?.format('YYYY')} summary`} placement='left'>
            <IconButton size='medium' onClick={handleOpenYearlySummary}>
              <SummarizeIcon sx={{ color: 'button' }} />
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
        {tab === TOTALS && <MonthTotals month={date} />}
        {tab === EARNED && <MonthEarned month={date} />}
        {tab === SPENT && <MonthSpent month={date} />}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
