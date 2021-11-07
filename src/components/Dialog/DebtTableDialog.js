import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

import DebtTable from '../Table/DebtTable';

export default function DebtTableDialog({ open, handleClose, debts, title }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id='debt-table-dialog-title'>{title}</DialogTitle>
      <DialogContent>
        <DebtTable rows={debts} />
      </DialogContent>
    </Dialog>
  );
}
