import React from 'react';
import { useDispatch } from 'react-redux';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import LabelPercentBox from '../../components/LabelPercentBox';

export default function ExpenseCategorySpentGrid(props) {
  const {
    category,
    value,
    expenseTotal,
    incomeTotal,
    expenses,
    subcategories,
    selectedCategory,
    setSelectedCategory,
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
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <>
      <Grid key={category} item xs={12} mx={1}>
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
            onClick={() => openTransactionsDialog(category, expenses)}
          >
            <LabelValueBox label={category} value={value} />
          </Box>
          <Box>
            <IconButton
              size='large'
              color='info'
              onClick={handleClick}
              sx={{ p: 0.75, mr: 0.5 }}
            >
              {selectedCategory === category ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </IconButton>
          </Box>
        </Card>
      </Grid>
      {selectedCategory === category && (
        <>
          <Grid item xs={12} display='flex' justifyContent='center' mx={2}>
            <Box sx={{ width: '100%', px: 2, py: 0.5 }}>
              <LabelPercentBox
                label='% of expenses'
                value={value}
                total={expenseTotal}
              />
            </Box>
          </Grid>
          <Grid item xs={12} display='flex' justifyContent='center' mx={2}>
            <Box sx={{ width: '100%', px: 2, py: 0.5 }}>
              <LabelPercentBox
                label='% of income'
                value={value}
                total={incomeTotal}
              />
            </Box>
          </Grid>
        </>
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
              return (
                <Grid key={name} item xs={12} mx={1}>
                  <Card sx={{ width: '100%', p: 0.5 }}>
                    <Box
                      sx={{
                        '&:hover': {
                          backgroundColor: 'surface.250',
                        },
                        cursor: 'pointer',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                      }}
                      onClick={() => openTransactionsDialog(label, expenses)}
                    >
                      <LabelValueBox value={value} label={label} />
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      )}
    </>
  );
}
