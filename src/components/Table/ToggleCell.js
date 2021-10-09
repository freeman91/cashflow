import React from 'react';

import { TableCell, IconButton, useTheme } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export const ToggleCell = ({
  style,
  expanded,
  classes,
  onToggle,
  tableColumn,
  tableRow,
  row,
  expandTooltip,
  collapseTooltip,
  className,
  ...restProps
}) => {
  const theme = useTheme();
  const handleClick = (e) => {
    e.stopPropagation();
    onToggle();
  };

  if (row.name === 'Net Worth') {
    return (
      <TableCell
        {...restProps}
        style={{
          borderBottom: `1px solid ${theme.palette.grey[900]}`,
        }}
      />
    );
  }

  return (
    <TableCell
      {...restProps}
      style={{
        borderBottom: `1px solid ${theme.palette.grey[900]}`,
      }}
    >
      <IconButton onClick={handleClick} size='small'>
        {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </TableCell>
  );
};
