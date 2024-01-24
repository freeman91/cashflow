import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from './TypeFilter';
import AmountFilter from './AmountFilter';
import StringFilter from './StringFilter';
import BillSelect from '../../../components/Selector/BillSelect';

export default function FilterOptions(props) {
  const {
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

  return (
    <Card raised sx={{ mb: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <Grid container spacing={1}>
          <Grid item md={6}>
            <RangeSelect range={range} setRange={setRange} />
          </Grid>
          <Grid item md={6}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography
                variant='body1'
                sx={{ mr: 1, cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
              >
                filter
              </Typography>
              <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Grid>
          {expanded && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TypeFilter
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  options={['expense', 'repayment']}
                />
              </Grid>

              <Grid item xs={12}>
                <TypeFilter
                  typeFilter={pendingFilter}
                  setTypeFilter={setPendingFilter}
                  options={['pending', 'paid']}
                />
              </Grid>

              <Grid item xs={12}>
                <AmountFilter
                  amountFilter={amountFilter}
                  setAmountFilter={setAmountFilter}
                />
              </Grid>

              <Grid item xs={12}>
                <StringFilter
                  label='category'
                  disabled={false}
                  stringFilter={categoryFilter}
                  setStringFilter={setCategoryFilter}
                  options={categories}
                />
              </Grid>

              <Grid item xs={12}>
                <StringFilter
                  label='subcategory'
                  disabled={!subcategories.length}
                  stringFilter={subcategoryFilter}
                  setStringFilter={setSubcategoryFilter}
                  options={subcategories}
                />
              </Grid>

              <Grid item xs={12}>
                <StringFilter
                  label='vendor'
                  disabled={false}
                  stringFilter={vendorFilter}
                  setStringFilter={setVendorFilter}
                  options={expenseVendors.options}
                />
              </Grid>

              <Grid item xs={12}>
                <BillSelect resource={billFilter} setResource={setBillFilter} />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}
