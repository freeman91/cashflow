import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { map, sortBy } from 'lodash';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/styles';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Popover,
  Stack,
  Typography,
} from '@mui/material';

import Record from './Record';
import { openDialog } from '../../../store/dialogs';

export default function Day({ date, sameMonth, expenses, incomes }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  let isToday = dayjs().isSame(date, 'day');

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeClick = (type) => {
    dispatch(
      openDialog({
        type,
        mode: 'create',
        attrs: {
          date,
        },
      })
    );
    handleClose();
  };

  return (
    <Paper
      variant='outlined'
      sx={{
        width: '8rem',
        height: '10rem',
        backgroundColor: theme.palette.grey[900],
        opacity: sameMonth ? 1 : 0.5,
      }}
    >
      <IconButton
        onClick={handleClick}
        sx={{
          float: 'left',
          height: '1rem',
          width: '1rem',
          mt: '.3rem',
          ml: '.5rem',
        }}
      >
        <AddIcon />
      </IconButton>
      <Typography
        sx={{
          float: 'right',
          width: '1.5rem',
          mt: '.2rem',

          mr: '.5rem',
          bgcolor: isToday
            ? theme.palette.red[800]
            : theme.palette.background.paper,
          borderRadius: '10px',
        }}
      >
        {date.date()}
      </Typography>
      <Box sx={{ width: '100%', justifyContent: 'center' }}>
        <Stack sx={{ width: '100%' }}>
          {map(incomes, (income) => {
            return <Record key={income.income_id} data={income} />;
          })}
          {map(sortBy(expenses, 'pending'), (expense) => {
            return <Record key={expense.expense_id} data={expense} />;
          })}
        </Stack>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Stack
          direction='column'
          justifyContent='space-between'
          alignItems='center'
          spacing={1}
        >
          {['expense', 'income'].map((type) => (
            <Button
              key={type}
              variant='contained'
              onClick={() => handleTypeClick(type)}
            >
              {type}
            </Button>
          ))}
        </Stack>
      </Popover>
    </Paper>
  );
}
