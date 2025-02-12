import React from 'react';

import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

export default function QuarterReport(props) {
  const { date, setDate } = props;

  return (
    <>
      <Grid size={{ xs: 12 }}>
        <Typography fontWeight='bold' variant='h5'>
          {/* {date.format('YYYY')} */}
          Current Quarter
        </Typography>
      </Grid>
    </>
  );
}
