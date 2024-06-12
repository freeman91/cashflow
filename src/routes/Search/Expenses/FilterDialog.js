import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import map from 'lodash/map';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import RangeSelect from '../../../components/Selector/RangeSelect';
import TypeFilter from '../../../components/FilterOptions/TypeFilter';
import AmountFilter from '../../../components/FilterOptions/AmountFilter';
import StringFilter from '../../../components/FilterOptions/StringFilter';
import BillSelect from '../../../components/Selector/BillSelect';
import DialogTitleOptions from '../../../components/Dialog/DialogTitleOptions';

export default function FilterDialog(props) {
  const {
    open,
    setOpen,
    title,
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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const optionLists = useSelector((state) => state.optionLists.data);
  const categoriesData = useSelector((state) => state.categories.data);

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

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <DialogTitle sx={{ pb: 0 }}>
        {title}
        <DialogTitleOptions mode={null} handleClose={handleClose} />
      </DialogTitle>
      <DialogContent
        sx={{
          minWidth: 300,
          pb: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <form style={{ width: '100%' }}>
          <List>
            <ListItem>
              <RangeSelect range={range} setRange={setRange} />
            </ListItem>
            <ListItem>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
