import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';

import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

export default function Account(props) {
  const { account } = props;

  const assets = useSelector((state) => state.assets.data);
  const debts = useSelector((state) => state.debts.data);

  const [accountAssets, setAccountAssets] = useState([]);
  const [accountDebts, setAccountDebts] = useState([]);

  useEffect(() => {
    setAccountAssets(filter(assets, { account_id: account.account_id }));
    setAccountDebts(filter(debts, { account_id: account.account_id }));
  }, [account, assets, debts]);

  return (
    <>
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='body1'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {account.name}
        </Typography>
        {(accountAssets.length > 0 || accountDebts.length > 0) && (
          <Typography variant='body2' color='textSecondary'>
            {accountAssets.length > 0 && `${accountAssets.length} asset`}
            {accountAssets.length > 1 && 's'}
            {accountAssets.length > 0 && accountDebts.length > 0 && ', '}
            {accountDebts.length > 0 && `${accountDebts.length} debt`}
            {accountDebts.length > 1 && 's'}
          </Typography>
        )}
      </BoxFlexColumn>
      <BoxFlexCenter>
        <Typography variant='body1' color='textSecondary'>
          $
        </Typography>
        <Typography variant='h6' color='white' fontWeight='bold'>
          {_numberToCurrency.format(account.net)}
        </Typography>
      </BoxFlexCenter>
    </>
  );
}
