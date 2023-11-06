import React from 'react';
// import { useDispatch } from 'react-redux';
import { map } from 'lodash';

import { useTheme } from '@mui/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
// import { openDialog } from '../../store/dialogs';

const CATERGORIES = [
  {
    category: 'bank',
    accounts: [
      {
        name: 'Huntington',
        description: 'Student Checking, Joint Checking, Mortgage',
        value: -195000,
      },
      { name: 'Ally', description: 'Savings', value: 2150 },
      { name: 'Apple Card', description: 'Goldman Sachs', value: 0 },
      { name: 'NelNet', description: 'Student Loans', value: -28065 },
      { name: 'Lowes MVP Card', description: 'Synchrony', value: 0 },
      { name: 'Home Depot Card', description: 'CitiBank', value: 0 },
      { name: 'Wells Fargo', description: 'Forester loan', value: -20657 },
    ],
  },
  {
    category: 'brokerage',
    accounts: [
      { name: 'Fidelity', value: 31250 },
      { name: 'Webull', value: 1678 },
      { name: 'Kraken', value: 3356 },
      { name: 'Uphold', value: 6.78 },
      { name: 'BlockFi', value: 2150 },
    ],
  },
  {
    category: 'property',
    accounts: [
      { name: '3437 Beulah Rd', value: 237000 },
      { name: '2021 Subaru Forester', value: 33000 },
    ],
  },
];

function AccountCard({ title, subheader, value }) {
  return (
    <Card sx={{ width: '100%' }} raised>
      <CardHeader
        title={title}
        subheader={subheader}
        titleTypographyProps={{ align: 'left' }}
        subheaderTypographyProps={{ align: 'left' }}
        sx={{
          '.MuiCardHeader-action': { alignSelf: 'center' },
        }}
        action={
          <Stack
            direction='row'
            mr={2}
            spacing={0}
            alignItems='center'
            justifyContent='flex-end'
          >
            <Typography align='center'>
              {numberToCurrency.format(value)}
            </Typography>
          </Stack>
        }
      />
    </Card>
  );
}

export default function Accounts() {
  // const dispatch = useDispatch();
  const theme = useTheme();
  // const allAccounts = useSelector((state) => state.accounts.data);
  // const allAssets = useSelector((state) => state.assets.data);
  // const allDebts = useSelector((state) => state.debts.data);

  // const [accounts, setAccounts] = useState({});

  // const handleClick = () => {
  //   dispatch(
  //     openDialog({
  //       type: 'account',
  //       mode: 'create',
  //     })
  //   );
  // };

  const renderAccounts = (category) => {
    return (
      <React.Fragment key={category.category}>
        <Typography key={category} align='left' sx={{ width: '100%' }}>
          {category.category}
        </Typography>
        {map(category.accounts, (account) => (
          <AccountCard
            key={account.name}
            title={account.name}
            value={account.value}
            subheader={account?.description}
          />
        ))}
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
        padding={2}
        sx={{ width: '100%', maxWidth: theme.breakpoints.maxWidth }}
      >
        {CATERGORIES.map(renderAccounts)}
      </Stack>
    </Box>
  );
}
