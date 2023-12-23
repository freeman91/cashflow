import React from 'react';
import { useDispatch } from 'react-redux';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';

export default function AssetCard({ asset }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(
      openDialog({ type: asset._type, mode: 'edit', id: asset.asset_id })
    );
  };

  return (
    <Card
      sx={{ width: '100%', cursor: 'pointer' }}
      raised
      onClick={() => handleClick()}
      key={asset.asset_id}
    >
      <CardHeader
        title={asset.name}
        subheader={asset.description}
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
              {numberToCurrency.format(asset.value)}
            </Typography>
          </Stack>
        }
      />
    </Card>
  );
}
