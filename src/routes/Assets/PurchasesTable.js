import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import filter from 'lodash/filter';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { numberToCurrency } from '../../helpers/currency';
import { openDialog } from '../../store/dialogs';
import { CustomTableCell } from '../../components/Table/CustomTableCell';

export default function PurchasesTable(props) {
  const { assetId } = props;
  const dispatch = useDispatch();
  const purchases = useSelector((state) => state.purchases.data);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let _purchases = filter(purchases, { asset_id: assetId });
    setTableData(sortBy(_purchases, 'date'));
  }, [purchases, assetId]);

  const handleClick = (purchase) => {
    dispatch(
      openDialog({
        type: purchase._type,
        mode: 'edit',
        id: purchase.purchase_id,
        attrs: purchase,
      })
    );
  };

  return (
    <Card
      raised
      sx={{
        width: '75%',
      }}
    >
      <CardContent
        sx={{
          p: 1,
          pt: 0,
          pb: '4px !important',
        }}
      >
        <TableContainer component='div'>
          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell>date</TableCell>
                <TableCell align='right'>amount</TableCell>
                <TableCell align='right'>shares</TableCell>
                <TableCell align='right'>price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {map(tableData, (purchase, idx) => {
                return (
                  <TableRow
                    hover={true}
                    key={purchase.purchase_id}
                    onClick={() => handleClick(purchase)}
                  >
                    <CustomTableCell idx={idx} component='th' column='date'>
                      {dayjs(purchase.date).format('YYYY MMMM D')}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(purchase.amount)}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {purchase.shares}
                    </CustomTableCell>
                    <CustomTableCell idx={idx} align='right'>
                      {numberToCurrency.format(purchase.price)}
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
