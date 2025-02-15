import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUp from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid2';
import Icon from '@mui/material/Icon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Tooltip from '@mui/material/Tooltip';

import { numberToCurrency } from '../../helpers/currency';
import { timeSinceLastUpdate } from '../../helpers/dates';
import { LIABILITY, LIABILITY_TYPES } from '../../components/Forms/AccountForm';

export default function AccountGroupGrid(props) {
  const { type, sum, items, lastMonthSum, showInactive } = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const openAccount = (account) => {
    dispatch(push(`/accounts/${account.name}`));
  };

  const [monthDiff, diffPercent, color] = (() => {
    if (lastMonthSum === 0) return [0, 0, 'text.disabled'];
    let _monthDiff = sum - lastMonthSum;
    let _diffPercent = ((sum - lastMonthSum) / lastMonthSum) * 100;
    if (_monthDiff === 0) return [0, 0, 'text.disabled'];
    if (Object.keys(LIABILITY_TYPES).includes(type)) {
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
            backgroundImage: (theme) => theme.vars.overlays[24],
            pl: 0.5,
            py: 0.5,
          }}
        >
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              width: 40,
              height: 40,
              p: 0.5,
              mr: 1,
              '&:hover': {
                backgroundImage: (theme) => theme.vars.overlays[8],
              },
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
          <ListItemText
            primary={type}
            sx={{ flexGrow: 1, mr: 1 }}
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
                backgroundImage: (theme) => theme.vars.overlays[4],
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
                slotProps={{ secondary: { align: 'right', sx: { color } } }}
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
            primary={numberToCurrency.format(sum)}
            sx={{ ml: 1, width: 'fit-content', flex: 'unset' }}
            slotProps={{
              primary: {
                align: 'right',
                fontWeight: 'bold',
                fontSize: 18,
                sx: { whiteSpace: 'nowrap', width: 'fit-content' },
              },
            }}
          />
        </ListItem>
        {open && (
          <Collapse in={open} timeout='auto' unmountOnExit>
            {items.map((account, idx) => {
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
          </Collapse>
        )}
      </List>
    </Grid>
  );
}
