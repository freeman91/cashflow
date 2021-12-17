import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { get, reduce, filter as filter_ } from 'lodash';
import { Divider, Typography } from '@mui/material';
import { numberToCurrency } from '../../helpers/currency';

import DebtForm from '../Form/DebtForm';
import CreateButton from '../Button/CreateButton';
import CreateDialog from '../Dialog/CreateDialog';
import AssetDebtDialog from '../Dialog/AssetDebtDialog';
import { divStyle, textStyle } from './styles';

export default function DebtsContainer() {
  const { data: debts } = useSelector((state) => state.debts);
  const [open, setOpen] = useState(false);
  const [selectedDebts, setSelectedDebts] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    if (selectedFilter === 'tuition') {
      setTitle('Tution');
      setSelectedDebts(
        filter_(debts, (debt) => {
          return get(debt, 'type') === 'tuition';
        })
      );
    } else if (selectedFilter === 'credit') {
      setTitle('Credit');
      setSelectedDebts(
        filter_(debts, (debt) => {
          return get(debt, 'type') === 'credit';
        })
      );
    } else if (selectedFilter === 'else') {
      setTitle('All Other Debts');
      setSelectedDebts(
        filter_(debts, (debt) => {
          return (
            get(debt, 'type') !== 'tuition' && get(debt, 'type') !== 'credit'
          );
        })
      );
    } else if (selectedFilter === 'all') {
      setTitle('All Debts');
      setSelectedDebts(debts);
    } else {
      setTitle('');
      setSelectedDebts([]);
    }
  }, [debts, selectedFilter]);

  const handleClick = (filter) => {
    setSelectedFilter(filter);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFilter('');
  };

  let tuitionValue = 0;
  let creditValue = 0;
  let elseValue = 0;
  let totalValue = reduce(
    debts,
    (sum, debt) => {
      let value = get(debt, 'value');
      if (get(debt, 'type') === 'tuition') {
        tuitionValue += value;
      } else if (get(debt, 'type') === 'credit') {
        creditValue += value;
      } else {
        elseValue += value;
      }
      return sum + value;
    },
    0
  );

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          minWidth: 275,
        }}
      >
        <Typography
          variant='h4'
          gutterBottom
          onClick={() => handleClick('all')}
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

      <div style={divStyle} onClick={() => handleClick('all')}>
        <Typography variant='h5' sx={textStyle}>
          Total Value...
        </Typography>
        <Typography variant='h5' sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(totalValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('tuition')}>
        <Typography sx={textStyle}>Tuition Value...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(tuitionValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('credit')}>
        <Typography sx={textStyle}>Credit Value...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(creditValue)}
        </Typography>
      </div>

      <div style={divStyle} onClick={() => handleClick('else')}>
        <Typography sx={textStyle}>Everything Else...</Typography>
        <Typography sx={{ mt: '.25rem' }}>
          {numberToCurrency.format(elseValue)}
        </Typography>
      </div>
      <AssetDebtDialog
        open={open}
        handleClose={handleClose}
        records={selectedDebts}
        title={title}
      />
    </>
  );
}
