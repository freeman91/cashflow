import React, { useState } from 'react';
import startCase from 'lodash/startCase';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';

export const NEEDS = 'needs';
export const WANTS = 'wants';
export const LUXURIES = 'luxuries';
export const LABELS = [NEEDS, WANTS, LUXURIES];

export default function Subcategory(props) {
  const {
    subcategory,
    subIdx,
    selectedSubcategory,
    setSelectedSubcategory,
    updateSubactegory,
    deleteSubcategory,
  } = props;

  const [subcategoryText, setSubcategoryText] = useState(subcategory?.name);
  const [subcategoryLabel, setSubcategoryLabel] = useState(subcategory?.label);

  const handleChange = (value) => {
    setSubcategoryText(value);
  };

  const onSave = (e) => {
    e.preventDefault();
    updateSubactegory(subcategoryText, subcategoryLabel, subIdx);
    setSelectedSubcategory(null);
  };

  const selected = selectedSubcategory?.name === subcategory?.name;
  return (
    <form
      key={subcategory?.name}
      onSubmit={onSave}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextField
        fullWidth
        variant='standard'
        sx={{
          py: 1,
          cursor: selected ? 'default' : 'pointer',
          width: 200,
          mx: 1,
        }}
        placeholder='subcategory'
        id='subcategory'
        value={subcategoryText}
        onChange={(e) => handleChange(e.target.value)}
        onClick={() => {
          if (!selected) {
            setSelectedSubcategory(subcategory);
          }
        }}
        slotProps={{ input: { disableUnderline: !selected } }}
      />
      <Select
        variant='standard'
        disableUnderline
        value={subcategoryLabel}
        onChange={(e) => {
          setSubcategoryLabel(e.target.value);
        }}
        sx={{ mx: 1, width: 100 }}
        MenuProps={{ MenuListProps: { disablePadding: true } }}
      >
        {LABELS.map((label) => (
          <MenuItem key={label} value={label}>
            {startCase(label)}
          </MenuItem>
        ))}
      </Select>
      <IconButton
        onClick={selected ? onSave : () => deleteSubcategory(subcategory?.name)}
        sx={{ height: 35, width: 35, mx: 1 }}
      >
        {selected ? <SaveIcon /> : <DeleteIcon />}
      </IconButton>
    </form>
  );
}
