import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import PaycheckEarnedGrid from './PaycheckEarnedGrid';
import LabelValueButton from '../../components/LabelValueButton';

export default function Earned(props) {
  const { incomeSum, paycheckSum, groupedPaychecks, groupedIncomes } = props;
  const dispatch = useDispatch();

  const [expandedPaychecks, setExpandedPaychecks] = useState(false);
  const [expandedIncomes, setExpandedIncomes] = useState(false);

  const openTransactionsDialog = (title, transactions) => {
    dispatch(
      openDialog({
        type: 'transactions',
        attrs: transactions,
        id: title,
      })
    );
  };

  const sortedIncomeGroups = Object.keys(groupedIncomes)
    .map((group) => ({
      name: group,
      value: sumBy(groupedIncomes[group], 'amount'),
      transactions: groupedIncomes[group],
    }))
    .sort((a, b) => b.value - a.value);
  const paycheckEmployers = Object.keys(groupedPaychecks).sort();
  return (
    <>
      {paycheckEmployers.length > 0 && (
        <>
          <LabelValueButton
            label='paychecks'
            value={paycheckSum}
            onClick={() => setExpandedPaychecks(!expandedPaychecks)}
            Icon={expandedPaychecks ? ExpandLessIcon : ExpandMoreIcon}
          />
          <Grid
            item
            xs={12}
            display='flex'
            justifyContent='center'
            mx={1}
            pt='0 !important'
          >
            <Collapse in={expandedPaychecks} timeout='auto' unmountOnExit>
              <Grid container spacing={1} mt={0}>
                {paycheckEmployers.map((employer) => {
                  const _paychecks = groupedPaychecks[employer];
                  return (
                    <PaycheckEarnedGrid
                      key={employer}
                      employer={employer}
                      paychecks={_paychecks}
                    />
                  );
                })}
              </Grid>
            </Collapse>
          </Grid>
        </>
      )}
      {sortedIncomeGroups.length > 0 && (
        <>
          <LabelValueButton
            label='other incomes'
            value={incomeSum}
            onClick={() => setExpandedIncomes(!expandedIncomes)}
            Icon={expandedIncomes ? ExpandLessIcon : ExpandMoreIcon}
          />
          <Grid
            item
            xs={12}
            display='flex'
            justifyContent='center'
            mx={1}
            pt='0 !important'
          >
            <Collapse
              in={expandedIncomes}
              timeout='auto'
              unmountOnExit
              sx={{ width: '100%' }}
            >
              <Grid container spacing={1} mt={0}>
                {sortedIncomeGroups.map((group) => {
                  const { name, value, transactions } = group;
                  return (
                    <LabelValueButton
                      key={name}
                      label={name}
                      value={value}
                      onClick={() => openTransactionsDialog(name, transactions)}
                      Icon={MenuIcon}
                    />
                  );
                })}
              </Grid>
            </Collapse>
          </Grid>
        </>
      )}
    </>
  );
}
