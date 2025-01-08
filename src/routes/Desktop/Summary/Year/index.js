import React, { useState } from 'react';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// import useExpenseSummaryData from '../../../../store/hooks/useExpenseSummaryData';
// import useIncomeSummaryData from '../../../../store/hooks/useIncomeSummaryData';
import MonthSelectButton from '../../../../components/MonthSelectButton';

export default function YearSummary(props) {
  const { year } = props;

  const [selectedYear, setSelectedYear] = useState(year);

  const handlePrevYear = () => {
    setSelectedYear(selectedYear - 1);
  };

  const handleNextYear = () => {
    setSelectedYear(selectedYear + 1);
  };

  if (!selectedYear) return null;
  return (
    <Box sx={{ width: '100%' }}>
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ maxWidth: 1000, mx: 'auto', width: '100%', mt: 1 }}
      >
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
        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
