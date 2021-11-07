import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { get, reduce, filter as filter_ } from 'lodash';
import { Card, CardContent, Divider, Typography } from '@mui/material';
import { numberToCurrency } from '../../helpers/currency';

import DebtForm from '../Form/DebtForm';
import CreateButton from '../Button/CreateButton';
import CreateDialog from '../Dialog/CreateDialog';
import DebtTableDialog from '../Dialog/DebtTableDialog';
import { divStyle, textStyle } from './styles';

export default function DebtsCard() {
  const { data: debts } = useSelector((state) => state.debts);
  const [open, setOpen] = useState(false);
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [title, setTitle] = useState('');

  const handleClick = (e, filter) => {
    e.preventDefault();
    // if (filter === 'crypto') {
    //   setTitle('Crypto');
    //   setSelectedDebts(
    //     filter_(debts, (debt) => {
    //       return get(debt, 'type') === 'crypto';
    //     })
    //   );
    //   setOpen(true);
    // } else if (filter === 'stocks') {
    //   setTitle('Stocks');
    //   setSelectedDebts(
    //     filter_(debts, (asset) => {
    //       return get(asset, 'type') === 'stock';
    //     })
    //   );
    //   setOpen(true);
    // } else if (filter === 'else') {
    //   setTitle('All Other Debts');
    //   setSelectedDebts(
    //     filter_(assets, (asset) => {
    //       return (
    //         get(asset, 'type') !== 'crypto' && get(asset, 'type') !== 'stock'
    //       );
    //     })
    //   );
    //   setOpen(true);
    // } else {
    //   setTitle('All Debts');
    //   setSelectedDebts(assets);
    //   setOpen(true);
    // }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDebts([]);
    setTitle('');
  };

  console.log('debts: ', debts);

  let tuitionValue = 0;
  let creditValue = 0;
  let elseValue = 0;
  let totalValue = reduce(
    debts,
    (sum, debt) => {
      // let value = get(debt, 'value');
      // if (get(debt, 'type') === 'crypto') {
      //   cryptoValue += value;
      // } else if (get(debt, 'type') === 'crypto') {
      //   stocksValue += value;
      // } else {
      //   elseValue += value;
      // }
      // return sum + value;
    },
    0
  );

  return (
    <>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant='h4'
              gutterBottom
              onClick={(e) => handleClick(e, 'all')}
            >
              Debts
            </Typography>
            <CreateButton>
              <CreateDialog title='Create Debt'>
                <DebtForm mode='create' />
              </CreateDialog>
            </CreateButton>
          </div>

          <Divider sx={{ mb: '1rem' }} />

          <div style={divStyle} onClick={(e) => handleClick(e, 'all')}>
            <Typography variant='h5' sx={textStyle}>
              Total Value...
            </Typography>
            <Typography variant='h5' sx={{ mt: '.25rem' }}>
              {numberToCurrency.format(totalValue)}
            </Typography>
          </div>

          <div style={divStyle} onClick={(e) => handleClick(e, 'tuition')}>
            <Typography sx={textStyle}>Tuition Value...</Typography>
            <Typography sx={{ mt: '.25rem' }}>
              {numberToCurrency.format(tuitionValue)}
            </Typography>
          </div>

          <div style={divStyle} onClick={(e) => handleClick(e, 'credit')}>
            <Typography sx={textStyle}>Credit Value...</Typography>
            <Typography sx={{ mt: '.25rem' }}>
              {numberToCurrency.format(creditValue)}
            </Typography>
          </div>

          <div style={divStyle} onClick={(e) => handleClick(e, 'else')}>
            <Typography sx={textStyle}>Everything Else...</Typography>
            <Typography sx={{ mt: '.25rem' }}>
              {numberToCurrency.format(elseValue)}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <DebtTableDialog
        open={open}
        handleClose={handleClose}
        debts={selectedDebts}
        title={title}
      />
    </>
  );
}
