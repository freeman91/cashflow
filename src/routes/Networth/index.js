import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import dayjs from 'dayjs';
import { forEach, sortBy } from 'lodash';
import { makeStyles } from '@material-ui/styles';
import { Chip, Grid, Paper, Typography } from '@material-ui/core';

import { getAssets } from '../../store/assets';
import { getDebts } from '../../store/debts';
import Table from '../../components/Table';

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

  return (
    <>
      <Grid container spacing={3}>
        <Grid container item xs={4} spacing={3}>
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
          <Grid item xs={12}>
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
            {/* <Table
              data={[]}
              title='Totals'
              handleClick={() => {}}
              attrs={['name', 'value']}
              size='small'
            /> */}
            <Paper className={classes.paper}>
              <Typography sx={{ height: '80vh' }} align='left' variant='h4'>
                Month Select
                <br />
                List Assets
                <br />
                List Debts
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
