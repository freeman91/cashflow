import React from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';

import CurrentNetworth from './CurrentNetworth';

export default function Networth() {
  const dispatch = useDispatch();
  return (
    <Card>
      <CardHeader
        title='net worth'
        sx={{ p: 1, pt: '4px', pb: 0 }}
        titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
        action={
          <IconButton size='small' onClick={() => dispatch(push('/networth'))}>
            <ArrowForwardIosIcon />
          </IconButton>
        }
      />
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <CurrentNetworth />
      </CardContent>
    </Card>
  );
}
