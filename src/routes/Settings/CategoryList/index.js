import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { putCategories } from '../../../store/categories';
import Category from './Category';

export default function CategoryList(props) {
  const { categoryType, placeholder } = props;
  const dispatch = useDispatch();
  const categoriesItem = useSelector((state) => {
    return find(state.categories.data, { category_type: categoryType });
  });
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    setCategories(categoriesItem?.categories || []);
  }, [categoriesItem]);

  const handleSaveCategory = (idx, category) => {
    let item = cloneDeep(categoriesItem);
    item.categories[idx] = category;
    dispatch(putCategories(item));
  };

  const handleCreateClick = () => {
    setCategories([{ name: '', subcategories: [] }, ...categories]);
  };

  const deleteCategory = (category) => {
    let item = cloneDeep(categoriesItem);
    item.categories = item.categories.filter((item) => item.name !== category);
    dispatch(putCategories(item));
  };

  return (
    <>
      <Grid item xs={12} mx={1} gap={1} display='flex' justifyContent='center'>
        <Button
          variant='contained'
          endIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          create
        </Button>
        <Button
          variant='outlined'
          endIcon={<UndoIcon />}
          sx={{ color: 'button', borderColor: 'button' }}
          onClick={() => {
            setCategories(categoriesItem?.categories || []);
          }}
        >
          reset
        </Button>
      </Grid>
      {sortBy(categories, 'name')?.map((category, idx) => (
        <Category
          key={category.name + idx}
          idx={idx}
          placeholder={placeholder}
          category={category}
          setCategories={setCategories}
          expandedCategory={expandedCategory}
          setExpandedCategory={setExpandedCategory}
          handleSaveCategory={handleSaveCategory}
          deleteCategory={deleteCategory}
        />
      ))}
    </>
  );
}
