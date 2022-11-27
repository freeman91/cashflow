import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import CloseIcon from '@mui/icons-material/Close';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  IconButton,
  MenuItem,
  Select,
} from '@mui/material';

export default function ExpenseTypeSelector(props) {
  const { onClose, selectedTypes, setSelectedTypes, open } = props;
  const user = useSelector((state) => state.user);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    setTypes(selectedTypes);
  }, [selectedTypes]);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleAllClick = () => {
    if (types.length === user.expense_types.length) {
      setTypes([]);
    } else {
      setTypes(user.expense_types);
    }
  };

  const handleSubmit = () => {
    setSelectedTypes(types);
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Filter Expense Types
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ width: '30rem' }}>
        <Select
          fullWidth
          variant='standard'
          multiple
          value={types}
          onChange={handleChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {user.expense_types.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={types.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAllClick}>
          {types.length === user.expense_types.length
            ? 'Deselect All'
            : 'Select All'}
        </Button>
        <Button onClick={handleSubmit} variant='contained'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
