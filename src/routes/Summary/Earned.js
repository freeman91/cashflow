import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import sumBy from 'lodash/sumBy';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

import { openDialog } from '../../store/dialogs';
import LabelValueBox from '../../components/LabelValueBox';
import PaycheckEarnedGrid from './PaycheckEarnedGrid';

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
      <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
        <Card sx={{ width: '100%', px: 2, py: 1 }}>
          <LabelValueBox value={paycheckSum + incomeSum} label='total' />
        </Card>
      </Grid>

      {paycheckEmployers.length > 0 && (
        <>
          <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
            <Card
              sx={{
                width: '100%',
                pl: 2,
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <LabelValueBox value={paycheckSum} label='paychecks' />
              <IconButton
                size='large'
                color='info'
                onClick={() => setExpandedPaychecks(!expandedPaychecks)}
                sx={{ p: 0.75, mx: 1 }}
              >
                {expandedPaychecks ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Card>
          </Grid>
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
          <Grid item xs={12} display='flex' justifyContent='center' mx={1}>
            <Card
              sx={{
                width: '100%',
                pl: 2,
                py: 1,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <LabelValueBox value={incomeSum} label='other incomes' />
              <IconButton
                size='large'
                color='info'
                onClick={() => setExpandedIncomes(!expandedIncomes)}
                sx={{ p: 0.75, mx: 1 }}
              >
                {expandedIncomes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Card>
          </Grid>
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
                          onClick={() =>
                            openTransactionsDialog(name, transactions)
                          }
                        >
                          <LabelValueBox value={value} label={name} />
                        </Box>
                      </Card>
                    </Grid>
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
