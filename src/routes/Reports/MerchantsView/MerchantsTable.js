import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function CategoryTable(props) {
  const { chartData } = props;

  return (
    <Grid size={{ md: 6, xs: 12 }}>
      <List
        disablePadding
        sx={{
          width: '100%',
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          p: 1,
        }}
      >
        {chartData.map(({ name, value, color }) => {
          if (value === 0) return null;
          return (
            <React.Fragment key={name}>
              <ListItem
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'background.paper',
                    backgroundImage: (theme) => theme.vars.overlays[24],
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ height: 10, width: 10, bgcolor: color }} />
                <ListItemText primary={name} />
                <ListItemText
                  primary={numberToCurrency.format(value)}
                  slotProps={{ primary: { align: 'right' } }}
                />
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </Grid>
  );
}
