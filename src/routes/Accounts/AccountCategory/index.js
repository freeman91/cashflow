import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import dayjs from 'dayjs';
import find from 'lodash/find';
import get from 'lodash/get';

import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Icon from '@mui/material/Icon';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { LIABILITY } from '../../../components/Forms/AccountForm';
import { findAmount } from '../../../helpers/transactions';
import { numberToCurrency } from '../../../helpers/currency';
import { timeSinceLastUpdate } from '../../../helpers/dates';
import NetWorth from '../Networth';

export default function AccountCategory(props) {
  const { accountType, assetType = null, liabilityType = null } = props;
  const dispatch = useDispatch();
  const allAccounts = useSelector((state) => state.accounts.data);
  const histories = useSelector((state) => state.histories.data);

  const [lastMonthValue, setLastMonthValue] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    let _accounts = allAccounts.filter(
      (account) =>
        account.account_type === accountType &&
        (assetType ? account.asset_type === assetType : true) &&
        (liabilityType ? account.liability_type === liabilityType : true)
    );
    const lastMonth = dayjs().subtract(1, 'month');
    _accounts = _accounts.map((item) => {
      const history = histories.find((history) => {
        return (
          history.item_id === item.account_id &&
          history.month ===
            lastMonth.year() +
              '-' +
              (lastMonth.month() + 1).toString().padStart(2, '0')
        );
      });
      const dayValue = find(history?.values, (value) => {
        return value.date === lastMonth.format('YYYY-MM-DD');
      });
      return {
        ...item,
        lastMonthAmount: get(dayValue, 'value', 0),
        _amount: findAmount(item),
      };
    });
    const lastMonthSum = _accounts.reduce(
      (acc, account) => acc + account.lastMonthAmount,
      0
    );
    const sum = _accounts.reduce((acc, account) => acc + account._amount, 0);
    const items = _accounts.sort((a, b) => b._amount - a._amount);
    setLastMonthValue(lastMonthSum);
    setCurrentValue(sum);
    setAccounts(items);
  }, [allAccounts, histories, accountType, assetType, liabilityType]);

  const openAccount = (account) => {
    dispatch(push(`/accounts/${account.name}`));
  };

  const [monthDiff, diffPercent, color] = (() => {
    if (lastMonthValue === 0) return [0, 0, 'text.disabled'];
    let _monthDiff = currentValue - lastMonthValue;
    let _diffPercent = ((currentValue - lastMonthValue) / lastMonthValue) * 100;
    if (_monthDiff === 0) return [0, 0, 'text.disabled'];
    if (accountType === LIABILITY) {
      return [
        _monthDiff * -1,
        _diffPercent.toFixed(2),
        _monthDiff > 0 ? 'success.main' : 'error.main',
      ];
    }
    return [
      _monthDiff,
      _diffPercent.toFixed(2),
      _monthDiff > 0 ? 'success.main' : 'error.main',
    ];
  })();

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        pb: 5,
      }}
    >
      <NetWorth accounts={accounts} />
      <Grid size={{ xs: 12 }} display='flex' justifyContent='center'>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          <Grid size={{ xs: 12 }}>
            <List
              disablePadding
              sx={{
                width: '100%',
                backgroundColor: 'background.paper',
                backgroundImage: (theme) => theme.vars.overlays[8],
                boxShadow: (theme) => theme.shadows[4],
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ListItem
                sx={{
                  backgroundImage: (theme) => theme.vars.overlays[8],
                  pl: 0.5,
                  py: 0.5,
                }}
              >
                <ListItemText
                  primary={assetType || liabilityType}
                  sx={{ flexGrow: 1, mx: 1 }}
                  slotProps={{
                    primary: {
                      fontWeight: 'bold',
                      variant: 'h6',
                      sx: {
                        whiteSpace: 'nowrap',
                      },
                    },
                  }}
                />
                <Tooltip title='one month difference'>
                  <Box
                    sx={{
                      width: 'fit-content',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: 'background.paper',
                      backgroundImage: (theme) => theme.vars.overlays[8],
                      borderRadius: 1,
                      py: 0,
                      px: 1,
                    }}
                  >
                    <ListItemText
                      secondary={new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        maximumSignificantDigits: 3,
                        minimumSignificantDigits: 2,
                        notation: 'compact',
                      }).format(monthDiff)}
                      slotProps={{
                        secondary: {
                          sx: { color, whiteSpace: 'nowrap' },
                        },
                      }}
                    />
                    <ListItemText
                      secondary={`(${diffPercent}%)`}
                      slotProps={{
                        secondary: { align: 'right', sx: { color } },
                      }}
                      sx={{
                        display: {
                          xs: 'none',
                          md: 'block',
                        },
                      }}
                    />
                    <Icon sx={{ color }}>
                      {monthDiff === 0 && <TrendingFlatIcon />}
                      {monthDiff > 0 ? <TrendingUp /> : <TrendingDown />}
                    </Icon>
                  </Box>
                </Tooltip>

                <ListItemText
                  primary={numberToCurrency.format(currentValue)}
                  sx={{
                    ml: 1,
                    minWidth: 110,
                    width: 'fit-content',
                    flex: 'unset',
                  }}
                  slotProps={{
                    primary: {
                      align: 'right',
                      fontWeight: 'bold',
                      fontSize: 18,
                      sx: { whiteSpace: 'nowrap', width: '100%' },
                    },
                  }}
                />
              </ListItem>
              {accounts.map((account, idx) => {
                if (!showInactive && !account.active) return null;
                let amount = account._amount;
                if (account.account_type === LIABILITY && amount > 0) {
                  amount = -amount;
                }

                return (
                  <ListItemButton
                    disableGutters
                    key={idx}
                    onClick={() => openAccount(account)}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      px: 1.5,
                      py: 0.5,
                      my: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        mr: 1,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {account.icon_url && (
                        <img
                          src={account.icon_url}
                          alt={`${account.name} icon`}
                          height={30}
                          style={{ marginRight: 10, borderRadius: '10%' }}
                        />
                      )}
                    </Box>
                    <ListItemText
                      sx={{ width: '40%' }}
                      primary={
                        account.name + (!account.active ? ' (Inactive)' : '')
                      }
                      secondary={account.subtype}
                      slotProps={{
                        primary: {
                          color: !account.active
                            ? 'text.disabled'
                            : 'text.primary',
                          sx: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        },
                        secondary: {
                          color: !account.active
                            ? 'text.disabled'
                            : 'text.secondary',
                        },
                      }}
                    />
                    <ListItemText
                      sx={{ width: '25%' }}
                      primary={numberToCurrency.format(amount)}
                      secondary={timeSinceLastUpdate(account.last_update)}
                      slotProps={{
                        primary: { align: 'right' },
                        secondary: { align: 'right' },
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Grid>
          <Grid size={{ xs: 12 }} display='flex' justifyContent='center'>
            <Link
              underline='hover'
              color='text.secondary'
              onClick={() => {
                setShowInactive(!showInactive);
              }}
            >
              <Typography variant='h6' sx={{ mr: 1 }}>
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
