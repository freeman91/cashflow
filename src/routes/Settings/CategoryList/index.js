import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import { putCategories } from '../../../store/categories';
import Category from './Category';

export default function CategoryList(props) {
  const { categoryType, label } = props;
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
      <Grid
        size={{ xs: 12 }}
        gap={1}
        display='flex'
        justifyContent='space-between'
      >
        <Typography variant='h6' fontWeight='bold'>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            create
          </Button>
          <Button
            variant='outlined'
            startIcon={<UndoIcon />}
            color='info'
            onClick={() => {
              setCategories(categoriesItem?.categories || []);
            }}
          >
            reset
          </Button>
        </Box>
      </Grid>
      {sortBy(categories, 'name')?.map((category, idx) => (
        <Category
          key={category.name + idx}
          idx={idx}
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
