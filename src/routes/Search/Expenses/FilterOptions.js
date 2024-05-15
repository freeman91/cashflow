import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import reduce from 'lodash/reduce';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from '../../../components/FilterOptions/TypeFilter';
import AmountFilter from '../../../components/FilterOptions/AmountFilter';
import StringFilter from '../../../components/FilterOptions/StringFilter';
import BillSelect from '../../../components/Selector/BillSelect';
import { numberToCurrency } from '../../../helpers/currency';

export default function FilterOptions(props) {
  const {
    total,
    expenses,
    range,
    setRange,
    typeFilter,
    setTypeFilter,
    amountFilter,
    setAmountFilter,
    categoryFilter,
    setCategoryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    vendorFilter,
    setVendorFilter,
    billFilter,
    setBillFilter,
    pendingFilter,
    setPendingFilter,
  } = props;
  const optionLists = useSelector((state) => state.optionLists.data);
  const categoriesData = useSelector((state) => state.categories.data);

  const [expanded, setExpanded] = useState(false);
  const [principalSum, setPrincipleSum] = useState(0);
  const [interestSum, setInterestSum] = useState(0);
  const [escrowSum, setEscrowSum] = useState(0);
  const [repayments, setRepayments] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const expenseVendors = find(optionLists, { option_type: 'expense_vendor' });

  useEffect(() => {
    setExpenseCategories(
      find(categoriesData, {
        category_type: 'expense',
      })
    );
  }, [categoriesData]);

  useEffect(() => {
    setCategories(
      map(expenseCategories?.categories, (category) => {
        return category.name;
      })
    );
  }, [expenseCategories]);

  useEffect(() => {
    let _category = find(expenseCategories?.categories, {
      name: categoryFilter,
    });

    setSubcategories(get(_category, 'subcategories', []));
  }, [categoryFilter, expenseCategories]);

  useEffect(() => {
    let _repayments = filter(
      expenses,
      (expense) => expense._type === 'repayment'
    );

    setRepayments(
      map(_repayments, (repayment) => {
        const principal = get(repayment, 'principal', 0);
        const interest = get(repayment, 'interest', 0);
        const escrow = get(repayment, 'escrow', 0);
        return { ...repayment, amount: principal + interest + escrow };
      })
    );
  }, [expenses]);

  useEffect(() => {
    setPrincipleSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'principal', 0),
        0
      )
    );
    setInterestSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'interest', 0),
        0
      )
    );
    setEscrowSum(
      reduce(
        repayments,
        (sum, repayment) => sum + get(repayment, 'escrow', 0),
        0
      )
    );
  }, [repayments]);

  return (
    <Card raised sx={{ mb: 1 }}>
      <CardHeader
        disableTypography
        sx={{
          pt: 0,
          pb: 0,
          pl: 2,
          pr: 3,
          '& .MuiCardHeader-action': { alignSelf: 'center' },
        }}
        title={
          <ListItem disableGutters disablePadding sx={{ width: '60%' }}>
            <ListItemText
              primary='expenses'
              primaryTypographyProps={{ variant: 'h5' }}
            />
            <ListItemText
              primary={numberToCurrency.format(total)}
              primaryTypographyProps={{
                sx: { fontWeight: 800 },
                align: 'right',
              }}
            />
          </ListItem>
        }
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
                <ListItemText
                  primary='repayment totals'
                  primaryTypographyProps={{ align: 'center' }}
                />
              </ListItem>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='principal' />
                <ListItemText
                  primary={numberToCurrency.format(principalSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='interest' />
                <ListItemText
                  primary={numberToCurrency.format(interestSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <ListItem sx={{ pt: 0, pb: 0 }}>
                <ListItemText primary='escrow' />
                <ListItemText
                  primary={numberToCurrency.format(escrowSum)}
                  primaryTypographyProps={{
                    sx: { fontWeight: 800 },
                    align: 'right',
                  }}
                />
              </ListItem>
              <Divider sx={{ pt: 4 }} />
              <ListItem sx={{ pt: 4 }}>
                <TypeFilter
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  options={['expense', 'repayment']}
                />
              </ListItem>
              <ListItem>
                <TypeFilter
                  typeFilter={pendingFilter}
                  setTypeFilter={setPendingFilter}
                  options={['pending', 'paid']}
                />
              </ListItem>
            </List>
            <List disablePadding sx={{ width: '100%', maxWidth: 350 }}>
              <ListItem>
                <AmountFilter
                  amountFilter={amountFilter}
                  setAmountFilter={setAmountFilter}
                />
              </ListItem>
              <ListItem>
                <StringFilter
                  label='category'
                  disabled={false}
                  stringFilter={categoryFilter}
                  setStringFilter={setCategoryFilter}
                  options={categories}
                />
              </ListItem>
              <ListItem>
                <StringFilter
                  label='subcategory'
                  disabled={!subcategories.length}
                  stringFilter={subcategoryFilter}
                  setStringFilter={setSubcategoryFilter}
                  options={subcategories}
                />
              </ListItem>
              <ListItem>
                <StringFilter
                  label='vendor'
                  disabled={false}
                  stringFilter={vendorFilter}
                  setStringFilter={setVendorFilter}
                  options={expenseVendors.options}
                />
              </ListItem>
              <ListItem>
                <BillSelect resource={billFilter} setResource={setBillFilter} />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      )}
    </Card>
  );
}
