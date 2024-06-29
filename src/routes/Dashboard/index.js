import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { setAppBar } from '../../store/appSettings';
import { refresh } from '../../store/user';
import usePullToRefresh from '../../store/hooks/usePullRefresh';
import Cashflow from './Cashflow';
import Networth from './Networth';
// import UpcomingExpenses from './UpcomingExpenses';
// import RecentTransactions from './RecentTransactions';
// import Networth from './Networth';
// import MonthYearSelector from '../../components/Selector/MonthYearSelector';
// import Calendar from '../Calendar';

const SettingsButton = () => {
  const dispatch = useDispatch();
  return (
    <IconButton
      edge='end'
      size='small'
      onClick={() => dispatch(push('/settings'))}
    >
      <MoreVertIcon />
    </IconButton>
  );
};

// const Tab = (props) => {
//   const { label, Icon, tab, currentTab, setTab, orientation } = props;

//   let borderRadius = '0 4px 4px 0';
//   if (orientation === 'left') {
//     borderRadius = '4px 0 0 4px';
//   }

//   let borderWidth = '1px 1px 1px 0';
//   if (orientation === 'left') {
//     borderWidth = '1px 0 1px 1px';
//   }

//   return (
//     <ButtonBase sx={{ width: '50%', height: '100%' }}>
//       <Box
//         sx={{
//           width: '100%',
//           height: '100%',
//           backgroundColor: currentTab === tab ? 'primary.main' : 'black',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           borderRadius: borderRadius,
//           borderColor: currentTab !== tab ? 'primary.main' : 'unset',
//           borderStyle: currentTab !== tab ? 'solid' : 'unset',
//           borderWidth: currentTab !== tab ? borderWidth : 'unset',
//         }}
//         onClick={() => {
//           currentTab !== tab && setTab(tab);
//         }}
//       >
//         <Icon sx={{ color: currentTab === tab ? 'black' : 'primary.main' }} />
//         <Typography
//           color={currentTab === tab ? 'black' : 'primary.main'}
//           align='center'
//           sx={{ ml: 2 }}
//         >
//           {label}
//         </Typography>
//       </Box>
//     </ButtonBase>
//   );
// };

export default function Dashboard() {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const loading = useSelector((state) => state.loadingBar.default);

  const onTrigger = async () => {
    dispatch(refresh());
  };

  usePullToRefresh(ref, onTrigger);

  useEffect(() => {
    dispatch(
      setAppBar({
        title: null,
        rightAction: <SettingsButton />,
      })
    );
  }, [dispatch]);

  return (
    <Box
      sx={{
        overflowY: 'scroll',
        height: '100%',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <Grid
        ref={ref}
        container
        spacing={1}
        justifyContent='center'
        alignItems='flex-start'
      >
        {loading > 0 && (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Grid>
        )}
        <Cashflow />
        <Networth />
      </Grid>
    </Box>
  );
}
