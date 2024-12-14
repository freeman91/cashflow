import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toLower from 'lodash/toLower';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

import { findId } from '../../../helpers/transactions';
import { getIncomes } from '../../../store/incomes';
import { getPaychecks } from '../../../store/paychecks';
import IncomesSummary from './IncomesSummary';
import FilterDialog from './FilterDialog';
import ItemBox from '../../../components/ItemBox';

export default function Incomes(props) {
  const { range, mainFilter, filterDialogOpen, setFilterDialogOpen } = props;

  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [typeFilter, setTypeFilter] = useState(['income', 'paycheck']);
  const [amountFilter, setAmountFilter] = useState({
    comparator: '',
    amount: '',
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  useEffect(() => {
    let _incomes = [...allIncomes, ...allPaychecks];

    // filter by date
    _incomes = filter(_incomes, (income) => {
      if (!income.date) return false;
      return dayjs(income.date).isBetween(range.start, range.end);
    });

    // filter by type
    _incomes = filter(_incomes, (income) => {
      return includes(typeFilter, income._type);
    });

    // filter by amount
    if (amountFilter.comparator && amountFilter.amount) {
      _incomes = filter(_incomes, (income) => {
        const filterAmount = Number(amountFilter.amount);
        const amount = (() => {
          if (income._type === 'income') {
            return income.amount;
          } else if (income._type === 'paycheck') {
            return get(income, 'take_home', 0);
          } else {
            return 0;
          }
        })();

        if (amountFilter.comparator === '>') {
          return amount > filterAmount;
        } else if (amountFilter.comparator === '<') {
          return amount < filterAmount;
        } else if (amountFilter.comparator === '=') {
          return amount === filterAmount;
        }
      });
    }

    // filter by main filter
    if (mainFilter) {
      _incomes = filter(_incomes, (income) => {
        return (
          income.source?.toLowerCase().includes(mainFilter.toLowerCase()) ||
          income.category?.toLowerCase().includes(mainFilter.toLowerCase())
        );
      });
    }

    // filter by category
    if (categoryFilter) {
      _incomes = filter(_incomes, (income) => {
        return income?.category === categoryFilter;
      });
    }

    // filter by source
    if (sourceFilter) {
      _incomes = filter(_incomes, (income) => {
        if (income._type === 'paycheck') {
          return includes(toLower(income.employer), toLower(sourceFilter));
        }
        return includes(toLower(income.source), toLower(sourceFilter));
      });
    }

    _incomes = sortBy(_incomes, 'date');
    setFilteredIncomes(_incomes);
  }, [
    allIncomes,
    allPaychecks,
    range,
    typeFilter,
    amountFilter,
    categoryFilter,
    sourceFilter,
    mainFilter,
  ]);

  useEffect(() => {
    dispatch(getIncomes({ range }));
    dispatch(getPaychecks({ range }));
  }, [range, dispatch]);

  return (
    <>
      <Grid item xs={12} mx={1}>
        <IncomesSummary incomes={filteredIncomes} />
      </Grid>

      {map(filteredIncomes, (income, idx) => {
        const key = findId(income);
        return (
          <Grid item xs={12} mx={1} key={key}>
            <Card sx={{ py: 0.5 }}>
              <ItemBox item={income} />
            </Card>
          </Grid>
        );
      })}
      <FilterDialog
        title='filter options'
        open={filterDialogOpen}
        setOpen={setFilterDialogOpen}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        amountFilter={amountFilter}
        setAmountFilter={setAmountFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
      />
    </>
  );
}
