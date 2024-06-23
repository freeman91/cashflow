import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setAppBar } from '../../store/appSettings';
import Month from '../../components/Calendar/Month';

export default function Calendar() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setAppBar({
        title: 'calendar',
      })
    );
  }, [dispatch]);

  return <Month />;
}
