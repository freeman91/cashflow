import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { forEach, sortBy } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import DatePicker from '@material-ui/lab/DatePicker';
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Table as MuiTable,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import Table from '../../components/Table';
import { numberToCurrency } from '../../helpers/currency';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      padding: '1rem',
      textAlign: 'center',
      color: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
    },
  };
});

export default function Networth() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [filterStocks, setFilterStocks] = useState(false);
  const [filterCrypto, setFilterCrypto] = useState(false);
  const [filterOther, setFilterOther] = useState(false);
  const [assets, setAssets] = useState([]);
  const [selectedNetworth, setSelectedNetworth] = useState(0);
  const [date, setDate] = useState(dayjs().subtract(1, 'month'));
  const { data: networths } = useSelector((state) => state.networths);
  const { data: _assets } = useSelector((state) => state.assets);
  const { data: debts } = useSelector((state) => state.debts);

  useEffect(() => {
    if (_assets.length === 0 || debts.length === 0) {
      dispatch(getAssets());
      dispatch(getDebts());
    }
    var filteredAssets = [];
    forEach(_assets, (asset) => {
      if (filterStocks && asset.type === 'stock') {
        return;
      } else if (filterCrypto && asset.type === 'crypto') {
        return;
      } else if (
        filterOther &&
        asset.type !== 'stock' &&
        asset.type !== 'crypto'
      ) {
        return;
      } else {
        filteredAssets.push(asset);
      }
    });
    setAssets(sortBy(filteredAssets, ['name']));
  }, [_assets, debts, filterStocks, filterCrypto, filterOther, dispatch]);

  const handleChipClick = (category) => {
    switch (category) {
      case 'crypto':
        setFilterCrypto(!filterCrypto);
        break;
      case 'other':
        setFilterOther(!filterOther);
        break;
      default:
        setFilterStocks(!filterStocks);
        break;
    }
  };

  var d_arr = [...networths];
  d_arr.reverse();
  const s_nw = d_arr[selectedNetworth];

  const assetSum = s_nw.assets.reduce((sum, asset) => {
    return sum + asset.amount;
  }, 0);
  const debtSum = s_nw.debts.reduce((sum, debt) => {
    return sum + debt.amount;
  }, 0);

  console.log('s_nw: ', s_nw);

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3} sx={{ height: '6%' }}>
          <Grid item xs={12} sx={{ width: '100%', height: '1.5rem' }}>
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='stocks'
              color={filterStocks ? 'default' : 'primary'}
              onClick={() => handleChipClick('stocks')}
            />
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='crypto'
              color={filterCrypto ? 'default' : 'primary'}
              onClick={() => handleChipClick('crypto')}
            />
            <Chip
              sx={{ margin: '0 .5rem 0 .5rem' }}
              label='other'
              color={filterOther ? 'default' : 'primary'}
              onClick={() => handleChipClick('other')}
            />
          </Grid>
          <Grid item xs={7} sx={{ height: '30rem' }}>
            <Table
              data={assets}
              title='Assets'
              handleClick={(asset) => console.log('asset: ', asset)}
              attrs={['name', 'value']}
              size='small'
              paginate={assets.length >= 10 ? true : false}
              rowsPerPage={10}
            />
          </Grid>
          <Grid item xs={5} sx={{ height: '15rem' }}>
            <Table
              data={debts}
              title='Debts'
              handleClick={(debt) => console.log('debt: ', debt)}
              attrs={['name', 'value']}
              rowsPerPage={20}
            />
          </Grid>
          <Grid item xs={12} sx={{ height: '10rem' }}>
            <Table
              data={[]}
              title='Totals'
              handleClick={() => {}}
              attrs={['name', 'value']}
              size='small'
            />
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography sx={{ height: '40vh' }} align='center' variant='h4'>
                Net Worth over time
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={4} spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ height: '60vh' }}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <DatePicker
                      views={['year', 'month']}
                      label='Year and Month'
                      minDate={new Date('2018-11-01')}
                      maxDate={new Date('2030-12-31')}
                      value={date}
                      onChange={(newValue) => {
                        console.log('newValue: ', newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth helperText={null} />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TableContainer component={Paper}>
                      <MuiTable size='medium'>
                        <TableBody>
                          <TableRow>
                            <TableCell>Net</TableCell>
                            <TableCell>
                              {numberToCurrency.format(assetSum - debtSum)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Asset sum</TableCell>
                            <TableCell>
                              {numberToCurrency.format(assetSum)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Debt Sum</TableCell>
                            <TableCell>
                              {numberToCurrency.format(debtSum)}
                            </TableCell>
                          </TableRow>
                          <Divider
                            sx={{
                              marginTop: '.5rem',
                              marginBottom: '.5rem',
                              width: '100%',
                            }}
                          />
                          {s_nw.debts.map((debt) => {
                            return (
                              <TableRow>
                                <TableCell>{debt.name}</TableCell>
                                <TableCell>
                                  {numberToCurrency.format(debt.amount)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </MuiTable>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={6}>
                    <TableContainer component={Paper}>
                      <MuiTable size='medium'>
                        <TableBody>
                          {s_nw.assets.map((asset) => {
                            return (
                              <TableRow>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>
                                  {numberToCurrency.format(asset.amount)}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </MuiTable>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
