import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {
  TRANSACTION_TYPES,
  AMOUNT_FILTERS,
} from '../../store/hooks/useTransactionFilters';

export default function TransactionFilters({
  filters,
  setFilters,
  categories,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTypeChange = (event) => {
    const selectedTypes = event.target.value;
    // If all types are currently selected and user clicks one type,
    // select only that type
    if (
      filters.types.length === 0 ||
      filters.types.length === TRANSACTION_TYPES.length
    ) {
      const newTypes = TRANSACTION_TYPES.filter(
        (t) => !selectedTypes.includes(t.value)
      );
      setFilters({
        ...filters,
        types: [newTypes[0].value],
      });
    } else {
      // Normal selection behavior for other cases
      setFilters({
        ...filters,
        types: selectedTypes,
      });
    }
  };

  const handleAmountOperatorChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      amountOperator: event.target.value,
    }));
  };

  const handleAmountValueChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setFilters((prev) => ({
        ...prev,
        amountValue: value,
      }));
    }
  };

  const handleKeywordChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      keyword: event.target.value,
    }));
  };

  const handleCategoryChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      category: event.target.value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      types: [], // Empty array means show all types
      amountOperator: '',
      amountValue: '',
      keyword: '',
      category: '',
    });
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) =>
      key !== 'types' &&
      filters[key] !== '' &&
      (key !== 'types' || filters[key].length > 0) &&
      filters[key] !== undefined
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {hasActiveFilters && (
          <Typography variant='caption' color='text.secondary'>
            Filters active
          </Typography>
        )}
        <IconButton
          onClick={handleClick}
          color={hasActiveFilters ? 'primary' : 'default'}
        >
          <FilterListIcon />
        </IconButton>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            p: 2,
            minWidth: 400,
            maxWidth: 500,
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[16],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
          },
        }}
      >
        <Grid container spacing={3}>
          <Grid
            size={{ xs: 12 }}
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <FormControl size='small' sx={{ width: '80%' }}>
              <InputLabel>Type</InputLabel>
              <Select
                multiple
                variant='standard'
                value={
                  filters.types.length === 0
                    ? TRANSACTION_TYPES.map((t) => t.value)
                    : filters.types
                }
                onChange={handleTypeChange}
                label='Type'
                renderValue={(selected) => {
                  if (
                    selected.length === 0 ||
                    selected.length === TRANSACTION_TYPES.length
                  ) {
                    return 'All Types';
                  }
                  return selected
                    .map(
                      (type) =>
                        TRANSACTION_TYPES.find((t) => t.value === type)?.label
                    )
                    .join(', ');
                }}
              >
                {TRANSACTION_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                onClick={handleClearFilters}
                color='error'
                size='small'
              >
                <FilterListOffIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Amount</InputLabel>
                  <Select
                    variant='standard'
                    value={filters.amountOperator}
                    onChange={handleAmountOperatorChange}
                    label='Amount'
                  >
                    <MenuItem value=''>None</MenuItem>
                    {AMOUNT_FILTERS.expense.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size='small'
                  variant='standard'
                  type='number'
                  label='Value'
                  value={filters.amountValue || ''}
                  onChange={handleAmountValueChange}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size='small'
                  variant='standard'
                  label='Search Source/Merchant'
                  value={filters.keyword || ''}
                  onChange={handleKeywordChange}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size='small'>
                  <InputLabel>Category</InputLabel>
                  <Select
                    variant='standard'
                    value={filters.category || ''}
                    onChange={handleCategoryChange}
                    label='Category'
                  >
                    <MenuItem value=''>All Categories</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </Box>
  );
}
