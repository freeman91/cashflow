import React, { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from './TypeFilter';
import OptionListFilter from './OptionListFilter';

export default function FilterOptions(props) {
  const { range, setRange } = props;
  const [expanded, setExpanded] = useState(false);
  const [typeFilter, setTypeFilter] = useState('none');
  const [amountFilter, setAmountFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('none');
  const [vendorFilter, setVendorFilter] = useState(null);
  const [billFilter, setBillFilter] = useState(null);
  const [pendingFilter, setPendingFilter] = useState(null);

  return (
    <Grid container spacing={1}>
      <Grid item md={6} xs={12}>
        <RangeSelect range={range} setRange={setRange} />
      </Grid>
      <Grid item md={6} xs={12}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Typography variant='body1'>filter options</Typography>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Grid>
      {expanded && (
        <>
          <Grid item md={6} xs={12}>
            <TypeFilter
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              options={['none', 'expense', 'repayment']}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant='body1'>amount</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <OptionListFilter
              optionType={'expense_category'}
              filter={categoryFilter}
              setFilter={setCategoryFilter}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <OptionListFilter
              optionType={'expense_vendor'}
              filter={vendorFilter}
              setFilter={setVendorFilter}
            />
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant='body1'>bill</Typography>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant='body1'>pending</Typography>
          </Grid>
        </>
      )}
    </Grid>
  );
}
