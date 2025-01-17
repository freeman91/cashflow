import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';

import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import { numberToCurrency } from '../../helpers/currency';
import { openItemView } from '../../store/itemView';

const ORDER = ['paycheck', 'income', 'repayment', 'expense'];

function findAmount(recurring) {
  if (recurring.item_type === 'paycheck')
    return get(recurring, 'paycheck_attributes.take_home');
  return get(recurring, `${recurring.item_type}_attributes.amount`);
}

export default function RecurringList() {
  const dispatch = useDispatch();
  const parentRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const recurrings = useSelector((state) => state.recurrings.data);

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
    dispatch(
      openItemView({
        itemType: 'recurring',
        mode: 'edit',
        attrs: recurring,
      })
    );
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
                backgroundColor: 'background.paper',
                backgroundImage: (theme) => theme.vars.overlays[8],
                boxShadow: (theme) => theme.shadows[4],
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <ListItem
                disablePadding
                sx={{
                  backgroundImage: (theme) => theme.vars.overlays[8],
                  px: 2,
                }}
              >
                <ListItemText
                  primary={startCase(group.item_type) + 's'}
                  slotProps={{
                    primary: {
                      fontWeight: 'bold',
                      variant: 'h6',
                    },
                  }}
                />
                {group.recurrings.length > 1 && (
                  <ListItemText
                    primary={numberToCurrency.format(group.sum)}
                    slotProps={{
                      primary: {
                        fontWeight: 'bold',
                        align: 'right',
                        variant: 'h6',
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
                        dayjs(recurring.next_date).format(
                          isMobile ? 'M/D/YY' : 'MMM Do, YYYY'
                        )
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
    </Grid>
  );
}
