import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import _range from 'lodash/range';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { openItemView } from '../../store/itemView';
import useTransactionsInRange from '../../store/hooks/useTransactions';
import { useTransactionFilters } from '../../store/hooks/useTransactionFilters';
import Day from './Day';
import TransactionFilters from '../../components/Selector/TransactionFilters';
import TransactionSummary from '../../components/TransactionSummary';
import ReactiveButton from '../../components/ReactiveButton';
import TransactionTypeDrawer from '../Layout/CustomAppBar/TransactionTypeDrawer';

const DEFAULT_TYPES = ['expense', 'income', 'paycheck', 'repayment'];

export default function TransactionsCalendar() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [month, setMonth] = useState(dayjs());
  const [range, setRange] = useState({ start: null, end: null });
  const [filters, setFilters] = useState({
    types: [],
    amountOperator: '',
    amountValue: '',
    keyword: '',
    category: '',
  });

  const [transactionMenuOpen, setTransactionMenuOpen] = useState(false);
  const [mobileTransactionMenuOpen, setMobileTransactionMenuOpen] =
    useState(false);
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

  const days = useTransactionsInRange(filters.types, range);
  const { filteredTransactions, categories } = useTransactionFilters(
    days.flatMap((day) => day.transactions),
    filters
  );

  // Group filtered transactions back into days
  const filteredDays = days.map((day) => ({
    ...day,
    transactions: day.transactions.filter((transaction) =>
      filteredTransactions.includes(transaction)
    ),
  }));

  useEffect(() => {
    let firstDayOfMonth = month.date(1).hour(12).minute(0).second(0);
    setRange({
      start: firstDayOfMonth.hour(12).minute(0).second(0),
      end: firstDayOfMonth.add(1, 'month').subtract(1, 'day'),
    });
  }, [month]);

  const numEmptyDaysBeforeFirstDay = filteredDays[0]?.date.day() || 0;
  const numEmptyDaysAfterLastDay =
    6 - (filteredDays[filteredDays.length - 1]?.date.day() || 0);
  const numRows = Math.ceil(
    (filteredDays.length +
      numEmptyDaysBeforeFirstDay +
      numEmptyDaysAfterLastDay) /
      7
  );

  if ((range.start === null && range.end === null) || days.length === 0) {
    return null;
  }
  return (
    <>
      {isMobile && (
        <Grid size={{ xs: 12 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={() => setMobileTransactionMenuOpen(true)}
            sx={{
              width: '100%',
              py: 1,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Create Transaction
          </Button>
        </Grid>
      )}
      <Grid size={{ xs: 12 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            px: 2,
            py: 1,
          }}
        >
          <Grid container spacing={2} alignItems='center'>
            <Grid size={{ xs: 9, sm: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DatePicker
                  openTo='month'
                  views={['year', 'month']}
                  sx={{ flexGrow: 1, maxWidth: { xs: 'none', sm: 200 } }}
                  value={month}
                  onChange={(newValue) => setMonth(newValue)}
                  slotProps={{
                    textField: {
                      variant: 'standard',
                      inputProps: {
                        readOnly: true,
                      },
                      InputProps: { disableUnderline: true },
                    },
                    inputAdornment: {
                      position: 'start',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => setMonth(month.subtract(1, 'month'))}
                  >
                    <ArrowBack />
                  </IconButton>
                  <IconButton onClick={() => setMonth(month.add(1, 'month'))}>
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
            <Grid
              size={{ xs: 3, sm: 6 }}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!isMobile && (
                  <ReactiveButton
                    ref={transactionAnchorRef}
                    label='Transaction'
                    handleClick={handleTransactionMenuToggle}
                    Icon={AddIcon}
                    color='primary'
                  />
                )}
                <TransactionFilters
                  filters={filters}
                  setFilters={setFilters}
                  categories={categories}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <TransactionSummary transactionsByDay={filteredDays} />
      </Grid>

      <Grid size={{ xs: 12 }} sx={{ mb: 8 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            backgroundImage: (theme) => theme.vars.overlays[8],
            boxShadow: (theme) => theme.shadows[4],
            borderRadius: 1,
            width: '100%',
          }}
        >
          <Grid container columns={7}>
            {_range(7).map((idx) => (
              <Grid
                key={`week-day-letter-${idx}`}
                size={{ xs: 1 }}
                py={0.5}
                sx={{
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography align='center' variant='body2'>
                  {dayjs()
                    .day(idx)
                    .format(isMobile ? 'ddd' : 'dddd')}
                </Typography>
              </Grid>
            ))}
            {numEmptyDaysBeforeFirstDay > 0 && (
              <>
                {_range(numEmptyDaysBeforeFirstDay).map((idx) => (
                  <Grid
                    key={`empty-day-${idx}`}
                    size={{ xs: 1 }}
                    sx={{
                      borderRight: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                      borderBottom: (theme) =>
                        `1px solid ${theme.palette.divider}`,
                    }}
                  />
                ))}
              </>
            )}
            {filteredDays.map((day) => {
              return (
                <Grid
                  key={`day-${day.date.format('YYYY-MM-DD')}`}
                  size={{ xs: 1 }}
                  sx={{
                    borderRight: (theme) =>
                      day.date.day() % 7 !== 6
                        ? `1px solid ${theme.palette.divider}`
                        : '',
                    borderBottom: (theme) =>
                      (numEmptyDaysBeforeFirstDay + day.date.date()) / 7 <=
                      numRows - 1
                        ? `1px solid ${theme.palette.divider}`
                        : '',
                  }}
                >
                  <Day
                    month={month}
                    date={day.date}
                    transactions={day.transactions}
                  />
                </Grid>
              );
            })}
            {numEmptyDaysAfterLastDay > 0 && (
              <>
                {_range(numEmptyDaysAfterLastDay).map((idx) => (
                  <Grid
                    key={`empty-day-${idx}`}
                    size={{ xs: 1 }}
                    sx={{
                      borderRight: (theme) => {
                        // if last grid item, don't add border
                        if (
                          idx ===
                          6 -
                            filteredDays[filteredDays.length - 1].date.day() -
                            1
                        ) {
                          return '';
                        }
                        return `1px solid ${theme.palette.divider}`;
                      },
                    }}
                  />
                ))}
              </>
            )}
          </Grid>
        </Box>
        {!isMobile && (
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
        {isMobile && (
          <TransactionTypeDrawer
            open={transactionMenuOpen}
            onClose={() => setTransactionMenuOpen(false)}
          />
        )}
      </Grid>
      {isMobile && (
        <TransactionTypeDrawer
          open={mobileTransactionMenuOpen}
          onClose={() => setMobileTransactionMenuOpen(false)}
        />
      )}
    </>
  );
}
