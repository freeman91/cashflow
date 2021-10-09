import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import numeral from 'numeral';

import { numberToCurrency } from '../../../helpers/currency';

export const AmountTypeProvider = (props) => {
  return (
    <DataTypeProvider
      formatterComponent={({ value, row }) => {
        if (row.category !== 'hour') {
          return numberToCurrency.format(value);
        } else {
          return numeral(value.toPrecision(2)).format('0,0.[00]');
        }
      }}
      {...props}
    />
  );
};
