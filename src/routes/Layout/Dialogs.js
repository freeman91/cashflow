import React from 'react';

import AccountDialog from '../../components/Dialog/AccountDialog';
import BorrowDialog from '../../components/Dialog/BorrowDialog';
import ExpenseDialog from '../../components/Dialog/ExpenseDialog';
import IncomeDialog from '../../components/Dialog/IncomeDialog';
import PaycheckDialog from '../../components/Dialog/PaycheckDialog';
import PurchaseDialog from '../../components/Dialog/PurchaseDialog';
import RepaymentDialog from '../../components/Dialog/RepaymentDialog';
import SaleDialog from '../../components/Dialog/SaleDialog';
import SecurityDialog from '../../components/Dialog/SecurityDialog';
import TransactionsDialog from '../../components/Dialog/TransactionsDialog';

export default function Dialogs() {
  return (
    <>
      <AccountDialog />
      <BorrowDialog />
      <ExpenseDialog />
      <IncomeDialog />
      <PaycheckDialog />
      <PurchaseDialog />
      <RepaymentDialog />
      <SaleDialog />
      <SecurityDialog />
      <TransactionsDialog />
    </>
  );
}
