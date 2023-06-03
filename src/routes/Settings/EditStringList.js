import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Button,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  TextField,
} from '@mui/material';
import { cloneDeep, get, map, pullAt } from 'lodash';
import { Stack } from '@mui/system';
import { putUserSettings } from '../../store/user';

export default function EditStringList({ settingName }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [values, setValues] = useState([]);

  useEffect(() => {
    setValues(get(user, settingName), 'name');
  }, [settingName, user]);

  const handleReset = () => {
    setValues(get(user, settingName), 'name');
  };

  const handleDelete = (idx) => {
    let _values = cloneDeep(get(user, settingName));
    pullAt(_values, [idx]);
    dispatch(putUserSettings({ setting: settingName, updated: _values }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(putUserSettings({ setting: settingName, updated: values }));
  };

  const handleChange = (idx, value) => {
    let _values = cloneDeep(values);
    _values[idx] = value;
    setValues(_values);
  };

  const handleCreateClick = () => {
    let _values = cloneDeep(get(user, settingName));
    _values.push('**NEW**');
    dispatch(putUserSettings({ setting: settingName, updated: _values }));
  };

  return (
    <Card raised sx={{ mt: 2, minWidth: 400 }}>
      <CardContent>
        <form onSubmit={handleSave}>
          <List>
            <ListItem>
              <Stack
                direction='row'
                spacing={2}
                sx={{ width: '100%' }}
                justifyContent='center'
              >
                <IconButton onClick={handleCreateClick}>
                  <AddIcon />
                </IconButton>
                <Button id='delete' variant='outlined' onClick={handleReset}>
                  Reset
                </Button>
                <Button
                  type='submit'
                  id='save'
                  variant='contained'
                  onClick={handleSave}
                  color='primary'
                >
                  Save
                </Button>
              </Stack>
            </ListItem>
            {map(get(user, settingName), (value, idx) => {
              return (
                <ListItem
                  id={value}
                  key={`list-item-${value}`}
                  secondaryAction={
                    <IconButton id={value} onClick={() => handleDelete(idx)}>
                      <ClearIcon />
                    </IconButton>
                  }
                >
                  <TextField
                    id={value}
                    variant='standard'
                    value={get(values, idx, '')}
                    onChange={(e) => handleChange(idx, e.target.value)}
                  />
                </ListItem>
              );
            })}
          </List>
        </form>
      </CardContent>
    </Card>
  );
}
