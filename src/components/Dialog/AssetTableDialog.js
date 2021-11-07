import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import AssetTable from '../Table/AssetTable';

export default function AssetTableDialog({ open, handleClose, assets, title }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id='asset-table-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <AssetTable rows={assets} />
      </DialogContent>
    </Dialog>
  );
}
