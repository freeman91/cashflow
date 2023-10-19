import React, { useState } from 'react';
import dayjs from 'dayjs';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

import MonthReport from './MonthReport';
import { map, startCase } from 'lodash';
import IncomeView from './MonthReport/IncomeView';
import ExpenseView from './MonthReport/ExpenseView';

const VIEWS = ['income', 'expenses', 'net worth'];

export default function Reports() {
  const [date1, setDate1] = useState(dayjs().subtract(2, 'month'));
  const [date2, setDate2] = useState(dayjs().subtract(1, 'month'));

  const [selectedView, setView] = useState(VIEWS[0]);

  const renderView = () => {
    switch (selectedView) {
      case 'income':
        return <IncomeView date1={date1} date2={date2} />;
      case 'expenses':
        return <ExpenseView date1={date1} date2={date2} />;
      case 'net worth':
        return <>Net Worth</>;
      default:
        return null;
    }
  };

  return (
    <Grid
      container
      spacing={2}
      height={'100%'}
      alignItems='flex-start'
      justifyContent='center'
    >
      <MonthReport date={date1} setDate={setDate1} />
      <MonthReport date={date2} setDate={setDate2} />
      <Grid item xs={12}>
        <Stack direction='row' spacing={2} justifyContent='center'>
          {map(VIEWS, (view) => {
            return (
              <Button
                key={view}
                size='large'
                variant={view === selectedView ? 'contained' : 'outlined'}
                sx={{
                  fontWeight: view === selectedView ? 800 : 100,
                  width: '10rem',
                }}
                onClick={() => setView(view)}
              >
                {startCase(view)}
              </Button>
            );
          })}
        </Stack>
      </Grid>
      <Grid item xs={6}>
        {renderView()}
      </Grid>
    </Grid>
  );
}
