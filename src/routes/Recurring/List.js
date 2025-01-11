import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import RecurringDrawer from './RecurringDrawer';

const ORDER = ['paycheck', 'income', 'repayment', 'expense'];

function findAmount(recurring) {
  if (recurring.item_type === 'paycheck')
    return get(recurring, 'paycheck_attributes.take_home');
  return get(recurring, `${recurring.item_type}_attributes.amount`);
}

export default function RecurringList() {
  const parentRef = useRef(null);
  const recurrings = useSelector((state) => state.recurrings.data);

  const [mode, setMode] = useState('edit');
  const [selectedRecurring, setSelectedRecurring] = useState(null);
  const [groupedRecurrings, setGroupedRecurrings] = useState([]);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      setWidth(element.offsetWidth);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    let _groupedRecurrings = groupBy(recurrings, 'item_type');
    _groupedRecurrings = Object.entries(_groupedRecurrings).map(
      ([item_type, _recurrings]) => {
        const sum = _recurrings.reduce(
          (acc, recurring) => acc + findAmount(recurring),
          0
        );
        // sort recurrings by next_date, if next_date is null, it's last, then by amount
        const sortedRecurrings = _recurrings.sort((a, b) => {
          if (!a.next_date) return 1;
          if (!b.next_date) return -1;
          if (a.next_date === b.next_date) {
            return findAmount(b) - findAmount(a);
          }
          return dayjs(a.next_date).diff(dayjs(b.next_date));
        });

        return {
          item_type,
          sum,
          recurrings: sortedRecurrings,
        };
      }
    );
    _groupedRecurrings = sortBy(_groupedRecurrings, (group) =>
      ORDER.indexOf(group.item_type)
    );
    setGroupedRecurrings(_groupedRecurrings);
  }, [recurrings]);

  const handleClick = (recurring) => {
    setSelectedRecurring(recurring);
    setMode('edit');
  };

  return (
    <Grid
      container
      spacing={2}
      size={{ xs: 12 }}
      ref={parentRef}
      sx={{ width: '100%' }}
    >
      {groupedRecurrings.map((group, idx) => {
        return (
          <Grid key={idx} size={{ xs: 12 }}>
            <List
              disablePadding
              sx={{
                width: '100%',
                backgroundColor: 'surface.250',
                borderRadius: 1,
                boxShadow: (theme) => theme.shadows[4],
                overflow: 'hidden',
              }}
            >
              <ListItem sx={{ backgroundColor: 'surface.300', pl: 2 }}>
                <ListItemText
                  primary={group.item_type}
                  slotProps={{
                    primary: {
                      fontWeight: 'bold',
                      fontSize: 18,
                    },
                  }}
                />
                {group.recurrings.length > 1 && (
                  <ListItemText
                    primary={numberToCurrency.format(group.sum)}
                    slotProps={{
                      primary: {
                        fontWeight: 'bold',
                        fontSize: 18,
                        align: 'right',
                      },
                    }}
                  />
                )}
              </ListItem>
              {group.recurrings.map((recurring, idx) => {
                return (
                  <ListItemButton
                    key={idx}
                    disableGutters
                    onClick={() => handleClick(recurring)}
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      py: 0.5,
                      m: 0.5,
                    }}
                  >
                    <ListItemText
                      primary={recurring.name}
                      sx={{ width: '25%' }}
                      slotProps={{
                        primary: {
                          sx: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        },
                      }}
                    />
                    <ListItemText
                      primary={recurring.frequency}
                      sx={{
                        width: '20%',
                        display: width < 600 ? 'none' : 'block',
                      }}
                    />
                    <ListItemText
                      primary={recurring.interval}
                      sx={{
                        width: '20%',
                        display: width < 600 ? 'none' : 'block',
                      }}
                    />
                    <ListItemText
                      primary={
                        recurring?.next_date &&
                        dayjs(recurring.next_date).format('MMM Do, YYYY')
                      }
                      slotProps={{
                        primary: { align: 'right' },
                      }}
                      sx={{ width: '20%' }}
                    />
                    <ListItemText
                      primary={numberToCurrency.format(findAmount(recurring))}
                      slotProps={{
                        primary: { align: 'right' },
                      }}
                      sx={{ width: '20%' }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Grid>
        );
      })}
      <RecurringDrawer
        mode={mode}
        recurring={selectedRecurring}
        setSelectedRecurring={setSelectedRecurring}
      />
    </Grid>
  );
}
