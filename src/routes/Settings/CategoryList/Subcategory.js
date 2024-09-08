import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';

export default function Subcategory(props) {
  const {
    subcategory,
    selectedSubcategory,
    setSelectedSubcategory,
    updateSubactegory,
    deleteSubcategory,
  } = props;

  const [subcategoryText, setSubcategoryText] = useState(subcategory);

  const handleChange = (value) => {
    setSubcategoryText(value);
  };

  const onSave = () => {
    updateSubactegory(subcategoryText);
    setSelectedSubcategory(null);
  };

  return (
    <>
      {selectedSubcategory === subcategory ? (
        <form key={subcategory} onSubmit={onSave}>
          <ClickAwayListener
            onClickAway={() => {
              setSelectedSubcategory(null);
              setSubcategoryText(subcategory);
            }}
          >
            <ListItem sx={{ pl: 4, pr: 0 }}>
              <ListItemButton
                onClick={() => deleteSubcategory(subcategory)}
                sx={{ justifyContent: 'left' }}
              >
                <DeleteIcon />
              </ListItemButton>
              <TextField
                fullWidth
                variant='standard'
                sx={{ px: 2 }}
                placeholder='subcategory'
                key={subcategory}
                id='subcategory'
                value={subcategoryText}
                onChange={(e) => handleChange(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={onSave}>
                        <SaveIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </ListItem>
          </ClickAwayListener>
        </form>
      ) : (
        <ListItem key={subcategory} dense>
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => setSelectedSubcategory(subcategory)}
          >
            {subcategory}
          </ListItemButton>
        </ListItem>
      )}
      <Divider sx={{ mx: 1 }} />
    </>
  );
}
