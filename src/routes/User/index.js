import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { concat, get, remove, sortBy, toArray } from 'lodash';
import {
  Button,
  Grid,
  Paper,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableRow,
  TablePagination,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';

import { putUserSettings } from '../../store/user';
import SettingsDialog from '../../components/Dialog/SettingsDialog';

export default function Networth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedType, setSelectedType] = useState('expense.types');
  const [selectedItem, setSelectedItem] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setItems(sortBy(get(user, selectedType)));
  }, [user, selectedType]);

  const handleCellClick = (e) => {
    let item = e.target.textContent;
    setDialogMode('update');
    setSelectedItem(item);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setDialogMode('');
    setSelectedItem('');
  };

  const handleSubmit = (e, updatedItem) => {
    let _updatedList = toArray(get(user, selectedType));

    if (selectedItem !== '+ create') {
      remove(_updatedList, (item) => item === selectedItem);
    }

    _updatedList = sortBy(concat(_updatedList, updatedItem));

    dispatch(putUserSettings({ updated: _updatedList, setting: selectedType }));
    handleClose(e);
  };

  const handleDelete = (e) => {
    let _updatedList = toArray(get(user, selectedType));
    remove(_updatedList, (item) => item === selectedItem);

    dispatch(putUserSettings({ updated: _updatedList, setting: selectedType }));
    handleClose(e);
  };

  const handleChange = (e) => {
    setSelectedType(e.target.value);
  };

  let itemsInPage = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <Grid container justifyContent='center'>
      <Grid item xs={12}>
        <Typography align='left' variant='h5' sx={{ mb: '1rem' }}>
          User Settings
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Select
          variant='standard'
          id='type-select'
          value={selectedType}
          onChange={handleChange}
          sx={{ mb: '1rem', width: '10rem', mr: '2rem' }}
        >
          <MenuItem value={'expense.types'}>Expense Types</MenuItem>
          <MenuItem value={'expense.vendors'}>Expense Vendors</MenuItem>
          <MenuItem value={'income.types'}>Income Types</MenuItem>
          <MenuItem value={'income.sources'}>Income Sources</MenuItem>
          <MenuItem value={'asset.types'}>Asset Types</MenuItem>
          <MenuItem value={'debt.types'}>Debt Types</MenuItem>
        </Select>
        <Button variant='contained' onClick={() => setDialogMode('add')}>
          Insert
        </Button>
      </Grid>

      <Grid item xs={4} sx={{ mt: '1rem' }} justifyContent='center'>
        <TableContainer component={Paper} sx={{ width: '20rem' }}>
          <Table>
            <TableBody>
              {itemsInPage.map((item) => (
                <TableRow key={item} hover>
                  <TableCell
                    component='th'
                    scope='row'
                    onClick={handleCellClick}
                  >
                    {item}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {items.length > itemsPerPage ? (
          <TablePagination
            rowsPerPageOptions={[itemsPerPage]}
            colSpan={1}
            count={items.length}
            rowsPerPage={itemsPerPage}
            page={page}
            SelectProps={{
              native: true,
            }}
            onPageChange={(e, newPage) => setPage(newPage)}
          />
        ) : null}
      </Grid>

      <SettingsDialog
        mode={dialogMode}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        selectedItem={selectedItem}
        selectedType={selectedType}
      />
    </Grid>
  );
}
