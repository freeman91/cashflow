import React from 'react';

import AccountDialog from '../../components/Dialog/AccountDialog';
import AssetDialog from '../../components/Dialog/AssetDialog';
import BillDialog from '../../components/Dialog/BillDialog ';
import BorrowDialog from '../../components/Dialog/BorrowDialog';
import DebtDialog from '../../components/Dialog/DebtDialog';
import ExpenseDialog from '../../components/Dialog/ExpenseDialog';
import IncomeDialog from '../../components/Dialog/IncomeDialog';
import NetworthDialog from '../../components/Dialog/NetworthDialog';
import PaycheckDialog from '../../components/Dialog/PaycheckDialog';
import PurchaseDialog from '../../components/Dialog/PurchaseDialog';
import RepaymentDialog from '../../components/Dialog/RepaymentDialog';
import SaleDialog from '../../components/Dialog/SaleDialog';
import TransactionsDialog from '../../components/Dialog/TransactionsDialog';

export default function Dialogs() {
  return (
    <>
      <AccountDialog />
      <AssetDialog />
      <BillDialog />
      <BorrowDialog />
      <DebtDialog />
      <ExpenseDialog />
      <IncomeDialog />
      <NetworthDialog />
      <PaycheckDialog />
      <PurchaseDialog />
      <RepaymentDialog />
      <SaleDialog />
      <TransactionsDialog />
    </>
  );
}
