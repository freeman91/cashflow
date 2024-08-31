import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import Grid from '@mui/material/Grid';

import { StyledSubtab, StyledSubtabs } from '../../../components/StyledSubtabs';
import AccountsStack from './AccountsStack';
import AccountPage from './AccountPage';
import AssetPage from './Assets/AssetPage';
import AssetsStack from './Assets/AssetsStack';
import DebtsStack from './Debts/DebtsStack';
import DebtPage from './Debts/DebtPage';

const ACCOUNTS = 'accounts';
const ASSETS = 'assets';
const DEBTS = 'debts';
const SUBTABS = [ACCOUNTS, ASSETS, DEBTS];

export default function Accounts() {
  const location = useLocation();
  const dispatch = useDispatch();

  const accounts = useSelector((state) => state.accounts.data);
  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [subtab, setSubtab] = useState(SUBTABS[0]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedDebt, setSelectedDebt] = useState(null);

  useEffect(() => {
    if (location.state) {
      if ('accountId' in location.state) {
        const account = accounts.find(
          (account) => account.account_id === location.state.accountId
        );
        setSelectedAccount(account);
        setSelectedAsset(null);
        setSelectedDebt(null);
      } else if ('assetId' in location.state) {
        const asset = assets.find(
          (asset) => asset.asset_id === location.state.assetId
        );
        setSelectedAccount(null);
        setSelectedAsset(asset);
        setSelectedDebt(null);
      } else if ('debtId' in location.state) {
        const debt = debts.find(
          (debt) => debt.debt_id === location.state.debtId
        );
        setSelectedAccount(null);
        setSelectedAsset(null);
        setSelectedDebt(debt);
      }
    } else {
      setSelectedAccount(null);
      setSelectedAsset(null);
      setSelectedDebt(null);
    }
  }, [location, accounts, assets, debts]);

  useEffect(() => {
    const subtab = location.pathname.split('/')[3];
    if (subtab && SUBTABS.includes(subtab)) {
      setSubtab(subtab);
    } else {
      setSubtab(SUBTABS[0]);
    }
  }, [location.pathname]);

  const handleClick = (e) => {
    e.preventDefault();
    const newTab = e.target.name;
    dispatch(push(`/dashboard/accounts/${newTab}`));
  };

  const noSelection = !selectedAccount && !selectedAsset && !selectedDebt;
  return (
    <>
      <Grid item xs={12} mx={1} pt='0 !important'>
        <StyledSubtabs variant='fullWidth' sx={{ pb: 1 }} value={subtab}>
          {SUBTABS.map((_tab) => (
            <StyledSubtab
              key={_tab}
              label={_tab}
              value={_tab}
              name={_tab}
              onClick={handleClick}
            />
          ))}
        </StyledSubtabs>
      </Grid>
      {noSelection && subtab === ACCOUNTS && <AccountsStack />}
      {noSelection && subtab === ASSETS && <AssetsStack />}
      {noSelection && subtab === DEBTS && <DebtsStack />}
      {selectedAccount && <AccountPage account={selectedAccount} />}
      {selectedAsset && <AssetPage asset={selectedAsset} />}
      {selectedDebt && <DebtPage debt={selectedDebt} />}
    </>
  );
}
