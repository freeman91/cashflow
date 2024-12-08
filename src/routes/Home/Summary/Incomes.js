import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';

import Grid from '@mui/material/Grid';
import { StyledSubtab, StyledSubtabs } from '../../../components/StyledSubtabs';
import PaycheckTotals from '../../../components/summary/PaycheckTotals';
import IncomeTotals from '../../../components/summary/IncomeTotals';

const PAYCHECKS = 'paychecks';
const INCOMES = 'incomes';
const TABS = [PAYCHECKS, INCOMES];

export default function Incomes(props) {
  const { year, month } = props;

  const allIncomes = useSelector((state) => state.incomes.data);
  const allPaychecks = useSelector((state) => state.paychecks.data);

  const [tab, setTab] = useState(PAYCHECKS);
  const [monthIncomes, setMonthIncomes] = useState([]);
  const [monthPaychecks, setMonthPaychecks] = useState([]);

  useEffect(() => {
    let _monthIncomes = filter(allIncomes, (income) => {
      const incomeDate = dayjs(income.date);
      return incomeDate.year() === year && month
        ? incomeDate.month() === month
        : true;
    });
    setMonthIncomes(_monthIncomes);
  }, [year, month, allIncomes]);

  useEffect(() => {
    let _monthPaychecks = filter(allPaychecks, (paycheck) => {
      if (!paycheck?.date) return false;
      const paycheckDate = dayjs(paycheck.date);
      return paycheckDate.year() === year && month
        ? paycheckDate.month() === month
        : true;
    });
    setMonthPaychecks(_monthPaychecks);
  }, [year, month, allPaychecks]);

  const changeTab = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Grid item xs={12} mx={1} display='flex' justifyContent='center'>
        <StyledSubtabs
          variant='fullWidth'
          sx={{ pb: 1, maxWidth: 400, width: '100%' }}
          value={tab}
          onChange={changeTab}
        >
          {TABS.map((_tab) => (
            <StyledSubtab key={_tab} label={_tab} value={_tab} />
          ))}
        </StyledSubtabs>
      </Grid>
      {tab === PAYCHECKS && <PaycheckTotals paychecks={monthPaychecks} />}
      {tab === INCOMES && <IncomeTotals incomes={monthIncomes} />}
      <Grid item xs={12} mx={1} pt='0px !important'></Grid>
    </>
  );
}
