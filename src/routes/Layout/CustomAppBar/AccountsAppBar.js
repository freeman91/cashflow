import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoopIcon from '@mui/icons-material/Loop';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';

import { getAccounts } from '../../../store/accounts';
import { getHistories } from '../../../store/histories';
import { openItemView } from '../../../store/itemView';
import ReactiveButton from '../../../components/ReactiveButton';

const ALL = 'all';
const REAL_ESTATE = 'real-estate';
const INVESTMENTS = 'investments';
const VEHICLES = 'vehicles';
const CASH = 'cash';
const LOANS = 'loans';
const CREDIT = 'credit';
const VIEWS = [ALL, REAL_ESTATE, INVESTMENTS, VEHICLES, CASH, LOANS, CREDIT];

const StyledBreadcrumbs = styled(Breadcrumbs, {
  shouldForwardProp: (prop) => !['isMobile'].includes(prop),
})(({ isMobile }) => ({
  '.MuiBreadcrumbs-li': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: isMobile ? 1 : 'unset',
    width: isMobile ? '100%' : 'unset',
  },
}));

export default function AccountsAppBar(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const accounts = useSelector((state) => state.accounts.data);

  const [account, setAccount] = useState({});
  const view = get(location.pathname.split('/'), '2', ALL);

  useEffect(() => {
    const _accountName = get(location.pathname.split('/'), 2);
    const _account = accounts.find(
      (a) => a.name === _accountName?.replace(/%20/g, ' ')
    );
    if (_account) setAccount(_account);
    else setAccount({});
    return () => {
      setAccount({});
    };
  }, [location, accounts]);

  const createAccount = () => {
    dispatch(openItemView({ itemType: 'account', mode: 'create' }));
  };

  const handleRefresh = () => {
    dispatch(getAccounts());
    dispatch(getHistories());
  };

  return (
    <>
      <StyledBreadcrumbs
        isMobile={isMobile}
        sx={{
          ml: isMobile ? 0 : 1,
          width: '100%',
        }}
      >
        {!isMobile && (
          <Link
            underline='hover'
            color='text.primary'
            onClick={() => {
              dispatch(push('/accounts'));
            }}
          >
            <Typography variant='h5' fontWeight='bold' sx={{ mr: 1 }}>
              Accounts
            </Typography>
          </Link>
        )}
        {account.account_id && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {account.icon_url && (
              <Box
                sx={{
                  mx: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isMobile && (
                  <IconButton onClick={() => dispatch(push('/accounts'))}>
                    <ArrowBackIcon />
                  </IconButton>
                )}
                <img
                  src={account.icon_url}
                  alt={`${account.name} icon`}
                  height={30}
                  style={{ marginRight: 10, borderRadius: '10%' }}
                />
              </Box>
            )}
            <Typography
              variant='h5'
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {account.name + (!account.active ? ' (Inactive)' : '')}
            </Typography>
          </Box>
        )}
      </StyledBreadcrumbs>
      {VIEWS.includes(view) && (
        <Select
          variant='standard'
          disableUnderline
          value={view}
          onChange={(e) => dispatch(push(`/accounts/${e.target.value}`))}
          sx={{ mr: 1 }}
          MenuProps={{
            MenuListProps: {
              disablePadding: true,
            },
          }}
        >
          {VIEWS.map((_view) => (
            <MenuItem key={_view} value={_view}>
              <Typography variant='h6' fontWeight='bold'>
                {startCase(_view)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      )}
      {!account.account_id && (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            height: 35,
          }}
        >
          <ReactiveButton
            label='Refresh'
            handleClick={handleRefresh}
            Icon={LoopIcon}
            color='primary'
            variant='outlined'
          />
          <ReactiveButton
            label='Account'
            handleClick={createAccount}
            Icon={AddIcon}
            color='primary'
            variant='contained'
          />
        </Box>
      )}
    </>
  );
}

export { ALL, REAL_ESTATE, INVESTMENTS, VEHICLES, CASH, LOANS, CREDIT, VIEWS };
