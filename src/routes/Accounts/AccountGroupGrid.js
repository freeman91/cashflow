import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'redux-first-history';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { numberToCurrency } from '../../helpers/currency';
import { timeSinceLastUpdate } from '../../helpers/dates';
import { LIABILITY } from '../../components/Forms/AccountForm';

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
            sx={{ width: '40%' }}
            slotProps={{
              primary: {
                fontWeight: 'bold',
                variant: 'h6',
              },
            }}
          />
          {/* <ListItemText
            primary='[one month change]'
            sx={{ width: '35%' }}
            slotProps={{
              primary: {
                align: 'right',
              },
            }}
          /> */}
          <ListItemText
            primary={numberToCurrency.format(sum)}
            sx={{ width: '25%', mr: 2 }}
            slotProps={{
              primary: {
                align: 'right',
                fontWeight: 'bold',
                fontSize: 18,
              },
            }}
          />
        </ListItem>
        {open && (
          <Collapse in={open} timeout='auto' unmountOnExit>
            {items.map((account, idx) => {
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
                    primary={account.name}
                    secondary={account.subtype}
                    slotProps={{
                      primary: {
                        sx: {
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      },
                    }}
                  />
                  {/* <ListItemText
                    primary='[value history past month]'
                    sx={{ width: '35%' }}
                    slotProps={{
                      primary: { align: 'center' },
                    }}
                  /> */}
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
