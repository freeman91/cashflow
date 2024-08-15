import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import reduce from 'lodash/reduce';

import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';

import { putCategories } from '../../store/categories';

const defaultEditingObj = {
  type: null,
  name: null,
  value: null,
};

export default function CategoryList(props) {
  const { categoryType, placeholder, trigger, toggleTrigger } = props;
  const dispatch = useDispatch();
  const categoriesData = useSelector((state) => state.categories.data);
  const [categories, setCategories] = useState([]);
  const [openedCategory, setOpenedCategory] = useState(null);
  const [editing, setEditing] = useState(defaultEditingObj);

  useEffect(() => {
    if (trigger) {
      if (openedCategory === null) {
        if (!find(categories, { name: '' })) {
          setCategories([{ name: '', subcategories: [] }, ...categories]);
          setEditing({
            type: 'category',
            name: '',
            value: '',
          });
        }
      } else {
        let _categories = cloneDeep(categories);
        _categories = _categories.map((category) => {
          if (category.name === openedCategory) {
            if (!category.subcategories.includes('')) {
              category.subcategories = ['', ...category.subcategories];
            }
          }
          return category;
        });
        setCategories(_categories);
        setEditing({
          type: 'subcategory',
          name: '',
          value: '',
        });
      }
      toggleTrigger();
    }
  }, [trigger, categories, editing, toggleTrigger, openedCategory]);

  useEffect(() => {
    const item = find(categoriesData, {
      category_type: categoryType,
    });
    setCategories(item?.categories || []);
  }, [categoriesData, categoryType]);

  const handleSave = (e) => {
    e.preventDefault();
    let _categories = cloneDeep(categories);

    // add editing value to item
    if (editing.type === 'category') {
      let categoryIdx = findIndex(_categories, { name: editing.name });
      _categories[categoryIdx].name = editing.value;
    } else if (editing.type === 'subcategory') {
      let categoryIdx = findIndex(_categories, { name: openedCategory });
      let subcategoryIdx = findIndex(
        _categories[categoryIdx].subcategories,
        (subcategory) => subcategory === editing.name
      );
      _categories[categoryIdx].subcategories[subcategoryIdx] = editing.value;
    }

    // remove all empty string categories and subcategories
    _categories = reduce(
      _categories,
      (arr, category) => {
        if (category.name !== '') {
          arr.push({
            ...category,
            subcategories: category.subcategories.filter(
              (subcategory) => subcategory !== ''
            ),
          });
        }
        return arr;
      },
      []
    );

    let item = cloneDeep(find(categoriesData, { category_type: categoryType }));
    item.categories = _categories;
    dispatch(putCategories(item));
    setEditing(defaultEditingObj);
  };

  const handleChange = (value) => {
    setEditing((e) => ({ ...e, value }));
  };

  return (
    <List disablePadding>
      {sortBy(categories, 'name')?.map((category) => {
        return (
          <React.Fragment key={category.name + '-edit'}>
            {editing.type === 'category' && editing.name === category.name ? (
              <form onSubmit={handleSave}>
                <ClickAwayListener
                  onClickAway={() => setEditing(defaultEditingObj)}
                >
                  <ListItem disableGutters>
                    <TextField
                      fullWidth
                      variant='standard'
                      sx={{ px: 2 }}
                      placeholder={placeholder}
                      key={category.name}
                      id={category.name}
                      value={editing.value || ''}
                      onChange={(e) => handleChange(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={handleSave}>
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
              <ListItem disableGutters sx={{ minWidth: 350 }}>
                <ListItemButton
                  onClick={() =>
                    setEditing({
                      type: 'category',
                      name: category.name,
                      value: category.name,
                    })
                  }
                  sx={{ justifyContent: 'left' }}
                >
                  {<EditIcon />}
                </ListItemButton>
                <ListItemText
                  primary={category.name}
                  primaryTypographyProps={{
                    align: 'center',
                    fontWeight: 'bold',
                  }}
                  sx={{ width: '75%' }}
                />
                <ListItemButton
                  onClick={() => {
                    if (openedCategory === category.name) {
                      setOpenedCategory(null);
                    } else {
                      setOpenedCategory(category.name);
                    }
                  }}
                  sx={{ justifyContent: 'right' }}
                >
                  {openedCategory === category.name ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>
            )}
            <Divider sx={{ mx: 1 }} />
            <Collapse
              in={openedCategory === category.name}
              timeout='auto'
              unmountOnExit
            >
              {sortBy(category.subcategories).map((subcategory) => {
                return editing.type === 'subcategory' &&
                  editing.name === subcategory ? (
                  <form key={subcategory} onSubmit={handleSave}>
                    <ClickAwayListener
                      onClickAway={() => setEditing(defaultEditingObj)}
                    >
                      <ListItem sx={{ pl: 4, pr: 0 }}>
                        <TextField
                          fullWidth
                          variant='standard'
                          sx={{ px: 2 }}
                          placeholder={placeholder}
                          key={subcategory}
                          id={subcategory}
                          value={editing.value || ''}
                          onChange={(e) => handleChange(e.target.value)}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton onClick={handleSave}>
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
                      onClick={() =>
                        setEditing({
                          type: 'subcategory',
                          name: subcategory,
                          value: subcategory,
                        })
                      }
                    >
                      {subcategory}
                    </ListItemButton>
                  </ListItem>
                );
              })}
              <Divider sx={{ mx: 1 }} />
            </Collapse>
          </React.Fragment>
        );
      })}
    </List>
  );
}
