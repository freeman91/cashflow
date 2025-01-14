import React from 'react';
import { useSelector } from 'react-redux';

import useMediaQuery from '@mui/material/useMediaQuery';

import ItemViewDialog from './ItemViewDialog';
import ItemViewDrawer from './ItemViewDrawer';

export default function ItemView() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { open, itemType, mode, attrs } = useSelector(
    (state) => state.itemView
  );

  if (!open || !itemType) return null;
  else if (isMobile && open) {
    return <ItemViewDialog itemType={itemType} mode={mode} attrs={attrs} />;
  } else if (!isMobile && open) {
    return <ItemViewDrawer itemType={itemType} mode={mode} attrs={attrs} />;
  } else {
    return null;
  }
}
