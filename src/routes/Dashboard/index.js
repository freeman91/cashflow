import React, { useState } from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import NewTransactionButton from '../../components/NewTransactionButton';

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
  const [month] = useState(dayjs().format('MMMM').toLowerCase());

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Grid
        container
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        <DashboardGridItem>
          <Card raised>
            <DashboardCardHeader title={`${month} cashflow`} />
            <CardContent>
              <p>earned vs total income</p>
              <LinearProgress
                variant='determinate'
                value={(2106.48 / 4213) * 100}
              />
              <p>spent vs budget</p>
              <LinearProgress
                variant='determinate'
                value={(1584 / 4500) * 100}
              />
            </CardContent>
          </Card>
        </DashboardGridItem>
        <DashboardGridItem>
          <Card raised>
            <DashboardCardHeader title='spending' />
            <CardContent>
              <p>pie graph of spending by category</p>
            </CardContent>
          </Card>
        </DashboardGridItem>
        <DashboardGridItem>
          <Card raised>
            <DashboardCardHeader title='recent expenses/bills/pending' />
            <CardContent>
              <p>show paid bills and upcoming bills</p>
            </CardContent>
          </Card>
        </DashboardGridItem>
        <DashboardGridItem>
          <Card raised>
            <DashboardCardHeader title='equity' />
            <CardContent>
              <p>asset & debt value & net</p>
            </CardContent>
          </Card>
        </DashboardGridItem>
      </Grid>
      <NewTransactionButton transactionTypes={['expense', 'income']} />
    </Box>
  );
}
