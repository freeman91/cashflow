import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import filter from 'lodash/filter';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

import { refreshAll } from '../../store/user';
import { _numberToCurrency, numberToCurrency } from '../../helpers/currency';
import AssetsStack from '../Accounts/AssetsStack';
import DebtsStack from '../Accounts/DebtsStack';
import BoxFlexCenter from '../../components/BoxFlexCenter';
import AccountChart from '../Accounts/AccountChart';
import AllocationChart from './AllocationChart';
import CustomAppBar from '../../components/CustomAppBar';
import PullToRefresh from '../../components/PullToRefresh';
import CustomToggleButton from '../../components/CustomToggleButton';
import AccountPageButton from '../../components/CustomAppBar/AccountPageButton';

const ASSETS = 'assets';
const DEBTS = 'debts';
const HISTORY = 'history';

export default function Account() {
  const dispatch = useDispatch();
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const allDebts = useSelector((state) => state.debts.data);

  const [account, setAccount] = useState(null);
  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [debts, setDebts] = useState([]);
  const [debtSum, setDebtSum] = useState(0);

  const [tab, setTab] = useState(ASSETS);

  const onRefresh = async () => {
    dispatch(refreshAll());
  };

  useEffect(() => {
    if (location.state?.accountId) {
      setAccount(
        accounts.find((a) => a.account_id === location.state.accountId)
      );
    }
  }, [location.state?.accountId, accounts]);

  useEffect(() => {
    const accountAssets = filter(allAssets, {
      account_id: account?.account_id,
    });
    setAssetSum(reduce(accountAssets, (acc, asset) => acc + asset.value, 0));
    setAssets(sortBy(accountAssets, 'value').reverse());
  }, [allAssets, account?.account_id]);

  useEffect(() => {
    const accountDebts = filter(allDebts, { account_id: account?.account_id });
    setDebtSum(reduce(accountDebts, (acc, debt) => acc + debt.amount, 0));
    setDebts(sortBy(accountDebts, 'amount'));
  }, [allDebts, account?.account_id]);

  useEffect(() => {
    if (assets.length === 0 && debts.length > 0) {
      setTab(DEBTS);
    }
  }, [assets, debts]);

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  const show = assetSum > 0 && debtSum > 0;
  return (
    <Box sx={{ WebkitOverflowScrolling: 'touch', width: '100%' }}>
      <CustomAppBar
        middle={
          <Typography variant='h6' fontWeight='bold'>
            {account?.name}
          </Typography>
        }
        right={<AccountPageButton />}
      />
      <Grid
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
        sx={{ mt: (theme) => theme.appBar.mobile.height }}
      >
        <PullToRefresh onRefresh={onRefresh} />
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Typography
            variant='body1'
            color='primary'
            align='center'
            sx={{
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => {
              window.open(account?.url, '_blank');
            }}
          >
            {account?.url?.split('/')[2]}
          </Typography>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <Box sx={{ width: '100%', mx: 1 }}>
            <Grid container>
              <Grid item xs={6}>
                <Stack direction='column'>
                  <Typography
                    variant='body1'
                    color='text.secondary'
                    align='center'
                  >
                    balance
                  </Typography>
                  <BoxFlexCenter sx={{ justifyContent: 'center' }}>
                    <Typography variant='h6' color='text.secondary'>
                      $
                    </Typography>
                    <Typography variant='h5' color='white' fontWeight='bold'>
                      {_numberToCurrency.format(assetSum - debtSum)}
                    </Typography>
                  </BoxFlexCenter>
                  {show && (
                    <Typography
                      variant='body1'
                      color='success.main'
                      fontWeight='bold'
                      align='center'
                    >
                      +{numberToCurrency.format(assetSum)}
                    </Typography>
                  )}
                  {show && (
                    <Typography
                      variant='body1'
                      color='error.main'
                      fontWeight='bold'
                      align='center'
                    >
                      -{numberToCurrency.format(debtSum)}
                    </Typography>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography
                      variant='body1'
                      color='text.secondary'
                      align='center'
                    >
                      allocation
                    </Typography>
                  </Grid>
                  {assets.length > 0 && (
                    <AllocationChart
                      type={ASSETS}
                      sum={assetSum}
                      xs={debts.length > 0 ? 6 : 12}
                    />
                  )}
                  {debts.length > 0 && (
                    <AllocationChart
                      type={DEBTS}
                      sum={debtSum}
                      xs={assets.length > 0 ? 6 : 12}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} display='flex' justifyContent='center'>
          <ToggleButtonGroup
            fullWidth
            color='primary'
            value={tab}
            exclusive
            onChange={handleChangeTab}
            sx={{ mt: 1, px: 1 }}
          >
            {assets.length > 0 && (
              <CustomToggleButton value={ASSETS}>{ASSETS}</CustomToggleButton>
            )}
            {debts.length > 0 && (
              <CustomToggleButton value={DEBTS}>{DEBTS}</CustomToggleButton>
            )}
            <CustomToggleButton value={HISTORY}>{HISTORY}</CustomToggleButton>
          </ToggleButtonGroup>
        </Grid>

        {tab === ASSETS && <AssetsStack accountId={account?.account_id} />}
        {tab === DEBTS && <DebtsStack accountId={account?.account_id} />}
        {tab === HISTORY && <AccountChart account={account} />}

        <Grid item xs={12} mb={10} />
      </Grid>
    </Box>
  );
}
