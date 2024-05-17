import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';
import get from 'lodash/get';
import reduce from 'lodash/reduce';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from '../../../components/FilterOptions/TypeFilter';
import AmountFilter from '../../../components/FilterOptions/AmountFilter';
import StringFilter from '../../../components/FilterOptions/StringFilter';
import { numberToCurrency } from '../../../helpers/currency';

export default function FilterOptions(props) {
  const {
    total,
    incomes,
    range,
    setRange,
    typeFilter,
    setTypeFilter,
    amountFilter,
    setAmountFilter,
    categoryFilter,
    setCategoryFilter,
    sourceFilter,
    setSourceFilter,
  } = props;
  const optionLists = useSelector((state) => state.optionLists.data);

  const [expanded, setExpanded] = useState(false);
  const [taxesSum, setTaxesSum] = useState(0);
  const [retirementSum, setRetirementSum] = useState(0);
  const [benefitsSum, setBenefitsSum] = useState(0);

  useEffect(() => {
    setTaxesSum(
      reduce(incomes, (sum, income) => sum + get(income, 'taxes', 0), 0)
    );
    setRetirementSum(
      reduce(incomes, (sum, income) => sum + get(income, 'retirement', 0), 0)
    );
    setBenefitsSum(
      reduce(incomes, (sum, income) => sum + get(income, 'benefits', 0), 0)
    );
  }, [incomes]);

  const incomeCategories = find(
    optionLists,
    { option_type: 'income_category' },
    []
  );
  const incomeSources = find(optionLists, { option_type: 'income_source' });

  return (
    <Card raised sx={{ mb: 1 }}>
      <CardHeader
        sx={{
          pt: 1,
          pb: 1,
          pl: 2,
          pr: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
        title={numberToCurrency.format(total)}
        action={
          <Stack direction='row' spacing={2}>
            <RangeSelect range={range} setRange={setRange} />
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Stack>
        }
      />
      {expanded && (
        <CardContent sx={{ p: 1, pt: 0, pb: '0px !important' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <List sx={{ width: '45%' }}>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='taxes' />
                <ListItemText
                  primary={numberToCurrency.format(taxesSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='retirement' />
                <ListItemText
                  primary={numberToCurrency.format(retirementSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='benefits' />
                <ListItemText
                  primary={numberToCurrency.format(benefitsSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <Divider sx={{ pt: 4 }} />
              <ListItem disableGutters>
                <TypeFilter
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  options={['income', 'paycheck']}
                />
              </ListItem>
            </List>
            <List disablePadding sx={{ width: '100%', maxWidth: 350 }}>
              <ListItem disableGutters>
                <AmountFilter
                  amountFilter={amountFilter}
                  setAmountFilter={setAmountFilter}
                />
              </ListItem>
              <ListItem disableGutters>
                <StringFilter
                  label='category'
                  disabled={false}
                  stringFilter={categoryFilter}
                  setStringFilter={setCategoryFilter}
                  options={[...incomeCategories.options, 'paycheck']}
                />
              </ListItem>
              <ListItem disableGutters>
                <StringFilter
                  label='source'
                  disabled={false}
                  stringFilter={sourceFilter}
                  setStringFilter={setSourceFilter}
                  options={incomeSources.options}
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      )}
      <CardContent sx={{ p: 1, pt: 0, pb: '0px !important' }}></CardContent>
    </Card>
  );
}
