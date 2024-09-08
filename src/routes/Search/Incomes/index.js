import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import toLower from 'lodash/toLower';

import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';

import { findId } from '../../../helpers/transactions';
import { getIncomes } from '../../../store/incomes';
import { getPaychecks } from '../../../store/paychecks';
import RangeSelect, {
  RANGE_OPTIONS,
} from '../../../components/Selector/RangeSelect';
import IncomesSummary from './IncomesSummary';
import FilterDialog from './FilterDialog';
import TransactionBox from '../../../components/TransactionBox';

export default function Incomes() {
  const dispatch = useDispatch();
  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState(RANGE_OPTIONS[0]);
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
  ]);

  useEffect(() => {
    dispatch(getIncomes({ range }));
    dispatch(getPaychecks({ range }));
  }, [range, dispatch]);

  return (
    <>
      <Box sx={{ px: 1, mb: 1 }}>
        <Card
          raised
          sx={{
            p: 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <RangeSelect range={range} setRange={setRange} />
          <IconButton onClick={() => setOpen(true)}>
            <FilterListIcon />
          </IconButton>
        </Card>
        <IncomesSummary incomes={filteredIncomes} />
      </Box>
      <Card raised>
        <Stack spacing={1} direction='column' py={1}>
          {map(filteredIncomes, (income, idx) => {
            const key = findId(income);
            return (
              <React.Fragment key={key}>
                <TransactionBox transaction={income} />
                {idx < filteredIncomes.length - 1 && (
                  <Divider sx={{ mx: '8px !important' }} />
                )}
              </React.Fragment>
            );
          })}
        </Stack>
      </Card>
      <FilterDialog
        title='filter options'
        open={open}
        setOpen={setOpen}
        range={range}
        setRange={setRange}
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
