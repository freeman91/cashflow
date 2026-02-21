import React from 'react';
import { useState } from 'react'; // Will be needed when WheelPickerDrawer is enabled
import cloneDeep from 'lodash/cloneDeep';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';

// Mobile version will use WheelPickerDrawer (commented out for now)
import WheelPickerDrawer from '../WheelPickerDrawer';

export default function SelectOption({ label, value, onChange, options = [] }) {
  // Mobile state management (currently unused since WheelPickerDrawer is commented out)
  const [pickerOpen, setPickerOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Mobile wheel picker handlers (currently unused since WheelPickerDrawer is commented out)
  const handleWheelPickerSelect = (selectedValue) => {
    onChange(selectedValue);
    setPickerOpen(false);
  };

  const handleMobileSelect = () => {
    setPickerOpen(true);
  };

  // Convert options to wheel picker format
  const wheelPickerOptions = [
    { label: '', value: 'none' },
    ...options.map((option) => ({
      label: option,
      value: option,
    })),
  ];

  const sortedOptions = cloneDeep(options).sort();

  // Mobile version with wheel picker (commented out for now)
  if (isMobile) {
    const selectedOption = wheelPickerOptions.find(
      (opt) => opt.value === value
    );
    const displayValue = selectedOption ? selectedOption.value : 'none';

    return (
      <>
        <ListItem disableGutters>
          <FormControl variant='standard' fullWidth>
            <InputLabel id={`${label}-label`}>{label}</InputLabel>
            <Button
              onClick={handleMobileSelect}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                padding: '8px 0',
                minHeight: '32px',
                color: 'text.primary',
                borderBottom: '1px solid',
                borderColor: 'divider',
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                },
                '&:focus': {
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                },
              }}
            >
              <em
                style={{
                  fontStyle: displayValue === 'none' ? 'italic' : 'normal',
                }}
              >
                {displayValue}
              </em>
            </Button>
          </FormControl>
        </ListItem>

        {/* WheelPickerDrawer - commented out for now */}

        <WheelPickerDrawer
          open={pickerOpen}
          onClose={() => setPickerOpen(false)}
          options={wheelPickerOptions}
          selectedValue={value || 'none'}
          onSelect={handleWheelPickerSelect}
          height='40%'
          confirmText='Select'
          cancelText='Cancel'
          showButtons={true}
        />
      </>
    );
  }

  // Desktop version with regular select
  return (
    <ListItem disableGutters>
      <FormControl variant='standard' fullWidth>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          value={value}
          onChange={handleChange}
          label={label}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: {
                bgcolor: 'surface.300',
                '& .MuiPaper-root': {
                  minWidth: 'unset',
                  borderRadius: 1,
                  overflow: 'hidden',
                },
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
            backgroundColor: 'unset',
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
            },
          }}
        >
          <MenuItem value=''>
            <em>none</em>
          </MenuItem>
          {!sortedOptions.includes(value) && (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          )}
          {sortedOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </ListItem>
  );
}
