import React, { useState } from 'react';
import get from 'lodash/get';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';

import { numberToCurrency } from '../../../helpers/currency';
import { useEffect } from 'react';

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
            <ListItem disableGutters disablePadding>
              <ListItemText
                primary='paychecks'
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='take home'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(paycheckSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='taxes'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(taxesSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='retirement'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(retirementSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='benefits'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(benefitsSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='other'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(otherSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <Divider />
            {otherSum > 0 && (
              <>
                <ListItem disableGutters disablePadding>
                  <ListItemText
                    sx={{ width: '30%' }}
                    secondary='other income'
                    secondaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                  <ListItemText
                    primary={numberToCurrency.format(incomeSum)}
                    primaryTypographyProps={{
                      fontWeight: 'bold',
                      align: 'right',
                    }}
                  />
                </ListItem>
                <Divider />
              </>
            )}

            <ListItem disableGutters disablePadding>
              <ListItemText
                primary='totals'
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='gross'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(
                  paycheckSum +
                    taxesSum +
                    retirementSum +
                    benefitsSum +
                    otherSum
                )}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText
                sx={{ width: '30%' }}
                secondary='net'
                secondaryTypographyProps={{ fontWeight: 'bold' }}
              />
              <ListItemText
                primary={numberToCurrency.format(paycheckSum + otherSum)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
          </List>
        </Stack>
      </CardContent>
    </Card>
  );
}
