import React, { useEffect, useState } from 'react';
import get from 'lodash/get';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import { _numberToCurrency } from '../../../helpers/currency';
import BoxFlexCenter from '../../../components/BoxFlexCenter';

const DataBox = (props) => {
  const { label, value } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        background: `linear-gradient(0deg, ${theme.palette.surface[400]}, ${theme.palette.surface[500]})`,
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: '4px',
        width: '100%',
        px: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <BoxFlexCenter>{label}</BoxFlexCenter>
        <BoxFlexCenter>
          <Typography variant='h6' color='grey.10'>
            $
          </Typography>
          <Typography variant='h6' color='white' fontWeight='bold'>
            {_numberToCurrency.format(value)}
          </Typography>
        </BoxFlexCenter>
      </Box>
    </Box>
  );
};

export default function IncomesBreakdown(props) {
  const { incomes } = props;

  const [takeHome, setTakeHome] = useState(0);
  const [retirement, setRetirement] = useState(0);
  const [benefits, setBenefits] = useState(0);
  const [taxes, setTax] = useState(0);
  const [other, setOther] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);

  useEffect(() => {
    let _takeHome = 0,
      _retirement = 0,
      _benefits = 0,
      _taxes = 0,
      _other = 0,
      _otherIncome = 0;
    incomes.forEach((income) => {
      _takeHome += get(income, 'take_home', 0);
      _retirement += get(income, 'retirement', 0);
      _benefits += get(income, 'benefits', 0);
      _taxes += get(income, 'taxes', 0);
      _other += get(income, 'other', 0);
      _otherIncome += get(income, 'amount', 0);
    });
    setTakeHome(_takeHome);
    setRetirement(_retirement);
    setBenefits(_benefits);
    setTax(_taxes);
    setOther(_other);
    setOtherIncome(_otherIncome);
  }, [incomes]);

  return (
    <Stack
      spacing={1}
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
        paychecks
      </Typography>
      <DataBox label='take home' value={takeHome} />
      <DataBox label='retirement' value={retirement} />
      <DataBox label='benefits' value={benefits} />
      <DataBox label='taxes' value={taxes} />
      <DataBox label='other' value={other} />
      <Typography variant='body1' color='white' sx={{ width: '100%', pl: 1 }}>
        other incomes
      </Typography>
      {/* TODO split by type */}
      <DataBox label='income' value={otherIncome} />
    </Stack>
  );
}
