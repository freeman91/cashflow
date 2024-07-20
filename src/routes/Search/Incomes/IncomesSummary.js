import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { ListItemValue } from '../../../components/List/ListItemValue';

export default function IncomesSummary(props) {
  const { incomes } = props;

  const [paycheckSum, setPaycheckSum] = useState(0);
  const [incomeSum, setIncomeSum] = useState(0);
  const [taxesSum, setTaxesSum] = useState(0);
  const [retirementSum, setRetirementSum] = useState(0);
  const [benefitsSum, setBenefitsSum] = useState(0);
  const [otherSum, setOtherSum] = useState(0);

  useEffect(() => {
    let paycheckSum = 0;
    let incomeSum = 0;
    let taxesSum = 0;
    let retirementSum = 0;
    let benefitsSum = 0;
    let otherSum = 0;

    incomes.forEach((income) => {
      if (income._type === 'paycheck') {
        paycheckSum += income.take_home;
        taxesSum += get(income, 'taxes', 0);
        retirementSum += get(income, 'retirement', 0);
        benefitsSum += get(income, 'benefits', 0);
        otherSum += get(income, 'other', 0);
      } else if (income._type === 'income') {
        incomeSum += income.amount;
      }
    });

    setPaycheckSum(paycheckSum);
    setIncomeSum(incomeSum);
    setTaxesSum(taxesSum);
    setRetirementSum(retirementSum);
    setBenefitsSum(benefitsSum);
    setOtherSum(otherSum);
  }, [incomes]);

  return (
    <Card raised sx={{ mt: 1 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
        <Stack
          spacing={1}
          direction='row'
          justifyContent='space-between'
          sx={{ alignItems: 'flex-start' }}
        >
          <List disablePadding sx={{ width: '100%' }}>
            <ListItemValue
              label='gross income'
              value={
                paycheckSum +
                taxesSum +
                retirementSum +
                benefitsSum +
                otherSum +
                incomeSum
              }
              fontWeight='bold'
            />
            <ListItemValue
              label='net income'
              value={paycheckSum + incomeSum}
              fontWeight='bold'
            />
            <Divider />
            <ListItemText
              secondary='paychecks'
              secondaryTypographyProps={{ fontWeight: 'bold' }}
            />
            <ListItemValue label='take home' value={paycheckSum} />
            <ListItemValue label='taxes' value={taxesSum} />
            <ListItemValue label='retirement' value={retirementSum} />
            <ListItemValue label='benefits' value={benefitsSum} />
            <ListItemValue label='other' value={otherSum} />
            <Divider />
            <ListItemValue label='other income' value={incomeSum} />
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}
