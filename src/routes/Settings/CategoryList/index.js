import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { putCategories } from '../../../store/categories';
import Subcategory from './Subcategory';
import { LABELS } from './Subcategory';

export default function CategoryList(props) {
  const { categoryType, label } = props;
  const dispatch = useDispatch();
  const categoriesItem = useSelector((state) => {
    return find(state.categories.data, { category_type: categoryType });
  });
  const [categories, setCategories] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCatName, setEditingCatName] = useState('');
  const [selectedSubIdx, setSelectedSubIdx] = useState(null);
  const [subcategoryText, setSubcategoryText] = useState('');
  const [subcategoryLabel, setSubcategoryLabel] = useState('');

  useEffect(() => {
    setCategories(categoriesItem?.categories || []);
  }, [categoriesItem]);

  const handleSaveCategory = (category) => {
    let item = cloneDeep(categoriesItem);
    const originalIdx = item.categories.findIndex(c => c.name === category.name);
    if (originalIdx === -1) {
      // new category
      item.categories.push(category);
    } else {
      item.categories[originalIdx] = category;
    }
    dispatch(putCategories(item));
  };

  const handleCreateClick = () => {
    if (newCategoryName.trim()) {
      setCategories([{ name: newCategoryName.trim(), subcategories: [] }, ...categories]);
      setNewCategoryName('');
    }
  };

  const deleteCategory = (category) => {
    let item = cloneDeep(categoriesItem);
    item.categories = item.categories.filter((item) => item.name !== category);
    dispatch(putCategories(item));
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 8
        }}
      >
        <Typography variant='h6' fontWeight='bold'>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size='small'
            placeholder='New category name'
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleCreateClick();
              }
            }}
          />
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            disabled={!newCategoryName.trim()}
          >
            Add
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
      </Box>
      <TableContainer sx={{ mb: 8 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>subcategories</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(categories, 'name')?.map((category) => {
              const isExpanded = expandedCategory === category.name;
              return (
                <React.Fragment key={category.name}>
                  <TableRow>
                    <TableCell>
                      {editingCategory === category.name ? (
                        <TextField
                          size="small"
                          value={editingCatName}
                          onChange={(e) => setEditingCatName(e.target.value)}
                          onBlur={() => {
                            if (editingCatName.trim() && editingCatName !== category.name) {
                              const updated = { ...category, name: editingCatName.trim() };
                              handleSaveCategory(updated);
                              setCategories(prev => prev.map(c => c.name === category.name ? updated : c));
                            }
                            setEditingCategory(null);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              // trigger onBlur
                              const event = { target: { blur: () => {} } };
                              event.target.blur();
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            setEditingCategory(category.name);
                            setEditingCatName(category.name);
                          }}
                        >
                          {category.name}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{category.subcategories.length}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() => setExpandedCategory(isExpanded ? null : category.name)}
                      >
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Delete this category?')) {
                            deleteCategory(category.name);
                            setCategories(prev => prev.filter(c => c.name !== category.name));
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            subcategories
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>name</TableCell>
                                <TableCell>label</TableCell>
                                <TableCell>actions</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {category.subcategories.map((sub, idx) => (
                                <TableRow key={sub.name || idx}>
                                  <TableCell colSpan={3}>
                                    <Subcategory
                                      subcategory={sub}
                                      subIdx={idx}
                                      selectedSubcategory={null}
                                      setSelectedSubcategory={null}
                                      updateSubactegory={(subname, label, subIdx) => {
                                        const updated = cloneDeep(category);
                                        updated.subcategories[subIdx] = { name: subname, label };
                                        handleSaveCategory(updated);
                                        setCategories(prev => prev.map(c => c.name === category.name ? updated : c));
                                      }}
                                      deleteSubcategory={(name) => {
                                        const updated = cloneDeep(category);
                                        updated.subcategories = updated.subcategories.filter(s => s.name !== name);
                                        handleSaveCategory(updated);
                                        setCategories(prev => prev.map(c => c.name === category.name ? updated : c));
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => {
                                      const updated = cloneDeep(category);
                                      updated.subcategories.push({ name: '', label: 'luxuries' });
                                      setCategories(prev => prev.map(c => c.name === category.name ? updated : c));
                                    }}
                                  >
                                    Add Subcategory
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
