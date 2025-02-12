import React, { useContext } from 'react';
import startCase from 'lodash/startCase';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { ReportsViewContext } from '../../../store/contexts/ReportsViewContext';

const MONTH = 'month';
const QUARTER = 'quarter';
const YEAR = 'year';
const VIEWS = [MONTH, QUARTER, YEAR];

export default function ReportsAppBar() {
  const { view, selectView } = useContext(ReportsViewContext);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        height: 35,
      }}
    >
      {VIEWS.map((_view) => (
        <Chip
          key={_view}
          label={startCase(_view)}
          variant={view === _view ? 'filled' : 'outlined'}
          onClick={() => selectView(_view)}
        />
      ))}
    </Box>
  );
}
