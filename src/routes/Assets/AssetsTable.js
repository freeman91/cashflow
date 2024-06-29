import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'redux-first-history';
import sortBy from 'lodash/sortBy';

import { useTheme } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { CustomTableCell } from '../../components/Table/CustomTableCell';
import { openDialog } from '../../store/dialogs';

export default function AssetsTable() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const greaterThanSM = useMediaQuery(theme.breakpoints.up('sm'));
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
      <Card>
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
                      <CustomTableCell idx={idx} component='th' sx={{ p: 1 }}>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              openDialog({
                                type: asset._type,
                                mode: 'edit',
                                id: asset.asset_id,
                              })
                            );
                          }}
                        >
                          <EditIcon sx={{ hieght: 25, width: 25 }} />
                        </IconButton>
                      </CustomTableCell>
                      <CustomTableCell idx={idx} component='th'>
                        {asset.name}
                      </CustomTableCell>
                      {greaterThanSM && (
                        <CustomTableCell idx={idx} component='th'>
                          {asset.category}
                        </CustomTableCell>
                      )}
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
