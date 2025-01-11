import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { postRecurring, putRecurring } from '../../store/recurrings';
import TextFieldListItem from '../../components/List/TextFieldListItem';
import IntegerFieldListItem from '../../components/List/IntegerFieldListItem';

export default function RecurringDrawer(props) {
  const { mode, recurring, setSelectedRecurring } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!!recurring);
  }, [recurring]);

  const onClose = () => {
    setOpen(false);
    setSelectedRecurring(null);
  };

  const handleChange = (key, value) => {
    setSelectedRecurring({ ...recurring, [key]: value });
  };

  const handleSubmit = () => {
    if (mode === 'create') {
      dispatch(postRecurring(recurring));
    } else {
      dispatch(putRecurring(recurring));
    }
    onClose();
  };

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100%',
          position: 'relative',
        }}
        role='presentation'
      >
        <List sx={{ px: 2 }}>
          <ListItem>
            <ListItemText
              primary='Edit Recurring Item'
              slotProps={{
                primary: { align: 'center' },
              }}
            />
          </ListItem>
          <TextFieldListItem
            id='name'
            label='Name'
            value={recurring?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          {mode === 'create' && (
            <TextFieldListItem
              disabled
              id='item_type'
              label='Item Type'
              value={recurring?.item_type || ''}
            />
          )}

          <ListItem disableGutters>
            <FormControl fullWidth>
              <InputLabel>Frequency</InputLabel>
              <Select
                variant='standard'
                fullWidth
                value={recurring?.frequency || ''}
                onChange={(e) => {
                  handleChange('frequency', e.target.value);
                }}
                displayEmpty
                MenuProps={{
                  MenuListProps: {
                    disablePadding: true,
                    sx: {
                      '& .MuiPaper-root': { minWidth: 'unset' },
                    },
                  },
                  slotProps: {
                    paper: {
                      sx: {
                        minWidth: 'unset !important',
                      },
                    },
                  },
                }}
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
              >
                {['weekly', 'monthly', 'yearly'].map((day) => (
                  <MenuItem key={day} value={day}>
                    <ListItemText primary={day} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
          <IntegerFieldListItem
            id='interval'
            label='Interval'
            item={recurring}
            setItem={setSelectedRecurring}
            startAdornment={null}
          />
          <IntegerFieldListItem
            id='day_of_week'
            label='Day of Week'
            item={recurring}
            setItem={setSelectedRecurring}
            startAdornment={null}
          />
          <IntegerFieldListItem
            id='day_of_month'
            label='Day of Month'
            item={recurring}
            setItem={setSelectedRecurring}
            startAdornment={null}
          />
          <IntegerFieldListItem
            id='month_of_year'
            label='Month of Year'
            item={recurring}
            setItem={setSelectedRecurring}
            startAdornment={null}
          />
          <ListItem disableGutters>
            <DatePicker
              label='Next Date'
              slotProps={{
                textField: { variant: 'standard', fullWidth: true },
                field: {
                  clearable: true,
                  onClear: () =>
                    setSelectedRecurring((prev) => ({
                      ...prev,
                      next_date: null,
                    })),
                },
              }}
              value={dayjs(recurring?.next_date)}
              onChange={(newValue) => handleChange('next_date', newValue)}
            />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          {recurring?.item_type === 'expense' && (
            <ListItemText
              primary='Expense Attributes'
              slotProps={{ primary: { align: 'center' } }}
            />
          )}
          {recurring?.item_type === 'repayment' && (
            <ListItemText
              primary='Repayment Attributes'
              slotProps={{ primary: { align: 'center' } }}
            />
          )}
          {recurring?.item_type === 'paycheck' && (
            <ListItemText
              primary='Paycheck Attributes'
              slotProps={{ primary: { align: 'center' } }}
            />
          )}
          {recurring?.item_type === 'income' && (
            <ListItemText
              primary='Income Attributes'
              slotProps={{ primary: { align: 'center' } }}
            />
          )}

          <Divider sx={{ mt: 1, mb: 5 }} />
          <ListItem disableGutters sx={{ justifyContent: 'space-around' }}>
            <Button
              onClick={onClose}
              variant='outlined'
              color='info'
              sx={{ width: '45%' }}
            >
              cancel
            </Button>
            <Button
              type='submit'
              id='submit'
              variant='contained'
              color='primary'
              onClick={handleSubmit}
              sx={{ width: '45%' }}
            >
              submit
            </Button>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
