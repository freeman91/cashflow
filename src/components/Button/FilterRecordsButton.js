import React, { useState } from 'react';

import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';

export default function FilterRecordsButton(props) {
  const {
    filterExpense,
    setFilterExpense,
    filterIncome,
    setFilterIncome,
    filterHour,
    setFilterHour,
  } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <FilterListIcon sx={{ transform: 'scale(1.2)' }} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={!filterExpense}
                onChange={() => setFilterExpense(!filterExpense)}
              />
            }
            label='expense'
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={!filterIncome}
                onChange={() => setFilterIncome(!filterIncome)}
              />
            }
            label='income'
          />
        </MenuItem>
        <MenuItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={!filterHour}
                onChange={() => setFilterHour(!filterHour)}
              />
            }
            label='hour'
          />
        </MenuItem>
      </Menu>
    </>
  );
}
