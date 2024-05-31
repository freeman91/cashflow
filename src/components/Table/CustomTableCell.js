import React from 'react';

import TableCell from '@mui/material/TableCell';

const CustomTableCell = ({
  idx,
  column,
  record,
  children,
  sx,
  ...restProps
}) => {
  return (
    <TableCell
      scope='row'
      {...restProps}
      sx={{
        lineHeight: 1,
        fontWeight: column === 'date' ? 800 : 500,
        ...sx,
      }}
    >
      {children}
    </TableCell>
  );
};
export { CustomTableCell };
