import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

import { useTheme } from '@emotion/react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const ONE_YEAR = '1Y';
const TWO_YEARS = '2Y';
const FIVE_YEARS = '5Y';
const TEN_YEARS = '10Y';
const ALL_TIME = 'ALL';

export default function SelectRangeChipStack(props) {
  const { setRange } = props;
  const theme = useTheme();

  const [rangeLabel, setRangeLabel] = useState(TWO_YEARS);

  useEffect(() => {
    const end = dayjs();

    let _range = {
      start: {},
      end: {
        year: end.year(),
        month: end.month(),
      },
    };

    if (rangeLabel === ONE_YEAR) {
      const start = end.subtract(1, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === TWO_YEARS) {
      const start = end.subtract(2, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === FIVE_YEARS) {
      const start = end.subtract(5, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === TEN_YEARS) {
      const start = end.subtract(10, 'year');
      _range.start = {
        year: start.year(),
        month: start.month(),
      };
    }

    if (rangeLabel === ALL_TIME) {
      _range.start = {
        year: 2010,
        month: 1,
      };
    }

    setRange(_range);
  }, [rangeLabel, setRange]);

  return (
    <Stack
      direction='row'
      spacing={1}
      display='flex'
      justifyContent='center'
      mt={0.5}
    >
      {Object.values([
        ONE_YEAR,
        TWO_YEARS,
        FIVE_YEARS,
        TEN_YEARS,
        ALL_TIME,
      ]).map((label) => (
        <Chip
          variant={rangeLabel === label ? 'filled' : 'outlined'}
          key={label}
          label={label}
          onClick={() => setRangeLabel(label)}
          sx={{
            backgroundColor:
              rangeLabel === label ? theme.palette.primary.main : 'transparent',
            color:
              rangeLabel === label
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
            borderColor: 'transparent',
          }}
        />
      ))}
    </Stack>
  );
}
