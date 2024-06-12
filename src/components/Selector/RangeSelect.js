import React, { useState } from 'react';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';
import map from 'lodash/map';

import { useMediaQuery } from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [customRange, setCustomRange] = useState({});

  const handleOptionClick = (option) => {
    if (option.id === 5) {
      setOpen(true);
    } else {
      setRange(option);
    }
    handleClose();
  };

  const handleSelectDay = (day, attr) => {
    if (attr === 'start') {
      day = day?.startOf('day');
    } else {
      day = day?.endOf('day');
    }

    const _customRange = cloneDeep(customRange);
    setCustomRange({
      ..._customRange,
      [attr]: day,
    });
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    setRange({
      id: 5,
      label: `${dayjs(customRange.start).format('MMM D')} - ${dayjs(
        customRange.end
      ).format('MMM D')}`,
      start: customRange.start,
      end: customRange.end,
    });
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={handleClick} sx={{ mr: 2 }}>
        <CalendarMonthIcon />
      </IconButton>
      <Typography
        variant='body1'
        onClick={handleClick}
        sx={{ cursor: 'pointer', pt: '4px' }}
      >
        {range.label}
      </Typography>
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
              sx={{ pt: '4px', pb: 0 }}
            >
              <ListItemText primary={option.label} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <Stack direction='column' spacing={2}>
            <DatePicker
              openTo='month'
              views={['year', 'month', 'day']}
              label='Start'
              value={dayjs(customRange.start)}
              onChange={(newValue) => handleSelectDay(newValue, 'start')}
              slotProps={{
                textField: {
                  variant: 'standard',
                  inputProps: {
                    readOnly: true,
                  },
                },
              }}
            />
            <DatePicker
              openTo='month'
              views={['year', 'month', 'day']}
              label='End'
              value={dayjs(customRange.end)}
              minDate={dayjs(customRange.start)}
              onChange={(newValue) => {
                handleSelectDay(newValue, 'end');
              }}
              slotProps={{
                textField: {
                  variant: 'standard',
                  inputProps: {
                    readOnly: true,
                  },
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={
              customRange.start === undefined || customRange.end === undefined
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export { RANGE_OPTIONS };
