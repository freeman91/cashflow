import React from 'react';

import useTheme from '@mui/material/styles/useTheme';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';

export default function NetValuesCard(props) {
  const { totalIncome, totalExpense, expanded, setExpanded } = props;
  const theme = useTheme();

  const net = totalIncome - totalExpense;
  const netPercent = net / totalIncome;
  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        backgroundImage: (theme) => theme.vars.overlays[8],
        boxShadow: (theme) => theme.shadows[4],
        borderRadius: 1,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          top: 0,
          right: 0,
          height: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton
          sx={{ height: 35, width: 35 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Typography color='textSecondary' variant='h6'>
        {'Net' + (net >= 0 ? ' Gains' : ' Losses')}
      </Typography>
      <Typography
        fontWeight='bold'
        variant='h5'
        sx={{ color: theme.palette.primary.main }}
      >
        {numberToCurrency.format(net)}
      </Typography>
      {expanded && (
        <List disablePadding sx={{ width: '100%' }}>
          <ListItem sx={{ py: 0 }}>
            <ListItemText
              secondary='Net Percent'
              slotProps={{ secondary: { variant: 'h6' } }}
            />
            <ListItemText
              primary={`${Math.round(netPercent * 100) / 100}%`}
              slotProps={{ primary: { align: 'right', variant: 'h6' } }}
            />
          </ListItem>
        </List>
      )}
    </Box>
  );
}
