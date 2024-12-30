import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ItemBox from '../../../components/ItemBox';

export default function AssetsStack(props) {
  const { accountId } = props;

  const accounts = useSelector((state) => state.accounts.data);
  const allAssets = useSelector((state) => state.assets.data);
  const [groupedAssets, setGroupedAssets] = useState([]);

  useEffect(() => {
    let _assets = [];
    if (accountId) {
      const account = accounts.find((a) => a.account_id === accountId);
      _assets = filter(allAssets, { account_id: account.account_id });
    } else {
      _assets = allAssets;
    }
    _assets = groupBy(_assets, 'category');
    _assets = sortBy(_assets, (assets) => {
      return assets.reduce((acc, asset) => acc + asset.value, 0);
    }).reverse();
    setGroupedAssets(_assets);
  }, [allAssets, accountId, accounts]);

  return map(groupedAssets, (assets) => {
    const sortedAssets = sortBy(assets, 'value').reverse();
    const category = sortedAssets[0].category;
    return (
      <Grid
        key={category}
        item
        xs={12}
        mx={1}
        display='flex'
        justifyContent='center'
      >
        <Card sx={{ width: '100%' }}>
          <Stack spacing={1} direction='column' pt={1} pb={1}>
            <Typography
              variant='body1'
              color='text.secondary'
              align='left'
              sx={{ pl: 2 }}
            >
              {category}
            </Typography>
            {map(sortedAssets, (asset, idx) => {
              return (
                <React.Fragment key={`${category}-${idx}`}>
                  <Divider sx={{ mx: '8px !important' }} />
                  <ItemBox item={asset} />
                </React.Fragment>
              );
            })}
          </Stack>
        </Card>
      </Grid>
    );
  });
}
