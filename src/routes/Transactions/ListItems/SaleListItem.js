import React, { useEffect, useState } from 'react';

import ListItemText from '@mui/material/ListItemText';
import { numberToCurrency } from '../../../helpers/currency';
import { useSelector } from 'react-redux';

export default function RepaymentListItem(props) {
  const { transaction, parentWidth } = props;
  const securities = useSelector((state) => state.securities.data);
  const [ticker, setTicker] = useState(null);

  useEffect(() => {
    const security = securities.find(
      (security) => security.security_id === transaction.security_id
    );
    setTicker(security?.ticker);
    return () => {
      setTicker(null);
    };
  }, [transaction, securities]);

  return (
    <>
      <ListItemText
        primary={transaction.merchant}
        sx={{ maxWidth: 250, flex: 1 }}
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
      <ListItemText
        primary={new Intl.NumberFormat('en-US', {
          maximumFractionDigits: 5,
          minimumFractionDigits: 1,
        }).format(transaction.shares)}
        secondary={ticker}
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 600 ? 'none' : 'block',
          my: 0,
        }}
        slotProps={{
          primary: {
            align: 'left',
            variant: 'body1',
            sx: { lineHeight: 1, mb: 0.25 },
          },
          secondary: {
            align: 'left',
            variant: 'body2',
            sx: { lineHeight: 1 },
          },
        }}
      />
      <ListItemText
        primary={numberToCurrency.format(transaction.price)}
        sx={{
          maxWidth: 250,
          flex: 1,
          display: parentWidth < 900 ? 'none' : 'block',
        }}
        slotProps={{
          primary: { align: 'left' },
        }}
      />
    </>
  );
}
