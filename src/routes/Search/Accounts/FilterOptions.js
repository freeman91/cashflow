import React, { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import StringFilter from '../../../components/FilterOptions/StringFilter';

export default function FilterOptions(props) {
  const { categoryFilter, setCategoryFilter } = props;
  const [expanded, setExpanded] = useState(false);
  const accountCategories = ['bank', 'property', 'credit', 'brokerage'];

  return (
    <Card raised sx={{ mb: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0px !important' }}>
        <Box
          sx={{
            display: 'flex-end',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              variant='body1'
              sx={{ mr: 1, cursor: 'pointer' }}
              onClick={() => setExpanded(!expanded)}
            >
              filter
            </Typography>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>
        {expanded && (
          <>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <List disablePadding sx={{ width: '100%', maxWidth: 350 }}>
                <ListItem disableGutters>
                  <StringFilter
                    label='category'
                    disabled={false}
                    stringFilter={categoryFilter}
                    setStringFilter={setCategoryFilter}
                    options={accountCategories}
                  />
                </ListItem>
              </List>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
