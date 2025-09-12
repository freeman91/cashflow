import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Grid from '@mui/material/Grid2';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

import { openItemView } from '../store/itemView';
import ReactiveButton from './ReactiveButton';
import TransactionTypeDrawer from '../routes/Layout/CustomAppBar/TransactionTypeDrawer';
import TransactionListItem from '../routes/Transactions/ListItems/TransactionListItem';

export const TRANSACTION_ORDER = [
  'recurring',
  'income',
  'paycheck',
  'repayment',
  'expense',
  'transfer',
  'borrow',
  'purchase',
  'sale',
];

const DEFAULT_TYPES = ['expense', 'income', 'paycheck', 'repayment'];

export default function TransactionsTable(props) {
  const { transactionsByDay, showHeader = false } = props;
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false);
  const transactionAnchorRef = useRef(null);

  const handleTransactionMenuToggle = () => {
    setTransactionMenuOpen((prevOpen) => !prevOpen);
  };

  const handleTransactionMenuClose = (event) => {
    if (
      transactionAnchorRef.current &&
      transactionAnchorRef.current.contains(event.target)
    ) {
      return;
    }
    setTransactionMenuOpen(false);
  };

  const handleMenuItemClick = (type) => {
    dispatch(
      openItemView({
        itemType: type,
        mode: 'create',
        attrs: {},
      })
    );
    setTransactionMenuOpen(false);
  };

  return (
    <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          backgroundImage: (theme) => theme.vars.overlays[8],
          boxShadow: (theme) => theme.shadows[4],
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        {showHeader && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1,
            }}
          >
            <Typography variant='body1' fontWeight='bold' color='textSecondary'>
              TRANSACTIONS
            </Typography>
            <ReactiveButton
              ref={transactionAnchorRef}
              label='Transaction'
              handleClick={handleTransactionMenuToggle}
              Icon={AddIcon}
              color='primary'
            />
          </Box>
        )}
        <List disablePadding>
          {transactionsByDay.map((day, idx) => {
            if (day.transactions.length === 0) return null;
            return (
              <React.Fragment key={idx}>
                <ListItem
                  key={idx}
                  sx={{
                    backgroundImage: (theme) => theme.vars.overlays[8],
                    py: 0,
                  }}
                >
                  <ListItemText
                    primary={day.date.format('MMM Do, YYYY')}
                    slotProps={{
                      primary: { fontWeight: 'bold' },
                    }}
                  />
                  <ListItemText
                    secondary={day.date.isSame(dayjs(), 'day') ? 'Today' : ''}
                    slotProps={{
                      secondary: { align: 'right' },
                    }}
                  />
                </ListItem>
                {day.transactions.map((transaction, idx) => {
                  return (
                    <TransactionListItem key={idx} transaction={transaction} />
                  );
                })}
              </React.Fragment>
            );
          })}
        </List>
        {showHeader && !isMobile && (
          <Popper
            sx={{ zIndex: 1 }}
            open={transactionMenuOpen}
            anchorEl={transactionAnchorRef.current}
            role={undefined}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Box>
                  <ClickAwayListener onClickAway={handleTransactionMenuClose}>
                    <MenuList
                      id='transaction-menu'
                      autoFocusItem
                      disablePadding
                      sx={{
                        bgcolor: 'surface.300',
                        borderRadius: 1,
                        overflow: 'hidden',
                        boxShadow: (theme) => theme.shadows[4],
                      }}
                    >
                      {DEFAULT_TYPES.map((type) => (
                        <MenuItem
                          key={type}
                          onClick={() => handleMenuItemClick(type)}
                        >
                          {startCase(type)}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Box>
              </Grow>
            )}
          </Popper>
        )}
        {showHeader && isMobile && (
          <TransactionTypeDrawer
            open={transactionMenuOpen}
            onClose={() => setTransactionMenuOpen(false)}
          />
        )}
      </Box>
    </Grid>
  );
}
