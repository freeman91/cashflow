import React from 'react';
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { get, indexOf } from 'lodash';
import dayjs from 'dayjs';

export const DateTypeProvider = (props) => {
  const { data } = props;
  return (
    <DataTypeProvider
      formatterComponent={(props) => {
        const { value, row } = props;
        let idx = indexOf(data, row);
        if (
          data &&
          idx !== 0 &&
          get(data, `${idx - 1}.date`) === get(row, 'date')
        ) {
          return '';
        } else {
          return dayjs(value).format('MMMM D');
        }
      }}
      {...props}
    />
  );
};
