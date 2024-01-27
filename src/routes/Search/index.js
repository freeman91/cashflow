import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Expenses from './Expenses';
import Incomes from './Incomes';
import Bills from './Bills';
import Accounts from './Accounts';
import Assets from './Assets';
import Debts from './Debts';

const TYPES = ['expenses', 'incomes', 'bills', 'accounts', 'assets', 'debts'];

export default function Search() {
  const [selected, setSelected] = useState('expenses');

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  const render = () => {
    switch (selected) {
      case 'expenses':
        return <Expenses />;
      case 'incomes':
        return <Incomes />;
      case 'bills':
        return <Bills />;
      case 'accounts':
        return <Accounts />;
      case 'assets':
        return <Assets />;
      case 'debts':
        return <Debts />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Card
          raised
          sx={{
            mt: 1,
            width: '100%',
            maxWidth: 325,
          }}
        >
          <CardContent sx={{ p: 0, pb: '4px !important' }}>
            <Select
              fullWidth
              variant='standard'
              value={selected}
              onChange={handleChange}
              sx={{
                width: '100%',
                maxWidth: 300,
              }}
            >
              {TYPES.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                  }}
                >
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </CardContent>
        </Card>
      </Box>
      {render()}
    </Box>
  );
}
