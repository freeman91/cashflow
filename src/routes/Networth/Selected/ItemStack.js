import React from 'react';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ItemBox from '../../../components/ItemBox';

export default function ItemStack(props) {
  const { groupedItems } = props;

  return map(groupedItems, (group) => {
    const { name, items } = group;
    const sortedItems = sortBy(items, 'value').reverse();
    return (
      <Grid
        key={name}
        item
        xs={12}
        mx={1}
        display='flex'
        justifyContent='center'
      >
        <Card sx={{ width: '100%' }}>
          <Stack spacing={1} direction='column' pt={1} pb={1}>
            <Typography
              variant='body1'
              color='text.secondary'
              align='left'
              sx={{ pl: 2 }}
            >
              {name}
            </Typography>
            {map(sortedItems, (item, idx) => {
              return (
                <React.Fragment key={`${name}-${idx}`}>
                  <Divider sx={{ mx: '8px !important' }} />
                  <ItemBox item={item} />
                </React.Fragment>
              );
            })}
          </Stack>
        </Card>
      </Grid>
    );
  });
}
