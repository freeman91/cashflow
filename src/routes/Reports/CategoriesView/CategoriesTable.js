import React from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import startCase from 'lodash/startCase';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';

export default function CategoriesTable(props) {
  const { chartData } = props;
  const categoriesState = useSelector((state) => {
    return find(state.categories.data, {
      category_type: 'expense',
    })?.categories;
  });

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
        {chartData.map(({ name, value }) => {
          if (value === 0) return null;
          const category = categoriesState.find((c) => c.name === name);
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
                <Box sx={{ height: 10, width: 10, bgcolor: category.color }} />
                <ListItemText primary={startCase(name)} />
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
