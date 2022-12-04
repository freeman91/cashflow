import React, { useState } from 'react';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TuneIcon from '@mui/icons-material/Tune';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

import { MonthYearSelector } from '../../components/Selector';
import { Chip } from '@mui/material';
import ExpenseTypeSelector from '../../components/Selector/ExpenseTypeSelector';

export default function DashboardToolbar(props) {
  const {
    view,
    setView,
    day,
    setDay,
    showExpenses,
    setShowExpenses,
    showIncomes,
    setShowIncomes,
    selectedTypes,
    setSelectedTypes,
  } = props;

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (selectedDate) => {
    setDay(dayjs(selectedDate));
  };

  const handleBackClick = () => {
    setDay(day.subtract(1, view === 'Year' ? 'year' : 'month'));
  };

  const handleForwardClick = () => {
    setDay(day.add(1, view === 'Year' ? 'year' : 'month'));
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <AppBar position='static' sx={{ maxWidth: 1200 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Select
            variant='standard'
            value={view}
            onChange={(e) => {
              setView(e.target.value);
            }}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value='Calendar'>Calendar</MenuItem>
            <MenuItem value='Ledger'>Ledger</MenuItem>
            <MenuItem value='Year'>Year</MenuItem>
          </Select>

          <div>
            <IconButton onClick={handleBackClick} size='small'>
              <ArrowBackIosNewIcon />
            </IconButton>
            <MonthYearSelector
              date={day}
              handleDateChange={handleDateChange}
              interval={view === 'Year' ? 'year' : 'month'}
            />
            <IconButton onClick={handleForwardClick} size='small'>
              <ArrowForwardIosIcon />
            </IconButton>
          </div>

          <div>
            <Chip
              label='expenses'
              variant={showExpenses ? 'filled' : 'outlined'}
              sx={{ mr: 1 }}
              onClick={() => setShowExpenses(!showExpenses)}
            />
            <Chip
              label='incomes'
              variant={showIncomes ? 'filled' : 'outlined'}
              onClick={() => setShowIncomes(!showIncomes)}
            />
          </div>

          <IconButton color='inherit' onClick={handleOpen}>
            <TuneIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ExpenseTypeSelector
        onClose={handleClose}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        open={open}
      />
    </Box>
  );
}
