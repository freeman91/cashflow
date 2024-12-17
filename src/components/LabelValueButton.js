import React, { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import BoxFlexCenter from './BoxFlexCenter';
import { _numberToCurrency } from '../helpers/currency';

const LabelValueButton = forwardRef((props, ref) => {
  const { value = null, label, onClick = () => {}, Icon = null } = props;
  return (
    <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
      <Card
        ref={ref}
        sx={{
          width: '100%',
          p: 0.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ListItemButton
          sx={{
            p: 0,
            px: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: 1,
          }}
          onClick={onClick}
        >
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              align: 'left',
              fontWeight: 'bold',
              variant: 'h6',
              color: 'text.secondary',
            }}
            sx={{ ml: 1 }}
          />
          {value !== null && (
            <BoxFlexCenter>
              <Typography variant='h6' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h5' color='white' fontWeight='bold'>
                {_numberToCurrency.format(value)}
              </Typography>
            </BoxFlexCenter>
          )}
          {Icon && <Icon sx={{ color: 'info.main', mx: 1 }} />}
          {!Icon && <Box sx={{ mr: 1 }} />}
        </ListItemButton>
      </Card>
    </Grid>
  );
});

export default LabelValueButton;
