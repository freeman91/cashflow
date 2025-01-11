import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';

import useTheme from '@mui/material/styles/useTheme';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { findAmount } from '../../helpers/transactions';
import { ASSET, LIABILITY } from '../../components/Dialog/AccountDialog';

export default function AccountsSummary(props) {
  const { groupedAccounts } = props;
  const theme = useTheme();

  const [tab, setTab] = useState('totals');

  const [assets, setAssets] = useState([]);
  const [assetSum, setAssetSum] = useState(0);
  const [creditLiabilities, setCreditLiabilities] = useState([]);
  const [creditSum, setCreditSum] = useState(0);
  const [loanLiabilities, setLoanLiabilities] = useState([]);
  const [liabilitySum, setLiabilitySum] = useState(0);

  useEffect(() => {
    const _assets = groupedAccounts.filter(
      (account) => account.account_type === ASSET
    );
    setAssets(_assets);
    setAssetSum(_assets.reduce((acc, account) => acc + account.sum, 0));

    const liabilityAccounts = groupedAccounts.filter(
      (account) => account.account_type === LIABILITY
    );

    const creditAccounts = liabilityAccounts.filter(
      (account) => account.type === 'Credit'
    );
    let loanAccounts = liabilityAccounts.filter(
      (account) => account.type !== 'Credit'
    );
    loanAccounts = get(loanAccounts, '0.items', []);
    loanAccounts = groupBy(loanAccounts, 'subtype');

    loanAccounts = Object.entries(loanAccounts).map(([key, items]) => {
      return {
        type: key,
        items,
        sum: items.reduce((acc, item) => acc + findAmount(item), 0),
      };
    });

    setCreditLiabilities(creditAccounts);
    setCreditSum(creditAccounts.reduce((acc, account) => acc + account.sum, 0));
    setLoanLiabilities(loanAccounts);
    setLiabilitySum(
      liabilityAccounts.reduce((acc, account) => acc + account.sum, 0)
    );
  }, [groupedAccounts]);

  const assetColors = [
    theme.chartColors[0],
    theme.chartColors[1],
    theme.chartColors[2],
    theme.chartColors[4],
    theme.chartColors[5],
  ];

  const loanLiabilityColors = [
    theme.chartColors[6],
    theme.chartColors[7],
    theme.chartColors[8],
    theme.chartColors[12],
    theme.chartColors[13],
    theme.chartColors[14],
  ];

  return (
    <Grid size={{ xs: 4 }} display='flex' justifyContent='center'>
      <Box
        sx={{
          backgroundColor: 'surface.250',
          borderRadius: 1,
          py: 1,
          boxShadow: (theme) => theme.shadows[4],
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            width: '100%',
          }}
        >
          <Typography variant='h6' fontWeight='bold'>
            Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label='Totals'
              variant={tab === 'totals' ? 'filled' : 'outlined'}
              onClick={() => setTab('totals')}
            />
            <Chip
              label='Percent'
              variant={tab === 'percent' ? 'filled' : 'outlined'}
              onClick={() => setTab('percent')}
            />
          </Box>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            width: '100%',
          }}
        >
          <Typography variant='h6' fontWeight='bold'>
            Assets
          </Typography>
          <Typography
            variant='h6'
            fontWeight='bold'
            align='left'
            color='textSecondary'
          >
            {numberToCurrency.format(assetSum)}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', px: 2, my: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: 10,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {assets.map((asset, idx) => {
              const color = assetColors[idx % assetColors.length];
              return (
                <Box
                  key={idx}
                  sx={{
                    width: `${(asset.sum / assetSum) * 100}%`,
                    height: '100%',
                    bgcolor: color,
                  }}
                />
              );
            })}
          </Box>
        </Box>
        <List disablePadding>
          {assets.map((asset, idx) => {
            const color = assetColors[idx % assetColors.length];
            return (
              <ListItem key={idx}>
                <Box
                  sx={{
                    borderRadius: 1,
                    width: 10,
                    height: 10,
                    bgcolor: color,
                    mr: 1,
                  }}
                />
                <ListItemText primary={asset.type} />
                <ListItemText
                  primary={
                    tab === 'totals'
                      ? numberToCurrency.format(asset.sum)
                      : `${((asset.sum / assetSum) * 100).toFixed(2)}%`
                  }
                  sx={{ textAlign: 'right' }}
                />
              </ListItem>
            );
          })}
        </List>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: 2,
            width: '100%',
          }}
        >
          <Typography variant='h6' fontWeight='bold'>
            Liabilities
          </Typography>
          <Typography
            variant='h6'
            fontWeight='bold'
            align='left'
            color='textSecondary'
          >
            {numberToCurrency.format(liabilitySum + creditSum)}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', px: 2, my: 1 }}>
          <Box
            sx={{
              width: '100%',
              height: 10,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            {loanLiabilities.map((liability, idx) => {
              const color =
                loanLiabilityColors[idx % loanLiabilityColors.length];
              return (
                <Box
                  key={idx}
                  sx={{
                    width: `${(liability.sum / -liabilitySum) * 100}%`,
                    height: '100%',
                    bgcolor: color,
                  }}
                />
              );
            })}
            {creditLiabilities.length > 0 && (
              <Box
                sx={{
                  width: `${(creditSum / -liabilitySum) * 100}%`,
                  height: '100%',
                  bgcolor: theme.chartColors[13],
                }}
              />
            )}
          </Box>
        </Box>
        <List disablePadding>
          {loanLiabilities.map((liability, idx) => {
            const color = loanLiabilityColors[idx % loanLiabilityColors.length];
            return (
              <ListItem key={idx}>
                <Box
                  sx={{
                    borderRadius: 1,
                    width: 10,
                    height: 10,
                    bgcolor: color,
                    mr: 1,
                  }}
                />
                <ListItemText primary={'Loan: ' + liability.type} />
                <ListItemText
                  primary={
                    tab === 'totals'
                      ? numberToCurrency.format(-liability.sum)
                      : `${((-liability.sum / liabilitySum) * 100).toFixed(2)}%`
                  }
                  sx={{ textAlign: 'right' }}
                />
              </ListItem>
            );
          })}
          {creditLiabilities.length > 0 && (
            <ListItem>
              <Box
                sx={{
                  borderRadius: 1,
                  width: 10,
                  height: 10,
                  bgcolor: theme.chartColors[13],
                  mr: 1,
                }}
              />
              <ListItemText primary='Credit' />
              <ListItemText
                primary={
                  tab === 'totals'
                    ? numberToCurrency.format(creditSum)
                    : `${((-creditSum / liabilitySum) * 100).toFixed(2)}%`
                }
                sx={{ textAlign: 'right' }}
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Grid>
  );
}
