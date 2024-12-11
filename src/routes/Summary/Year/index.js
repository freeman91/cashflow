import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../../store/user';
import { MonthSelectButton } from '../../Calendar';
import CustomAppBar from '../../../components/CustomAppBar';
import PullToRefresh from '../../../components/PullToRefresh';
import CustomToggleButton from '../../../components/CustomToggleButton';
import YearTotals from './Totals';
import YearEarned from './Earned';
import YearSpent from './Spent';

const TOTALS = 'totals';
const EARNED = 'earned';
const SPENT = 'spent';

export default function YearSummary(props) {
  const { year } = props;
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(year);
  const [tab, setTab] = useState(TOTALS);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  if (!selectedYear) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            year summary
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
        {tab === TOTALS && <YearTotals year={Number(selectedYear)} />}
        {tab === EARNED && <YearEarned year={Number(selectedYear)} />}
        {tab === SPENT && <YearSpent year={Number(selectedYear)} />}
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
