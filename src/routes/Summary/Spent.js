import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import ExpenseCategorySpentGrid from './ExpenseCategorySpentGrid';
import LabelValueButton from '../../components/LabelValueButton';

export default function Spent(props) {
  const { groupedExpenses, repayments, principalSum, interestSum, escrowSum } =
    props;
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedExpenses, setExpandedExpenses] = useState(false);
  const [expandedRepayments, setExpandedRepayments] = useState(false);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  return (
    <>
      <LabelValueButton
        label='repayments'
        value={principalSum + interestSum + escrowSum}
        onClick={() => setExpandedRepayments(!expandedRepayments)}
        Icon={expandedRepayments ? ExpandLessIcon : ExpandMoreIcon}
      />
      <Fade in={expandedExpenses === false} unmountOnExit>
        <Grid
          item
          xs={12}
          display='flex'
          justifyContent='center'
          mx={1}
          pt='0 !important'
        >
          <Collapse
            in={expandedRepayments}
            timeout='auto'
            unmountOnExit
            sx={{ width: '100%' }}
          >
            <Grid container spacing={1} mt={0}>
              {principalSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox
                      value={principalSum}
                      label='principal'
                      textSize='small'
                    />
                  </Box>
                </Grid>
              )}
              {interestSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox
                      value={interestSum}
                      label='interest'
                      textSize='small'
                    />
                  </Box>
                </Grid>
              )}
              {escrowSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Box sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox
                      value={escrowSum}
                      label='escrow'
                      textSize='small'
                    />
                  </Box>
                </Grid>
              )}
              {repayments.length > 0 && (
                <Grid
                  item
                  xs={12}
                  mx={1}
                  display='flex'
                  justifyContent='center'
                >
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() =>
                      openTransactionsDialog('repayments', repayments)
                    }
                  >
                    show all
                  </Button>
                </Grid>
              )}
            </Grid>
          </Collapse>
        </Grid>
      </Fade>
      <LabelValueButton
        label='expenses by category'
        onClick={() => {
          setExpandedExpenses(!expandedExpenses);
        }}
        Icon={expandedExpenses ? ExpandLessIcon : ExpandMoreIcon}
      />
      <Fade in={expandedRepayments === false}>
        <Grid
          item
          xs={12}
          display='flex'
          justifyContent='center'
          mx={selectedCategory === null ? 1 : 0}
          pt='0 !important'
        >
          <Collapse in={expandedExpenses} timeout='auto' unmountOnExit>
            <Grid container spacing={1} mt={0}>
              {groupedExpenses.map((group) => {
                const { category, value, expenses, subcategories } = group;
                if (
                  selectedCategory === category ||
                  selectedCategory === null
                ) {
                  return (
                    <ExpenseCategorySpentGrid
                      key={category}
                      category={category}
                      value={value}
                      expenses={expenses}
                      subcategories={subcategories}
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  );
                } else return null;
              })}
            </Grid>
          </Collapse>
        </Grid>
      </Fade>
    </>
  );
}
