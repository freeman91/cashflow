import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import get from 'lodash/get';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useMediaQuery from '@mui/material/useMediaQuery';
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { openItemView } from '../../../store/itemView';
import { setShowInactive } from '../../../store/accounts';
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
  const [anchorEl, setAnchorEl] = useState(null);
  const showInactive = useSelector((state) => state.accounts.showInactive);
  const open = Boolean(anchorEl);
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

  const openAccountDialog = () => {
    dispatch(
      openItemView({
        itemType: 'account',
        mode: 'edit',
        attrs: account,
      })
    );
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleViewChange = (newView) => {
    dispatch(push(`/accounts/${newView}`));
    handleMenuClose();
  };

  const handleShowInactiveToggle = () => {
    dispatch(setShowInactive(!showInactive));
    handleMenuClose();
  };

  return (
    <>
      {isMobile ? (
        // Mobile Layout: Center title + Right ellipsis menu
        <>
          <Typography
            variant='h5'
            fontWeight='bold'
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '60%',
            }}
          >
            {account.account_id
              ? account.name
              : view === ALL
              ? 'Accounts'
              : startCase(view)}
          </Typography>
          <IconButton onClick={handleMenuClick} sx={{ ml: 'auto' }}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {VIEWS.includes(view) && (
              <>
                {VIEWS.map((_view) => (
                  <MenuItem key={_view} onClick={() => handleViewChange(_view)}>
                    <Typography variant='body2'>{startCase(_view)}</Typography>
                  </MenuItem>
                ))}
                <MenuItem divider />
              </>
            )}
            {!account.account_id && (
              <MenuItem
                onClick={() => {
                  createAccount();
                  handleMenuClose();
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                <Typography variant='body2'>Create Account</Typography>
              </MenuItem>
            )}
            {account.account_id && (
              <MenuItem
                onClick={() => {
                  openAccountDialog();
                  handleMenuClose();
                }}
              >
                <EditIcon sx={{ mr: 1 }} />
                <Typography variant='body2'>Edit Account</Typography>
              </MenuItem>
            )}
            <MenuItem onClick={handleShowInactiveToggle}>
              {showInactive ? (
                <VisibilityOffIcon sx={{ mr: 1 }} />
              ) : (
                <VisibilityIcon sx={{ mr: 1 }} />
              )}
              <Typography variant='body2'>
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      ) : (
        // Desktop Layout: Original layout
        <>
          <StyledBreadcrumbs
            isMobile={isMobile}
            sx={{
              ml: isMobile ? 0 : 1,
              width: '100%',
            }}
          >
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
                  color={!account.active ? 'text.disabled' : 'text.primary'}
                >
                  {account.name}
                </Typography>
              </Box>
            )}
          </StyledBreadcrumbs>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              height: 35,
            }}
          >
            {!account.account_id && (
              <ReactiveButton
                label='Account'
                handleClick={createAccount}
                Icon={AddIcon}
                color='primary'
                variant='contained'
              />
            )}
            {account.account_id && (
              <ReactiveButton
                label='Edit'
                handleClick={openAccountDialog}
                Icon={EditIcon}
                color='primary'
                variant='outlined'
              />
            )}
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {VIEWS.includes(view) && (
              <>
                {VIEWS.map((_view) => (
                  <MenuItem key={_view} onClick={() => handleViewChange(_view)}>
                    <Typography variant='body2'>{startCase(_view)}</Typography>
                  </MenuItem>
                ))}
                <MenuItem divider />
              </>
            )}
            <MenuItem onClick={handleShowInactiveToggle}>
              {showInactive ? (
                <VisibilityOffIcon sx={{ mr: 1 }} />
              ) : (
                <VisibilityIcon sx={{ mr: 1 }} />
              )}
              <Typography variant='body2'>
                {showInactive ? 'Hide Inactive' : 'Show Inactive'}
              </Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
}

export { ALL, REAL_ESTATE, INVESTMENTS, VEHICLES, CASH, LOANS, CREDIT, VIEWS };
