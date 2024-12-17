import React from 'react';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { openDialog } from '../../store/dialogs';
import LabelValueButton from '../../components/LabelValueButton';

export default function ExpenseSubcategorySpentGrid(props) {
  const {
    subcategory,
    value,
    expenses,
    selectedSubcategory,
    setSelectedSubcategory,
  } = props;
  const dispatch = useDispatch();

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
    if (selectedSubcategory === subcategory) {
      setSelectedSubcategory(null);
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  let label = subcategory || 'none';

  return (
    <>
      <LabelValueButton
        label={label}
        value={value}
        onClick={handleClick}
        Icon={
          selectedSubcategory === subcategory ? ExpandLessIcon : ExpandMoreIcon
        }
      />
      {selectedSubcategory === subcategory && (
        <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
          <Typography variant='body1' color='text.secondary' align='center'>
            TODO: Subcategory Summary
          </Typography>
        </Grid>
      )}
      {selectedSubcategory === subcategory && (
        <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
          <Button
            variant='outlined'
            color='primary'
            onClick={() => openTransactionsDialog(subcategory, expenses)}
          >
            show all
          </Button>
        </Grid>
      )}
    </>
  );
}
