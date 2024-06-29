import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import reduce from 'lodash/reduce';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { setAppBar } from '../../store/appSettings';
import NetworthChart from './NetworthChart';
// import CurrentNetworth from '../Dashboard/Networth/CurrentNetworth';
// import SelectedNetworth from './SelectedNetworth';
import PageSelect from '../../components/Selector/PageSelect';
import { BackButton } from '../Layout/CustomAppBar';

export default function Networth() {
  const dispatch = useDispatch();

  const networths = useSelector((state) => state.networths.data);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const latestNetworth = reduce(
      networths,
      (mostRecent, current) => {
        if (!mostRecent) return current;

        const mostRecentDate = new Date(mostRecent.year, mostRecent.month - 1);
        const currentDate = new Date(current.year, current.month - 1);

        return currentDate > mostRecentDate ? current : mostRecent;
      },
      null
    );
    latestNetworth && setSelectedId(latestNetworth.networth_id);
  }, [networths]);

  useEffect(() => {
    // dispatch(
    //   setAppBar({
    //     title: 'networth',
    //     leftAction: <BackButton />,
    //     rightAction: <PageSelect />,
    //   })
    // );
  }, [dispatch]);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        // pl: 1,
        // pr: 1,
        // pt: 1,
        mb: 10,
      }}
    >
      <Grid item xs={12}>
        <Typography variant='h5' sx={{ ml: 2 }}>
          Net Worth
        </Typography>
      </Grid>
      {/* <Grid item xs={12}>
        <Card>
          <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
            <NetworthChart setSelectedId={setSelectedId} />
          </CardContent>
        </Card>
      </Grid>
      {selectedId ? (
        <SelectedNetworth selectedId={selectedId} />
      ) : (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title='current'
              sx={{ p: 1, pt: '4px', pb: 0 }}
              titleTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
              action={
                <IconButton
                  size='small'
                  onClick={() => dispatch(push('/accounts'))}
                >
                  <ArrowForwardIosIcon />
                </IconButton>
              }
            />
            <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
              <CurrentNetworth />
            </CardContent>
          </Card>
        </Grid>
      )}*/}
    </Grid>
  );
}
