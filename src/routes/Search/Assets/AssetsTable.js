import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import map from 'lodash/map';
import find from 'lodash/find';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { openDialog } from '../../../store/dialogs';
import { CustomTableCell } from '../../../components/Table/CustomTableCell';
import { numberToCurrency } from '../../../helpers/currency';

export default function AssetsTable(props) {
  const { assets } = props;
  const accounts = useSelector((state) => state.accounts.data);
  const dispatch = useDispatch();

  const handleClick = (asset) => {
    dispatch(
      openDialog({
        type: asset._type,
        mode: 'edit',
        id: asset.asset_id,
        attrs: asset,
      })
    );
  };

  return (
    <Card raised sx={{ minWidth: 400 }}>
      <CardContent sx={{ p: 1, pt: 0, pb: '4px !important' }}>
        <TableContainer
          sx={{
            maxWidth: 1000,
          }}
          component={'div'}
        >
          <Table size='small'>
            <TableHead>
              <TableRow key='headers'>
                <TableCell sx={{ fontWeight: 800 }}>name</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  account
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  category
                </TableCell>
                <TableCell sx={{ fontWeight: 800 }} align='right'>
                  value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(assets, (asset, idx) => {
                const account = find(accounts, {
                  account_id: asset.account_id,
                });
                return (
                  <TableRow
                    key={asset.asset_id}
                    hover={true}
                    onClick={() => handleClick(asset)}
                  >
                    <CustomTableCell idx={idx} column='day'>
                      {asset.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} column='day'>
                      {account?.name}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {asset.category}
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
  );
}
