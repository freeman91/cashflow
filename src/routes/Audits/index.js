import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { getAudits } from '../../store/audits';

export default function Audits() {
  const dispatch = useDispatch();
  const audits = useSelector((state) => state.audits.data);

  useEffect(() => {
    dispatch(getAudits());
  }, [dispatch]);

  return (
    <Grid
      container
      spacing={2}
      justifyContent='center'
      alignItems='flex-start'
      sx={{
        width: '100%',
        maxWidth: '1500px',
        margin: 'auto',
        px: 1,
        pb: 6,
      }}
    >
      <Grid size={{ xs: 12 }} sx={{ width: '100%' }}>
        <List disablePadding>
          <ListItem>
            <ListItemText
              primary='Timestamp'
              slotProps={{
                primary: { fontWeight: 'bold' },
              }}
              sx={{ width: '20%' }}
            />
            <ListItemText primary='Status' sx={{ width: '5%' }} />
            <ListItemText primary='User ID' sx={{ width: '10%' }} />
            <ListItemText primary='Action' sx={{ width: '15%' }} />
            <ListItemText primary='Message' sx={{ width: '40%' }} />
          </ListItem>
          {audits.map((audit, idx) => {
            return (
              <ListItem
                key={idx}
                sx={{
                  backgroundColor: 'background.paper',
                  backgroundImage: (theme) => theme.vars.overlays[8],
                  borderRadius: 1,
                  marginBottom: 1,
                }}
              >
                <ListItemText
                  primary={dayjs(audit.timestamp).format(
                    'MMM Do, YYYY hh:mm A'
                  )}
                  sx={{ width: '20%' }}
                  slotProps={{
                    primary: {
                      fontWeight: 'bold',
                      sx: {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    },
                  }}
                />
                <ListItemText
                  primary={audit.status === 'success' ? '✅' : '❌'}
                  sx={{ width: '5%' }}
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
                  primary={audit.user_id}
                  sx={{ width: '10%' }}
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
                  primary={audit.action}
                  sx={{ width: '15%' }}
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
                  primary={audit.message}
                  sx={{ width: '40%' }}
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
              </ListItem>
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
}
