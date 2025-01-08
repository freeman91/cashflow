import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import { alpha } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { numberToCurrency } from '../../../helpers/currency';
import { LIABILITY } from '../../../components/Dialog/AccountDialog';
import { timeSinceLastUpdate } from '../../../helpers/dates';

export default function AccountGroupGrid(props) {
  const { type, sum, items } = props;
  const dispatch = useDispatch();

  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const openAccount = (account) => {
    dispatch(push(`/accounts/${account.name}`));
  };

  return (
    <Grid item xs={12}>
      <List
        disablePadding
        sx={{
          width: '100%',
          backgroundColor: 'surface.250',
          borderRadius: 1,
          boxShadow: (theme) => theme.shadows[4],
          overflow: 'hidden',
        }}
      >
        <ListItem sx={{ backgroundColor: 'surface.300', pl: 0.5 }}>
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              borderRadius: '50%',
              p: 1,
              mr: 1,
              '&:hover': {
                backgroundColor: (theme) =>
                  alpha(theme.palette.surface[500], 0.1),
              },
            }}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </Box>
          <ListItemText
            primary={type}
            primaryTypographyProps={{
              fontWeight: 'bold',
              fontSize: 18,
            }}
          />
          <ListItemText
            primary='[one month change]'
            primaryTypographyProps={{
              align: 'right',
            }}
          />
          <ListItemText
            primary={numberToCurrency.format(sum)}
            primaryTypographyProps={{
              align: 'right',
              fontWeight: 'bold',
              fontSize: 18,
            }}
            sx={{ mr: 2 }}
          />
        </ListItem>
        {open && (
          <Collapse in={open} timeout='auto' unmountOnExit>
            {items.map((account, idx) => {
              let amount = account._amount;
              if (account.account_type === LIABILITY) {
                amount = -amount;
              }
              return (
                <ListItemButton
                  disableGutters
                  key={idx}
                  onClick={() => openAccount(account)}
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.05),
                    },
                    borderRadius: 1,
                    mx: 0.5,
                    px: 1.5,
                    py: 0.5,
                    my: 0.5,
                  }}
                >
                  {account.icon_url && (
                    <Box
                      sx={{
                        width: 50,
                        mr: 1,
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={account.icon_url}
                        alt={`${account.name} icon`}
                        height={30}
                        style={{ marginRight: 10, borderRadius: '10%' }}
                      />
                    </Box>
                  )}
                  <ListItemText
                    sx={{ width: '40%' }}
                    primary={account.name}
                    primaryTypographyProps={{
                      sx: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    secondary={account.subtype}
                  />
                  <ListItemText
                    primary='[value history past month]'
                    sx={{ width: '35%' }}
                    primaryTypographyProps={{ align: 'center' }}
                  />
                  <ListItemText
                    sx={{ width: '25%' }}
                    primary={numberToCurrency.format(amount)}
                    primaryTypographyProps={{ align: 'right' }}
                    secondary={timeSinceLastUpdate(account.last_update)}
                    secondaryTypographyProps={{ align: 'right' }}
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
