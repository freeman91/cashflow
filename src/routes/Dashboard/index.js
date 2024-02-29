import React, { useState } from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import NewTransactionButton from '../../components/NewTransactionButton';
import Cashflow from './Cashflow';
import Spending from './Spending';
import Expenses from './Expenses';
import NetworthCard from './NetworthCard';

function DashboardCardHeader({ title }) {
  return (
    <CardHeader
      title={title}
      titleTypographyProps={{
        variant: 'h6',
        align: 'left',
        sx: { fontWeight: 800 },
      }}
    />
  );
}

function DashboardGridItem(props) {
  const { children } = props;
  return (
    <Grid item xs={12} md={6}>
      {children}
    </Grid>
  );
}

export default function Dashboard() {
  const theme = useTheme();
  const [month, setMonth] = useState(dayjs().date(15).hour(12).minute(0));

  const [selectedExpenses, setSelectedExpenses] = useState([]);

  return (
    <>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <Grid container item xs={12} md={6} spacing={1}>
          <Grid item xs={12}>
            <Cashflow month={month} setMonth={setMonth} />
          </Grid>
          <Grid item xs={12}>
            <NetworthCard />
          </Grid>
        </Grid>

        <DashboardGridItem>
          <Spending month={month} setSelectedExpenses={setSelectedExpenses} />
        </DashboardGridItem>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Expenses expenses={selectedExpenses} />
        </Grid>
      </Grid>
      <NewTransactionButton transactionTypes={['expense', 'income']} />
    </>
  );
}

export { DashboardCardHeader };
