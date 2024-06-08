import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import sortBy from 'lodash/sortBy';

import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import TextFieldListItem from '../../components/List/TextFieldListItem';
import { putOptionList } from '../../store/optionLists';

export default function CategoryList(props) {
  const { categoryType, placeholder, trigger, toggleTrigger } = props;
  const dispatch = useDispatch();
  const categoriesData = useSelector((state) => state.categories.data);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (trigger) {
      if (!categories.includes('')) {
        setCategories(['', ...categories]);
      }
      setSelectedIdx(0);
      setSelectedCategory('');
      toggleTrigger();
    }
  }, [trigger, categories, toggleTrigger]);

  useEffect(() => {
    const item = find(categoriesData, {
      category_type: categoryType,
    });
    setCategories(item);

    let _open = reduce(
      item.categories,
      (obj, category) => {
        return {
          ...obj,
          [category.name]: false,
        };
      },
      {}
    );
    setOpen(_open);
  }, [categoriesData, categoryType]);

  const handleSave = (e) => {
    e.preventDefault();
    // let _categories = [...categories];

    // if (!selectedCategory) {
    //   _categories.splice(selectedIdx, 1);
    // } else {
    //   _categories[selectedIdx] = selectedCategory;
    //   _categories.sort();
    // }

    // let optionList = cloneDeep(find(optionLists, { option_type: optionType }));

    // optionList.categories = _categories;
    // dispatch(putOptionList(optionList));
    setSelectedIdx(null);
    setSelectedCategory('');
  };

  const handleChange = (option) => {
    setSelectedCategory(option);
  };

  return (
    <Card raised>
      <CardContent>
        <List disablePadding>
          {sortBy(categories?.categories, 'name')?.map((category, idx) => {
            return (
              <>
                <ListItem>
                  <ListItemButton
                    onClick={null}
                    sx={{ justifyContent: 'left' }}
                  >
                    {<EditIcon />}
                  </ListItemButton>
                  <ListItemText
                    primary={category.name}
                    primaryTypographyProps={{ align: 'center' }}
                  />
                  <ListItemButton
                    onClick={() =>
                      setOpen({
                        ...open,
                        [category.name]: !open[category.name],
                      })
                    }
                    sx={{ justifyContent: 'right' }}
                  >
                    {open[category.name] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  key={category.name}
                  in={open[category.name]}
                  timeout='auto'
                  unmountOnExit
                >
                  <Divider />
                  {sortBy(category.subcategories).map((subcategory) => (
                    <>
                      <ListItem key={subcategory} dense>
                        <ListItemButton sx={{ pl: 4 }}>
                          {subcategory}
                        </ListItemButton>
                      </ListItem>
                    </>
                  ))}
                  <Divider />
                </Collapse>
              </>
            );
          })}
          {/* {categories.map((option, idx) => {
            if (selectedIdx === idx) {
              return (
                <form key={option} onSubmit={handleSave}>
                  <TextFieldListItem
                    sx={{ px: 2 }}
                    placeholder={placeholder}
                    key={option}
                    id={option}
                    value={selectedCategory || ''}
                    onChange={(e) => handleChange(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            onClick={handleSave}
                            disabled={selectedCategory === option}
                          >
                            <SaveIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </form>
              );
            }

            return (
              <ListItem key={option} dense>
                <ListItemButton
                  onClick={() => {
                    setSelectedIdx(idx);
                    setSelectedCategory(option);
                  }}
                  sx={{ justifyContent: 'left' }}
                >
                  {option}
                </ListItemButton>
              </ListItem>
            );
          })} */}
        </List>
      </CardContent>
    </Card>
  );
}
