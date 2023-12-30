import React, { useState } from 'react';
import dayjs from 'dayjs';
import map from 'lodash/map';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

const RANGE_OPTIONS = [
  {
    id: 1,
    label: 'This Month',
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month'),
  },
  {
    id: 2,
    label: 'Last Month',
    start: dayjs().subtract(1, 'month').startOf('month'),
    end: dayjs().subtract(1, 'month').endOf('month'),
  },
  {
    id: 3,
    label: 'This Year',
    start: dayjs().startOf('year'),
    end: dayjs().endOf('year'),
  },
  {
    id: 4,
    label: 'Last Year',
    start: dayjs().subtract(1, 'year').startOf('year'),
    end: dayjs().subtract(1, 'year').endOf('year'),
  },
  {
    id: 5,
    label: 'Custom Range',
    start: null,
    end: null,
  },
];

export default function RangeSelect(props) {
  const { range, setRange } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOptionClick = (option) => {
    setRange(option);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <IconButton onClick={handleClick}>
        <CalendarMonthIcon />
      </IconButton>
      <Typography variant='body1'>{range.label}</Typography>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List disablePadding>
          {map(RANGE_OPTIONS, (option) => (
            <ListItemButton
              key={option.id}
              onClick={() => handleOptionClick(option)}
            >
              <ListItemText primary={option.label} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </div>
  );
}

export { RANGE_OPTIONS };
