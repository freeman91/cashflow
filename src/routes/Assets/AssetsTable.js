import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function AssetsTable() {
  const dispatch = useDispatch();
  const allAssets = useSelector((state) => state.assets.data);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    let _assets = allAssets;
    setAssets(sortBy(_assets, 'value').reverse());
  }, [allAssets]);

  const handleClick = (asset) => {
    dispatch(push('/assets/' + asset.asset_id));
  };

  return (
    <Grid item xs={12}>
      <Card raised>
        <CardContent sx={{ p: 1, pt: 0, pb: '0 !important' }}>
          <TableContainer component={'div'}>
            <Table size='medium'>
              <TableBody>
                {assets.map((asset, idx) => {
                  return (
                    <TableRow
                      hover={true}
                      key={asset.asset_id}
                      onClick={() => handleClick(asset)}
                    >
                      <CustomTableCell
                        idx={idx}
                        component='th'
                        sx={{ height: 20 }}
                      >
                        {asset.name}
                      </CustomTableCell>
                      <CustomTableCell idx={idx} align='right'>
                        {numberToCurrency.format(asset.value)}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Grid>
  );
}
