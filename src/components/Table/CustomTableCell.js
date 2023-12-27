import React from 'react';

import TableCell from '@mui/material/TableCell';

const CustomTableCell = ({ idx, column, record, children, ...restProps }) => {
  return (
    <TableCell
      scope='row'
      {...restProps}
      sx={{
        borderBottom: 0,
        borderTop: idx === 0 ? '1px solid rgba(81, 81, 81, .5)' : 0,
        fontWeight: column === 'date' ? 800 : 500,
      }}
    >
      {children}
    </TableCell>
  );
};
export { CustomTableCell };
