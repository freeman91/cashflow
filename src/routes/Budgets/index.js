import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import find from 'lodash/find';
import reduce from 'lodash/reduce';

import useMediaQuery from '@mui/material/useMediaQuery';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';

import useIncomes from '../../store/hooks/useIncomes';
import useExpenses from '../../store/hooks/useExpenses';
import useSales from '../../store/hooks/useSales';
import usePurchases from '../../store/hooks/usePurchases';
import { findAmount } from '../../helpers/transactions';
import { numberToCurrency } from '../../helpers/currency';

export default function Budgets() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const [date, setDate] = useState(dayjs());
  const categoriesItem = useSelector((state) => {
    return find(state.categories.data, { category_type: 'expense' });
  });

  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
      setExpenseCategories(categoriesItem?.categories || []);
    }, [categoriesItem]);

  // Get transaction data from state
  const { incomes: allIncomes, sum: incomesSum } = useIncomes(date.year(), date.month());
  const { expenses: allExpenses, sum: expensesSum, principalSum } = useExpenses(date.year(), date.month());
  const { sales: allSales, sum: salesSum } = useSales(date.year(), date.month());
  const { purchases: allPurchases, sum: purchasesSum } = usePurchases(date.year(), date.month());

  // Filter transactions for the current month (both pending and actual)
  const midMonth = date.date(15);
  const monthIncomes = allIncomes.filter((income) => {
    const incomeDate = dayjs(income.date);
    return incomeDate.isSame(midMonth, 'month');
  });
  
  const monthSales = allSales.filter((sale) => {
    const saleDate = dayjs(sale.date);
    return saleDate.isSame(midMonth, 'month');
  });

  // Separate pending and actual incomes
  const actualIncomes = monthIncomes.filter(income => !income.pending);
  const pendingIncomes = monthIncomes.filter(income => income.pending);

  // Calculate paycheck amounts
  const paycheckActual = actualIncomes
    .filter(income => income._type === 'paycheck')
    .reduce((sum, paycheck) => sum + findAmount(paycheck), 0);
    
  const paycheckPending = pendingIncomes
    .filter(income => income._type === 'paycheck')
    .reduce((sum, paycheck) => sum + findAmount(paycheck), 0);

  // Calculate other income amounts (non-passive income categories + capital gains)
  const otherIncomeActual = actualIncomes
    .filter(income => income._type === 'income' && !['dividend', 'interest', 'rental', 'royalties'].includes(income.category))
    .reduce((sum, income) => sum + findAmount(income), 0) +
    monthSales.filter(sale => !sale.pending && sale.gains > 0).reduce((sum, sale) => sum + (sale.gains || 0), 0);
    
  const otherIncomePending = pendingIncomes
    .filter(income => income._type === 'income' && !['dividend', 'interest', 'rental', 'royalties'].includes(income.category))
    .reduce((sum, income) => sum + findAmount(income), 0) +
    monthSales.filter(sale => sale.pending && sale.gains > 0).reduce((sum, sale) => sum + (sale.gains || 0), 0);

  // Calculate total income amounts
  const totalIncomeActual = paycheckActual + otherIncomeActual;
  const totalIncomePending = paycheckPending + otherIncomePending;

  // Calculate passive income amounts (dividends, interest, rental, royalties)
  const passiveIncomeActual = actualIncomes
    .filter(income => income._type === 'income' && ['dividend', 'interest', 'rental', 'royalties'].includes(income.category))
    .reduce((sum, income) => sum + findAmount(income), 0);
    
  const passiveIncomePending = pendingIncomes
    .filter(income => income._type === 'income' && ['dividend', 'interest', 'rental', 'royalties'].includes(income.category))
    .reduce((sum, income) => sum + findAmount(income), 0);

  // For investments, we'll consider passive incomes as investments for now
  const investmentsActual = passiveIncomeActual;
  const investmentsPending = passiveIncomePending;

  // Calculate expense totals by category
  const expenseTotalsByCategory = reduce(
    allExpenses,
    (acc, expense) => {
      const category = expense.category || 'Other';
      acc[category] = (acc[category] || 0) + findAmount(expense);
      return acc;
    },
    {}
  );

  // Add repayments and losses to expenses (repayments are already included in expensesSum from useExpenses)
  const totalLossAmount = monthSales
    .filter(sale => (sale.losses || 0) > 0)
    .reduce((sum, sale) => sum + (sale.losses || 0), 0);

  // Calculate total expenses (expensesSum already includes repayments)
  const totalExpensesActual = expensesSum + totalLossAmount;

  // Build income items with actual data
  const incomeItems = [
    { 
      name: 'Paycheck', 
      pending: paycheckPending,
      budget: 5000, // TODO: get from budget data
      actual: paycheckActual 
    },
    { 
      name: 'Other', 
      pending: otherIncomePending, 
      budget: 200, 
      actual: otherIncomeActual 
    },
    { 
      name: 'Total', 
      pending: totalIncomePending, 
      budget: 5200, 
      actual: totalIncomeActual 
    },
  ];

  // Build investment items
  const investmentItems = [
    { 
      name: 'Total', 
      pending: investmentsPending, 
      budget: 1000, 
      actual: investmentsActual 
    },
  ];

  // Build expense items by category
  const expenseItems = expenseCategories.map((category) => ({
    name: category.name,
    pending: 0,
    budget: 500, // TODO: get from budget data
    actual: expenseTotalsByCategory[category.name] || 0,
  }));

  // Add total row for expenses
  expenseItems.push({
    name: 'Total',
    pending: 0,
    budget: expenseCategories.length * 500, // TODO: get from budget data
    actual: totalExpensesActual,
  });

  const renderSummaryTable = () => (
    <Box sx={{ mb: 4 }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">pending</TableCell>
              <TableCell align="right">budget</TableCell>
              <TableCell align="right">actual</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Income Section */}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: 'surface.300' }}>
                Income
              </TableCell>
            </TableRow>
            {incomeItems.map((item) => (
              <TableRow key={`income-${item.name}`}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{numberToCurrency.format(item.pending)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.budget)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.actual)}</TableCell>
              </TableRow>
            ))}

            {/* Investments Section */}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: 'surface.300' }}>
                Investments
              </TableCell>
            </TableRow>
            {investmentItems.map((item) => (
              <TableRow key={`investment-${item.name}`}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{numberToCurrency.format(item.pending)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.budget)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.actual)}</TableCell>
              </TableRow>
            ))}

            {/* Expenses Section */}
            <TableRow>
              <TableCell colSpan={4} sx={{ fontWeight: 'bold', backgroundColor: 'surface.300' }}>
                Expenses
              </TableCell>
            </TableRow>
            {expenseItems.map((item) => (
              <TableRow key={`expense-${item.name}`}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{numberToCurrency.format(item.pending)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.budget)}</TableCell>
                <TableCell align="right">{numberToCurrency.format(item.actual)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        mx: 2,
      }}
    >
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-start',
            alignItems: 'center',
            gap: 2,
            mx: 2,
          }}
        >
          <DatePicker
            size='medium'
            value={date}
            onChange={(value) => {
              setDate(value.date(15));
            }}
            format='MMMM YYYY'
            views={['month', 'year']}
            sx={{ width: 180 }}
            slotProps={{
              textField: {
                variant: 'standard',
                InputProps: { disableUnderline: true },
                inputProps: { style: { fontSize: 20 } },
              },
              inputAdornment: {
                position: 'start',
              },
            }}
          />
          <Box>
            <IconButton onClick={() => setDate(date.subtract(1, 'month'))}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => setDate(date.add(1, 'month'))}>
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      </Grid>

      {/* Budget Summary */}
      <Grid size={{ xs: 12 }}>
        {renderSummaryTable()}
      </Grid>

      {/* Section Components - Placeholders */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            border: '1px solid grey',
            borderRadius: 2,
            p: 2,
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='h6' align='center'>
            Income Section Component
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Box
          sx={{
            border: '1px solid grey',
            borderRadius: 2,
            p: 2,
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='h6' align='center'>
            Investments Section Component
          </Typography>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            border: '1px solid grey',
            borderRadius: 2,
            p: 2,
            minHeight: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant='h6' align='center'>
            Expenses Section Component
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
