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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from '../../../components/FilterOptions/TypeFilter';
import AmountFilter from '../../../components/FilterOptions/AmountFilter';
import StringFilter from '../../../components/FilterOptions/StringFilter';
import BillSelect from '../../../components/Selector/BillSelect';
import { numberToCurrency } from '../../../helpers/currency';

export default function FilterOptions(props) {
  const {
    total,
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
      <CardContent sx={{ p: 1, pt: 0, pb: '0px !important' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant='h6' sx={{ ml: 1 }}>
            {numberToCurrency.format(total)}
          </Typography>

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
        </Box>
        {expanded && (
          <>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <List disablePadding sx={{ width: '100%', maxWidth: 350 }}>
                <ListItem disableGutters>
                  <RangeSelect range={range} setRange={setRange} />
                </ListItem>
                <ListItem disableGutters>
                  <TypeFilter
                    typeFilter={typeFilter}
                    setTypeFilter={setTypeFilter}
                    options={['expense', 'repayment']}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <TypeFilter
                    typeFilter={pendingFilter}
                    setTypeFilter={setPendingFilter}
                    options={['pending', 'paid']}
                  />
                </ListItem>
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
                    options={categories}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <StringFilter
                    label='subcategory'
                    disabled={!subcategories.length}
                    stringFilter={subcategoryFilter}
                    setStringFilter={setSubcategoryFilter}
                    options={subcategories}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <StringFilter
                    label='vendor'
                    disabled={false}
                    stringFilter={vendorFilter}
                    setStringFilter={setVendorFilter}
                    options={expenseVendors.options}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <BillSelect
                    resource={billFilter}
                    setResource={setBillFilter}
                  />
                </ListItem>
              </List>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
