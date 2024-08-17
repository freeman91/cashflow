import React from 'react';

import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { _numberToCurrency } from '../../helpers/currency';
import BoxFlexColumn from '../../components/BoxFlexColumn';
import BoxFlexCenter from '../../components/BoxFlexCenter';

const ItemBox = (props) => {
  const { tab, item } = props;
  const theme = useTheme();

  const color =
    tab === 'assets' ? theme.palette.green[400] : theme.palette.red[400];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        px: 2,
      }}
    >
      <BoxFlexColumn alignItems='space-between'>
        <Typography
          variant='h6'
          color='grey.0'
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '1',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {item.name}
        </Typography>
      </BoxFlexColumn>
      <BoxFlexCenter>
        <Typography variant='h5' color='text.secondary'>
          $
        </Typography>
        <Typography variant='h5' color='white' fontWeight='bold'>
          {_numberToCurrency.format(item?.value || item?.amount)}
        </Typography>
      </BoxFlexCenter>
    </Box>
  );
};

export default ItemBox;
