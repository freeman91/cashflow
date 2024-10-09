import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import reduce from 'lodash/reduce';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function PaycheckTotals(props) {
  const { paychecks } = props;
  const dispatch = useDispatch();

  const [takeHome, setTakeHome] = useState(0);
  const [retirement, setRetirement] = useState(0);
  const [benefits, setBenefits] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [other, setOther] = useState(0);

  useEffect(() => {
    const _takeHome = reduce(
      paychecks,
      (sum, expense) => {
        if ('take_home' in expense) {
          return sum + expense.take_home;
        }
        return sum;
      },
      0
    );
    setTakeHome(_takeHome);
  }, [paychecks]);

  useEffect(() => {
    const _retirement = reduce(
      paychecks,
      (sum, expense) => {
        if ('retirement' in expense) {
          return sum + expense.retirement;
        }
        return sum;
      },
      0
    );
    setRetirement(_retirement);
  }, [paychecks]);

  useEffect(() => {
    const _benefits = reduce(
      paychecks,
      (sum, expense) => {
        if ('benefits' in expense) {
          return sum + expense.benefits;
        }
        return sum;
      },
      0
    );
    setBenefits(_benefits);
  }, [paychecks]);

  useEffect(() => {
    const _taxes = reduce(
      paychecks,
      (sum, expense) => {
        if ('taxes' in expense) {
          return sum + expense.taxes;
        }
        return sum;
      },
      0
    );
    setTaxes(_taxes);
  }, [paychecks]);

  useEffect(() => {
    const _other = reduce(
      paychecks,
      (sum, expense) => {
        if ('other' in expense) {
          return sum + expense.other;
        }
        return sum;
      },
      0
    );
    setOther(_other);
  }, [paychecks]);

  return (
    <Grid
      item
      xs={12}
      mx={1}
      pt='0px !important'
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      {paychecks.length === 0 ? (
        <Typography
          variant='body1'
          color='text.secondary'
          align='center'
          mt={1}
        >
          none
        </Typography>
      ) : (
        <Card raised sx={{ maxWidth: 400, width: '100%' }}>
          <List
            disablePadding
            onClick={() => {
              dispatch(
                openDialog({
                  type: 'transactions',
                  attrs: paychecks,
                })
              );
            }}
            sx={{ cursor: 'pointer' }}
          >
            <ListItem>
              <ListItemText secondary='take home' />
              <ListItemText
                primary={numberToCurrency.format(takeHome)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText secondary='retirement' />
              <ListItemText
                primary={numberToCurrency.format(retirement)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText secondary='benefits' />
              <ListItemText
                primary={numberToCurrency.format(benefits)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText secondary='taxes' />
              <ListItemText
                primary={numberToCurrency.format(taxes)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
            <ListItem sx={{ pl: 4 }}>
              <ListItemText secondary='other' />
              <ListItemText
                primary={numberToCurrency.format(other)}
                primaryTypographyProps={{ fontWeight: 'bold', align: 'right' }}
              />
            </ListItem>
          </List>
        </Card>
      )}
    </Grid>
  );
}
