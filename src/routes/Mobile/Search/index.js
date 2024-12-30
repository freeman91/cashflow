import React, { useState } from 'react';

import useTheme from '@mui/material/styles/useTheme';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';

import Expenses from './Expenses';
import Incomes from './Incomes';
import CustomAppBar from '../../../components/CustomAppBar';
import RangeSelect, {
  RANGE_OPTIONS,
} from '../../../components/Selector/RangeSelect';

const EXPENSES = 'expenses';
const INCOMES = 'incomes';

const CustomChip = (props) => {
  const { selected, setSelected, value } = props;
  const theme = useTheme();

  return (
    <Chip
      variant={selected === value ? 'filled' : 'outlined'}
      key={value}
      label={value}
      onClick={() => setSelected(value)}
      sx={{
        backgroundColor:
          selected === value ? theme.palette.primary.main : 'transparent',
        color:
          selected === value
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
        borderColor: 'transparent',
      }}
    />
  );
};

export default function Search() {
  const [mainFilter, setMainFilter] = useState('');
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
  const [selected, setSelected] = useState(EXPENSES);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <CustomAppBar
        right={
          <IconButton
            size='medium'
            onClick={() => setFilterDialogOpen(true)}
            color='info'
          >
            <FilterAltIcon />
          </IconButton>
        }
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='center'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <Grid item xs={12} mx={1}>
          <Paper
            component='form'
            sx={{
              p: '0px 2px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <IconButton sx={{ px: '10px' }} color='info'>
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder='search'
              value={mainFilter}
              onChange={(e) => setMainFilter(e.target.value)}
            />
            <IconButton onClick={() => setMainFilter('')} color='info'>
              <ClearIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item xs={3} display='flex' alignItems='center'>
          <Box sx={{ ml: 1 }} />
          <CustomChip
            selected={selected}
            setSelected={setSelected}
            value={EXPENSES}
          />
        </Grid>
        <Grid item xs={3}>
          <CustomChip
            selected={selected}
            setSelected={setSelected}
            value={INCOMES}
          />
        </Grid>
        <Grid item xs={6}>
          <RangeSelect range={range} setRange={setRange} />
        </Grid>
        {selected === EXPENSES && (
          <Expenses
            range={range}
            filterDialogOpen={filterDialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            mainFilter={mainFilter}
          />
        )}
        {selected === INCOMES && (
          <Incomes
            range={range}
            filterDialogOpen={filterDialogOpen}
            setFilterDialogOpen={setFilterDialogOpen}
            mainFilter={mainFilter}
          />
        )}
      </Grid>
      <Grid item xs={12} mb={12} />
    </Box>
  );
}
