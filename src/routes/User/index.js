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
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  Typography,
} from '@mui/material';

import { putUserSettings } from '../../store/user';
import SettingsDialog from '../../components/Dialog/SettingsDialog';

const buttonStyle = {
  mt: '2rem',
  display: 'block',
  width: '10rem',
};

export default function Networth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [selectedButton, setSelectedButton] = useState('expense.types');
  const [selectedItem, setSelectedItem] = useState('');
  const [dialogMode, setDialogMode] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    setItems(sortBy(get(user, selectedButton)));
  }, [user, selectedButton]);

  const handleCellClick = (e) => {
    let item = e.target.textContent;
    if (item === '+ create') {
      setDialogMode('add');
    } else {
      setDialogMode('update');
      setSelectedItem(item);
    }
  };

  const handleClose = (e) => {
    e.preventDefault();
    setDialogMode('');
    setSelectedItem('');
  };

  const handleSubmit = (e, updatedItem) => {
    let _updatedList = toArray(get(user, selectedButton));

    if (selectedItem !== '+ create') {
      remove(_updatedList, (item) => item === selectedItem);
    }

    _updatedList = sortBy(concat(_updatedList, updatedItem));

    dispatch(
      putUserSettings({ updated: _updatedList, setting: selectedButton })
    );
    handleClose(e);
  };

  const handleDelete = (e) => {
    let _updatedList = toArray(get(user, selectedButton));
    remove(_updatedList, (item) => item === selectedItem);

    dispatch(
      putUserSettings({ updated: _updatedList, setting: selectedButton })
    );
    handleClose(e);
  };

  let itemsInPage = items.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <>
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          width: '30rem',
          flexGrow: 1,
          height: '30rem',
        }}
      >
        <Typography align='left' variant='h5' sx={{ mb: '1rem' }}>
          User Settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              variant={
                selectedButton === 'expense.types' ? 'contained' : 'outlined'
              }
              sx={{ ...buttonStyle, mt: '0' }}
              onClick={() => setSelectedButton('expense.types')}
            >
              Expense Types
            </Button>
            <Button
              variant={
                selectedButton === 'expense.vendors' ? 'contained' : 'outlined'
              }
              sx={buttonStyle}
              onClick={() => setSelectedButton('expense.vendors')}
            >
              Expense Vendors
            </Button>
            <Button
              variant={
                selectedButton === 'income.types' ? 'contained' : 'outlined'
              }
              sx={buttonStyle}
              onClick={() => setSelectedButton('income.types')}
            >
              Income Types
            </Button>
            <Button
              variant={
                selectedButton === 'income.sources' ? 'contained' : 'outlined'
              }
              sx={buttonStyle}
              onClick={() => setSelectedButton('income.sources')}
            >
              Income Sources
            </Button>
            <Button
              variant={
                selectedButton === 'asset.types' ? 'contained' : 'outlined'
              }
              sx={buttonStyle}
              onClick={() => setSelectedButton('asset.types')}
            >
              Asset Types
            </Button>
            <Button
              variant={
                selectedButton === 'debt.types' ? 'contained' : 'outlined'
              }
              sx={buttonStyle}
              onClick={() => setSelectedButton('debt.types')}
            >
              Debt Types
            </Button>
          </Grid>
          <Grid item xs={6}>
            <TableContainer component={Paper} sx={{ border: '1px solid grey' }}>
              <Table>
                <TableHead>
                  <TableRow hover>
                    <TableCell onClick={handleCellClick}>+ create</TableCell>
                  </TableRow>
                </TableHead>
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
                {items.length > itemsPerPage ? (
                  <TableFooter>
                    <TableRow>
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
                    </TableRow>
                  </TableFooter>
                ) : null}
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
      <SettingsDialog
        mode={dialogMode}
        handleClose={handleClose}
        handleDelete={handleDelete}
        handleSubmit={handleSubmit}
        selectedItem={selectedItem}
        selectedButton={selectedButton}
      />
    </>
  );
}
