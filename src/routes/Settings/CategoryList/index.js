import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';

import AddIcon from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';

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
    <Card raised sx={{ px: 1 }}>
      <Fab
        color='primary'
        sx={{ position: 'fixed', right: 15, top: 50 }}
        onClick={handleCreateClick}
      >
        <AddIcon />
      </Fab>
      <List disablePadding>
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
            categoriesLength={categories.length}
          />
        ))}
      </List>
    </Card>
  );
}
