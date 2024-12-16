import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import ExpenseCategorySpentGrid from './ExpenseCategorySpentGrid';
import LabelPercentBox from '../../components/LabelPercentBox';

export default function Spent(props) {
  const {
    groupedExpenses,
    repayments,
    expenseSum,
    principalSum,
    interestSum,
    escrowSum,
    incomeTotal,
  } = props;
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

  const total = expenseSum + principalSum + interestSum + escrowSum;
  return (
    <>
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card
          sx={{
            width: '100%',
            pl: 2,
            py: 0.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <LabelValueBox value={total} label='total' />
          <IconButton
            size='large'
            color='info'
            onClick={() => {
              setExpandedExpenses(!expandedExpenses);
              setSelectedCategory(null);
            }}
            sx={{ p: 0.75, mx: 1 }}
          >
            {expandedExpenses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Card>
      </Grid>
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
              if (selectedCategory === category || selectedCategory === null) {
                return (
                  <ExpenseCategorySpentGrid
                    key={category}
                    category={category}
                    value={value}
                    expenseTotal={total}
                    incomeTotal={incomeTotal}
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
      <Fade
        in={expandedExpenses === false && selectedCategory === null}
        unmountOnExit
      >
        <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
          <Card
            sx={{
              width: '100%',
              p: 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                '&:hover': {
                  backgroundColor: 'surface.250',
                },
                cursor: 'pointer',
                py: 0.5,
                px: 1,
                borderRadius: 1,
                flexGrow: 1,
              }}
              onClick={() => openTransactionsDialog('repayments', repayments)}
            >
              <LabelValueBox
                value={principalSum + interestSum + escrowSum}
                label='repayments'
              />
            </Box>
            <Box>
              <IconButton
                size='large'
                color='info'
                onClick={() => setExpandedRepayments(!expandedRepayments)}
                sx={{ p: 0.75, mr: 0.5 }}
              >
                {expandedRepayments ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
          </Card>
        </Grid>
      </Fade>
      <Fade
        in={expandedExpenses === false && selectedCategory === null}
        unmountOnExit
      >
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
              <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
                <Box sx={{ width: '100%', px: 2, py: 0.5 }}>
                  <LabelPercentBox
                    label='% of expenses'
                    value={principalSum + interestSum + escrowSum}
                    total={total}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
                <Box sx={{ width: '100%', px: 2, py: 0.5 }}>
                  <LabelPercentBox
                    label='% of income'
                    value={principalSum + interestSum + escrowSum}
                    total={incomeTotal}
                  />
                </Box>
              </Grid>
              {principalSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox value={principalSum} label='principal' />
                  </Card>
                </Grid>
              )}
              {interestSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox value={interestSum} label='interest' />
                  </Card>
                </Grid>
              )}
              {escrowSum > 0 && (
                <Grid item xs={12} mx={1}>
                  <Card sx={{ width: '100%', py: 0.5, px: 2 }}>
                    <LabelValueBox
                      value={escrowSum}
                      label='escrow'
                      textSize='small'
                    />
                  </Card>
                </Grid>
              )}
            </Grid>
          </Collapse>
        </Grid>
      </Fade>
    </>
  );
}
