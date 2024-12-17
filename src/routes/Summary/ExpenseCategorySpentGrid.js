import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import LabelValueButton from '../../components/LabelValueButton';
import ExpenseSubcategorySpentGrid from './ExpenseSubategorySpentGrid';

export default function ExpenseCategorySpentGrid(props) {
  const {
    category,
    value,
    expenses,
    subcategories,
    selectedCategory,
    setSelectedCategory,
  } = props;
  const dispatch = useDispatch();

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const handleClick = () => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <>
      <LabelValueButton
        key={category}
        label={category}
        value={value}
        onClick={handleClick}
        Icon={selectedCategory === category ? ExpandLessIcon : ExpandMoreIcon}
      />
      {selectedCategory === category && (
        <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
          <Typography variant='body1' color='text.secondary' align='center'>
            TODO: Category Summary
          </Typography>
        </Grid>
      )}
      {selectedCategory === category && (
        <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => openTransactionsDialog(category, expenses)}
          >
            show all
          </Button>
        </Grid>
      )}

      {selectedCategory === category && (
        <Grid
          item
          xs={12}
          display='flex'
          justifyContent='center'
          mx={1}
          pt='0 !important'
        >
          <Grid container spacing={1} mt={0}>
            <Grid item xs={12} mx={1}>
              <Typography variant='h6' color='text.secondary' align='center'>
                subcategories
              </Typography>
            </Grid>
            {subcategories.map((subcategory) => {
              const { name, value, expenses } = subcategory;
              let label = name || 'none';
              if (
                selectedSubcategory === name ||
                selectedSubcategory === null
              ) {
                return (
                  <ExpenseSubcategorySpentGrid
                    key={label}
                    subcategory={name}
                    value={value}
                    expenses={expenses}
                    selectedSubcategory={selectedSubcategory}
                    setSelectedSubcategory={setSelectedSubcategory}
                  />
                );
              } else return null;
            })}
          </Grid>
        </Grid>
      )}
    </>
  );
}
