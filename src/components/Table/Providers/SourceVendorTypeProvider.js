import React from 'react';
import { get } from 'lodash';
import { DataTypeProvider } from '@devexpress/dx-react-grid';

export const SourceVendorTypeProvider = (props) => {
  return (
    <DataTypeProvider
      formatterComponent={({ value, row }) => {
        if (row.category === 'expense') {
          return get(row, 'vendor', '');
        } else {
          return value;
        }
      }}
      {...props}
    />
  );
};
