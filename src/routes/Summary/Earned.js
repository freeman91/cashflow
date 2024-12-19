import React, { useEffect, useState } from 'react';
import sumBy from 'lodash/sumBy';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import IncomeSummary from './IncomeSummary';
import MenuItemContent from '../../components/MenuItemContent';

export default function Earned(props) {
  const {
    year,
    month,
    numMonths = 1,
    incomeSum,
    paycheckSum,
    groupedPaychecks,
    groupedIncomes,
  } = props;

  const [selected, setSelected] = useState({
    name: '',
    sum: 0,
    incomes: [],
  });

  useEffect(() => {
    if (paycheckSum > 0) {
      setSelected({
        name: 'paychecks',
        sum: paycheckSum,
        incomes: Object.values(groupedPaychecks).flat(),
      });
    } else if (incomeSum > 0) {
      setSelected({
        name: 'other incomes',
        sum: incomeSum,
        incomes: Object.values(groupedIncomes).flat(),
      });
    }
  }, [groupedPaychecks, paycheckSum, groupedIncomes, incomeSum]);

  if (paycheckSum === 0 && incomeSum === 0) {
    return null;
  }

  return (
    <>
      <Grid item xs={12} mx={1}>
        <Select
          fullWidth
          value={selected.name}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
              sx: { bgcolor: 'surface.300' },
            },
            slotProps: {
              paper: {
                sx: { minWidth: '300px !important', maxWidth: '350px' },
              },
            },
          }}
          sx={{ '& .MuiSelect-select': { py: 0, px: 2 } }}
        >
          {paycheckSum > 0 && (
            <MenuItem
              value='paychecks'
              onClick={() =>
                setSelected({
                  name: 'paychecks',
                  sum: paycheckSum,
                  incomes: Object.values(groupedPaychecks).flat(),
                })
              }
            >
              <MenuItemContent subheader name='paychecks' sum={paycheckSum} />
            </MenuItem>
          )}
          {paycheckSum > 0 && <Divider sx={{ my: '0 !important', mx: 1 }} />}
          {Object.entries(groupedPaychecks).map(([employer, paychecks]) => {
            const takeHome = sumBy(paychecks, 'take_home');
            return (
              <MenuItem
                key={employer}
                value={employer}
                onClick={() => {
                  setSelected({
                    name: employer,
                    sum: takeHome,
                    incomes: paychecks,
                  });
                }}
              >
                <MenuItemContent name={employer} sum={takeHome} indent={1} />
              </MenuItem>
            );
          })}
          {paycheckSum > 0 && <Divider sx={{ my: '0 !important', mx: 1 }} />}
          {incomeSum > 0 && (
            <MenuItem
              value='other incomes'
              onClick={() =>
                setSelected({
                  name: 'other incomes',
                  sum: incomeSum,
                  incomes: Object.values(groupedIncomes).flat(),
                })
              }
            >
              <MenuItemContent subheader name='other incomes' sum={incomeSum} />
            </MenuItem>
          )}
          {incomeSum > 0 && <Divider sx={{ my: '0 !important', mx: 1 }} />}
          {Object.entries(groupedIncomes).map(([category, incomes]) => {
            const sum = sumBy(incomes, 'amount');
            return (
              <MenuItem
                key={category}
                value={category}
                onClick={() => {
                  setSelected({
                    name: category,
                    sum: sum,
                    incomes,
                  });
                }}
              >
                <MenuItemContent name={category} sum={sum} indent={1} />
              </MenuItem>
            );
          })}
        </Select>
      </Grid>
      <IncomeSummary
        year={year}
        month={month}
        numMonths={numMonths}
        label={selected.name}
        incomes={selected.incomes}
        sum={selected.sum}
      />
    </>
  );
}
