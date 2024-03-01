import React from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import StringFilter from '../../../components/FilterOptions/StringFilter';

export default function FilterOptions(props) {
  const { categoryFilter, setCategoryFilter } = props;
  const accountCategories = ['bank', 'property', 'credit', 'brokerage'];

  return (
    <Card raised sx={{ mb: 1 }}>
      <CardContent sx={{ p: 0, pt: 1, pb: '4px !important' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <StringFilter
            label='category'
            disabled={false}
            stringFilter={categoryFilter}
            setStringFilter={setCategoryFilter}
            options={accountCategories}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
