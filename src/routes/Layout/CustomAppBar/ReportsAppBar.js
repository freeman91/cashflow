import React, { useContext } from 'react';
import startCase from 'lodash/startCase';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { ReportsViewContext } from '../../../store/contexts/ReportsViewContext';

const MONTH = 'month';
// const QUARTER = 'quarter';
const YEAR = 'year';
const VIEWS = [MONTH, YEAR];

export default function ReportsAppBar() {
  const { view, selectView } = useContext(ReportsViewContext);
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {VIEWS.map((_view) => (
        <Box
          key={_view}
          onClick={() => selectView(_view)}
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) =>
              view === _view ? theme.vars.overlays[24] : 'unset',
            boxShadow: (theme) => (view === _view ? theme.shadows[4] : 'unset'),
            borderRadius: 4,
            py: 0.5,
            px: 3,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'background.paper',
              backgroundImage: (theme) => theme.vars.overlays[24],
            },
          }}
        >
          <Typography
            variant='body2'
            color={view === _view ? 'text.primary' : 'text.secondary'}
          >
            {startCase(_view)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
