import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Subcategory from './Subcategory';

export default function Category(props) {
  const {
    placeholder,
    category,
    setCategories,
    idx,
    expandedCategory,
    setExpandedCategory,
    handleSaveCategory,
    deleteCategory,
    categoriesLength,
  } = props;

  const [edit, setEdit] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const handleChange = (value) => {
    setCategoryName(value);
  };

  const handleCreateSubcategory = () => {
    setCategories((prevCategories) => {
      let _categories = cloneDeep(prevCategories);
      let categoryIdx = findIndex(_categories, { name: expandedCategory });
      _categories[categoryIdx].subcategories.push('');
      return _categories;
    });
    setSelectedSubcategory('');
  };

  const updateCategory = () => {
    let _category = cloneDeep(category);
    _category.name = categoryName;
    handleSaveCategory(idx, _category);
  };

  const updateSubactegory = (subcategory) => {
    let _category = cloneDeep(category);
    _category.subcategories[0] = subcategory;
    handleSaveCategory(idx, _category);
  };

  const deleteSubcategory = (subcategory) => {
    let _category = cloneDeep(category);
    _category.subcategories = _category.subcategories.filter(
      (item) => item !== subcategory
    );
    handleSaveCategory(idx, _category);
  };

  return (
    <React.Fragment key={category.name + '-edit'}>
      {edit ? (
        <ClickAwayListener onClickAway={() => setEdit(false)}>
          <ListItem disableGutters>
            <TextField
              fullWidth
              variant='standard'
              sx={{ px: 2 }}
              placeholder={placeholder}
              key={category.name}
              id={category.name}
              value={categoryName}
              onChange={(e) => handleChange(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={updateCategory}>
                      <SaveIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        </ClickAwayListener>
      ) : (
        <ListItem disableGutters sx={{ minWidth: 350 }}>
          {expandedCategory === category.name && (
            <ListItemButton
              onClick={() => deleteCategory(category.name)}
              sx={{ justifyContent: 'left' }}
            >
              <DeleteIcon />
            </ListItemButton>
          )}

          <ListItemText
            primary={category.name}
            primaryTypographyProps={{
              align: 'center',
              fontWeight: 'bold',
            }}
            sx={{ width: '75%' }}
          />

          {expandedCategory === category.name ? (
            <ListItemButton
              onClick={() => handleCreateSubcategory()}
              sx={{ justifyContent: 'right' }}
            >
              <AddCircleOutlineIcon />
            </ListItemButton>
          ) : (
            <ListItemButton
              onClick={() => setEdit(true)}
              sx={{ justifyContent: 'right' }}
            >
              <EditIcon />
            </ListItemButton>
          )}

          <ListItemButton
            onClick={() => {
              if (expandedCategory === category.name) {
                setExpandedCategory(null);
              } else {
                setExpandedCategory(category.name);
              }
            }}
            sx={{ justifyContent: 'right' }}
          >
            {expandedCategory === category.name ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>
      )}
      {(categoriesLength - 1 !== idx || expandedCategory === category.name) && (
        <Divider sx={{ mx: 1 }} />
      )}
      <Collapse
        in={expandedCategory === category.name}
        timeout='auto'
        unmountOnExit
      >
        {sortBy(category.subcategories).map((subcategory, idx) => (
          <Subcategory
            key={subcategory + idx}
            subcategory={subcategory}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            updateSubactegory={updateSubactegory}
            deleteSubcategory={deleteSubcategory}
            subcategoriesLength={category.subcategories.length}
          />
        ))}
      </Collapse>
    </React.Fragment>
  );
}
