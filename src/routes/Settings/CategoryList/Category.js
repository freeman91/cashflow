import React, { useState } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';

import useTheme from '@mui/material/styles/useTheme';
import AddIcon from '@mui/icons-material/Add';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { LUXURIES } from './Subcategory';
import Subcategory from './Subcategory';

export default function Category(props) {
  const {
    category,
    setCategories,
    idx,
    expandedCategory,
    setExpandedCategory,
    handleSaveCategory,
    deleteCategory,
  } = props;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);
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
      _categories[categoryIdx].subcategories.push({
        name: '',
        label: LUXURIES,
      });
      return _categories;
    });
    setSelectedSubcategory('');
  };

  const updateCategory = () => {
    let _category = cloneDeep(category);
    _category.name = categoryName;
    handleSaveCategory(idx, _category);
  };

  const updateSubactegory = (subcategory, subcategoryLabel, subIdx) => {
    let _category = cloneDeep(category);
    _category.subcategories[subIdx] = {
      name: subcategory,
      label: subcategoryLabel,
    };
    handleSaveCategory(idx, _category);
  };

  const deleteSubcategory = (subcategoryName) => {
    let _category = cloneDeep(category);
    _category.subcategories = _category.subcategories.filter(
      (item) => item.name !== subcategoryName
    );
    handleSaveCategory(idx, _category);
    setSelectedSubcategory(null);
  };

  const setColor = (color) => {
    let _category = cloneDeep(category);
    _category.color = color;
    handleSaveCategory(idx, _category);
  };

  const color = category?.color;
  const open = Boolean(anchorEl);
  const id = open ? 'color-picker-popover' : undefined;
  return (
    <Grid mx={1} display='flex' justifyContent='center' size={12}>
      <Card sx={{ p: 1, width: '100%' }}>
        {edit ? (
          <ClickAwayListener onClickAway={() => setEdit(false)}>
            <TextField
              fullWidth
              variant='standard'
              sx={{ px: 2 }}
              key={category.name}
              id={category.name}
              value={categoryName}
              onChange={(e) => handleChange(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={updateCategory}>
                        <SaveIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </ClickAwayListener>
        ) : (
          <ListItemButton
            sx={{ p: 0 }}
            onClick={() => {
              if (expandedCategory === category.name) {
                setExpandedCategory(null);
                setSelectedSubcategory(null);
              } else {
                setExpandedCategory(category.name);
              }
            }}
          >
            <ListItemText
              primary={category.name}
              sx={{ width: '75%', ml: 1 }}
              slotProps={{
                primary: {
                  align: 'left',
                  fontWeight: 'bold',
                },
              }}
            />
            <IconButton color='info' sx={{ p: 0.5 }}>
              {expandedCategory === category.name ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </IconButton>
          </ListItemButton>
        )}
        <Collapse
          in={expandedCategory === category.name}
          timeout='auto'
          unmountOnExit
        >
          <Stack
            direction='row'
            gap={1}
            justifyContent='center'
            alignItems='center'
          >
            <Tooltip placement='top' title='create'>
              <IconButton onClick={handleCreateSubcategory} color='info'>
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement='top' title='edit'>
              <IconButton onClick={() => setEdit(true)} color='info'>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              sx={{ color: color || 'info' }}
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
            >
              <ColorLensIcon />
            </IconButton>
            <Tooltip placement='top' title='undo'>
              <IconButton onClick={() => {}} color='info'>
                <UndoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip placement='top' title='delete'>
              <IconButton onClick={deleteCategory} color='info'>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider sx={{ mx: 1 }} />
          {sortBy(category.subcategories).map((subcategory, subIdx) => (
            <Subcategory
              key={subcategory.name + subIdx}
              subcategory={subcategory}
              selectedSubcategory={selectedSubcategory}
              setSelectedSubcategory={setSelectedSubcategory}
              updateSubactegory={updateSubactegory}
              deleteSubcategory={deleteSubcategory}
              subcategoriesLength={category.subcategories.length}
              subIdx={subIdx}
            />
          ))}
        </Collapse>
      </Card>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box
          sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
        >
          {theme.chartColors.map((color) => {
            return (
              <IconButton
                key={color}
                sx={{ color: color }}
                onClick={() => {
                  setColor(color);
                  setAnchorEl(null);
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: color,
                    borderRadius: '25%',
                  }}
                />
              </IconButton>
            );
          })}
        </Box>
      </Popover>
    </Grid>
  );
}
