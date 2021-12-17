import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import AssetDebtTable from '../Table/AssetDebtTable';

export default function AssetDebtDialog({ open, handleClose, records, title }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <AssetDebtTable rows={records} />
      </DialogContent>
    </Dialog>
  );
}
