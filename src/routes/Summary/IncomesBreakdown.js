import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import filter from 'lodash/filter';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { openDialog } from '../../store/dialogs';
import DataBox from '../../components/DataBox';

export default function IncomesBreakdown(props) {
  const dispatch = useDispatch();
  const { incomes } = props;

  const [takeHome, setTakeHome] = useState(0);
  const [retirement, setRetirement] = useState(0);
  const [benefits, setBenefits] = useState(0);
  const [taxes, setTax] = useState(0);
  const [other, setOther] = useState(0);
  const [otherIncomes, setOtherIncomes] = useState([]);

  useEffect(() => {
    let _takeHome = 0,
      _retirement = 0,
      _benefits = 0,
      _taxes = 0,
      _other = 0;

    const paychecks = filter(incomes, (income) => income._type === 'paycheck');
    paychecks.forEach((income) => {
      _takeHome += get(income, 'take_home', 0);
      _retirement += get(income, 'retirement', 0);
      _benefits += get(income, 'benefits', 0);
      _taxes += get(income, 'taxes', 0);
      _other += get(income, 'other', 0);
    });
    setTakeHome(_takeHome);
    setRetirement(_retirement);
    setBenefits(_benefits);
    setTax(_taxes);
    setOther(_other);

    let groupedIncomes = groupBy(
      filter(incomes, (income) => income._type === 'income'),
      'category'
    );
    groupedIncomes = map(groupedIncomes, (_incomes, category) => {
      return {
        category,
        amount: _incomes.reduce((acc, income) => acc + income.amount, 0),
        incomes: _incomes,
      };
    });
    setOtherIncomes(sortBy(groupedIncomes, 'amount').reverse());
  }, [incomes]);

  const handleOpenTransactions = (category, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        id: category,
        attrs: transactions,
      })
    );
  };

  return (
    <Stack
      spacing={1}
      direction='column'
      justifyContent='center'
      alignItems='center'
      sx={{ mt: 1 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
          paychecks
        </Typography>
        <IconButton
          onClick={() =>
            handleOpenTransactions(
              'paychecks',
              filter(incomes, (income) => income._type === 'paycheck')
            )
          }
        >
          <MenuIcon sx={{ width: 25, height: 25 }} />
        </IconButton>
      </Box>

      <DataBox label='take home' value={takeHome} />
      <DataBox label='retirement' value={retirement} />
      <DataBox label='benefits' value={benefits} />
      <DataBox label='taxes' value={taxes} />
      <DataBox label='other' value={other} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
          other incomes
        </Typography>
        <IconButton
          onClick={() =>
            handleOpenTransactions(
              'incomes',
              filter(incomes, (income) => income._type === 'income')
            )
          }
        >
          <MenuIcon sx={{ width: 25, height: 25 }} />
        </IconButton>
      </Box>

      {otherIncomes.map((income) => (
        <DataBox
          key={income.category}
          label={income.category}
          value={income.amount}
          onClick={() =>
            handleOpenTransactions(income.category, income.incomes)
          }
        />
      ))}
    </Stack>
  );
}
