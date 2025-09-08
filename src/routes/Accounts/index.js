import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import get from 'lodash/get';

import {
  ALL,
  REAL_ESTATE,
  INVESTMENTS,
  VEHICLES,
  CASH,
  LOANS,
  CREDIT,
} from '../Layout/CustomAppBar/AccountsAppBar';
import Account from './Account';
import AccountsAll from './All';
import AccountCategory from './AccountCategory';
import { ASSET, LIABILITY } from '../../components/Forms/AccountForm';

export default function Accounts() {
  const location = useLocation();

  const accounts = useSelector((state) => state.accounts.data);
  const showInactive = useSelector((state) => state.accounts.showInactive);
  const [account, setAccount] = useState(null);
  const [view, setView] = useState(ALL);

  useEffect(() => {
    let path2 = get(location.pathname.split('/'), 2);
    path2 = path2?.replace(/%20/g, ' ');

    if (path2) {
      const _account = accounts.find((a) => a.name === path2);
      if (_account) {
        setAccount(_account);
        return;
      } else {
        setView(path2);
      }
    }
    setAccount(null);
  }, [location, accounts]);

  if (account) return <Account account={account} />;
  if (view === ALL) return <AccountsAll showInactive={showInactive} />;
  if (view === REAL_ESTATE)
    return (
      <AccountCategory
        accountType={ASSET}
        assetType='Real Estate'
        showInactive={showInactive}
      />
    );
  if (view === INVESTMENTS)
    return (
      <AccountCategory
        accountType={ASSET}
        assetType='Investment'
        showInactive={showInactive}
      />
    );
  if (view === VEHICLES)
    return (
      <AccountCategory
        accountType={ASSET}
        assetType='Vehicle'
        showInactive={showInactive}
      />
    );
  if (view === CASH)
    return (
      <AccountCategory
        accountType={ASSET}
        assetType='Cash'
        showInactive={showInactive}
      />
    );
  if (view === LOANS)
    return (
      <AccountCategory
        accountType={LIABILITY}
        liabilityType='Loan'
        showInactive={showInactive}
      />
    );
  if (view === CREDIT)
    return (
      <AccountCategory
        accountType={LIABILITY}
        liabilityType='Credit'
        showInactive={showInactive}
      />
    );
}
