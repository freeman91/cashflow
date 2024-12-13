import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import FillBar from './FillBar';
import FullBar from './FullBar';
import OverageBar from './OverageBar';

export default function CategorySummary({ category, updateGoal }) {
  const dispatch = useDispatch();

  const [editing, setEditing] = useState(false);

  const startEditClick = () => {
    setEditing(true);
  };

  const handleCloseClick = () => {
    setEditing(false);
  };

  const handleChange = (e) => {
    const value = Number(e.target.value).toFixed(0);
    updateGoal(category.category, value);
  };

  const handleClick = () => {
    dispatch(push(`/budgets/${category.category}`));
  };

  const diff = category.goal - category.expenseSum;
  const fillValue = diff < 0 ? category.goal : category.expenseSum;
  return (
    <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
      <Card sx={{ width: '100%', px: 2 }}>
        <BoxFlexCenter
          justifyContent='space-between'
          sx={{ alignItems: 'center ' }}
        >
          <Typography
            variant='h6'
            fontWeight='bold'
            align='center'
            color='text.secondary'
          >
            {category.category}
          </Typography>
          <IconButton onClick={handleClick} color='info'>
            <ChevronRightIcon />
          </IconButton>
        </BoxFlexCenter>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <BoxFlexCenter justifyContent='flex-start'>
            <Typography variant='body1' color='text.secondary'>
              $
            </Typography>
            <Typography variant='h6' fontWeight='bold'>
              {_numberToCurrency.format(category.expenseSum)}
            </Typography>
          </BoxFlexCenter>
          {editing ? (
            <TextField
              variant='standard'
              inputProps={{ style: { textAlign: 'right' } }}
              value={category.goal}
              onChange={handleChange}
              sx={{ width: '35%' }}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position='start'>$</InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={handleCloseClick} color='info'>
                      <CloseIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <BoxFlexCenter justifyContent='flex-end'>
              <Typography variant='body1' color='text.secondary'>
                $
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {_numberToCurrency.format(category.goal)}
              </Typography>
              <InputAdornment position='end'>
                <IconButton onClick={startEditClick} color='info'>
                  <EditIcon />
                </IconButton>
              </InputAdornment>
            </BoxFlexCenter>
          )}
        </Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <FullBar>
            <FillBar
              fillValue={fillValue}
              goalSum={category.goal}
              color={category.color}
            />
            <OverageBar expenseSum={category.expenseSum} goal={category.goal} />
          </FullBar>
          <Typography
            variant='body1'
            color={diff >= 0 ? 'success.main' : 'error.main'}
            fontWeight='bold'
            align='center'
          >
            {numberToCurrency.format(diff)}
          </Typography>
        </Box>
      </Card>
    </Grid>
  );
}
