import React from 'react';
import { useSelector } from 'react-redux';
import find from 'lodash/find';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import TypeFilter from '../../../components/FilterOptions/TypeFilter';
import AmountFilter from '../../../components/FilterOptions/AmountFilter';
import StringFilter from '../../../components/FilterOptions/StringFilter';
import DialogTitleOptions from '../../../components/Dialog/DialogTitleOptions';

export default function FilterDialog(props) {
  const {
    open,
    setOpen,
    title,
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

  const incomeCategories = find(optionLists, {
    option_type: 'income_category',
  });
  const sources = find(optionLists, { option_type: 'income_source' });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
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
              <TypeFilter
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                options={['income', 'paycheck']}
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
                options={incomeCategories?.options || []}
              />
            </ListItem>
            <ListItem>
              <StringFilter
                label='source'
                disabled={false}
                stringFilter={sourceFilter}
                setStringFilter={setSourceFilter}
                options={sources?.options || []}
              />
            </ListItem>
          </List>
        </form>
      </DialogContent>
    </Dialog>
  );
}
