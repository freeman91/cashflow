import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { map, filter, get, includes } from 'lodash';
import dayjs from 'dayjs';

import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/styles';
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  Paper,
  Popover,
  Stack,
  Typography,
} from '@mui/material';

import Record from './Record';
import { openDialog } from '../../../store/dialogs';

export default function Day({
  date,
  sameMonth,
  showExpenses,
  showIncomes,
  selectedTypes,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  let isToday = dayjs().isSame(date, 'day');

  const allExpenses = useSelector((state) => state.expenses.data);
  const allIncomes = useSelector((state) => state.incomes.data);

  const [anchorEl, setAnchorEl] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);

  useEffect(() => {
    if (showExpenses) {
      setExpenses(
        filter(allExpenses, (expense) => {
          return (
            get(expense, 'date') === date.format('YYYY-MM-DD') &&
            includes(selectedTypes, get(expense, 'type'))
          );
        })
      );
    } else {
      setExpenses([]);
    }
  }, [allExpenses, date, showExpenses, selectedTypes]);

  useEffect(() => {
    if (showIncomes) {
      setIncomes(
        filter(allIncomes, (income) => {
          return get(income, 'date') === date.format('YYYY-MM-DD');
        })
      );
    } else {
      setIncomes([]);
    }
  }, [allIncomes, date, showIncomes]);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = (type) => {
    dispatch(
      openDialog({
        mode: 'create',
        attrs: {
          type,
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
            return <Record key={income.id} data={income} />;
          })}
          {map(expenses, (expense) => {
            return <Record key={expense.id} data={expense} />;
          })}
        </Stack>
      </Box>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          <ListItemButton onClick={() => handleOpenDialog('expense')}>
            Expense
          </ListItemButton>
          <ListItemButton onClick={() => handleOpenDialog('income')}>
            Income
          </ListItemButton>
        </List>
      </Popover>
    </Paper>
  );
}
