import find from 'lodash/find';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentsIcon from '@mui/icons-material/Payments';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

const findAmount = (transaction) => {
  if (transaction.amount) return transaction.amount;
  if (transaction.balance) return transaction.balance;
  if (transaction.value) return transaction.value;
  if (transaction.principal)
    return (
      transaction.principal +
      transaction.interest +
      (transaction.escrow ? transaction.escrow : 0)
    );
  if (transaction.take_home) return transaction.take_home;
  return 0;
};

const findSource = (transaction) => {
  if (transaction.merchant) return transaction.merchant;
  if (transaction.employer) return transaction.employer;
  if (transaction.source) return transaction.source;
  return '';
};

const findCategory = (transaction) => {
  if (transaction.category) return transaction.category;
  return transaction._type;
};

const findId = (transaction) => {
  switch (transaction._type) {
    case 'expense':
      return transaction.expense_id;
    case 'income':
      return transaction.income_id;
    case 'repayment':
      return transaction.repayment_id;
    case 'paycheck':
      return transaction.paycheck_id;
    default:
      return 'none';
  }
};

const findColor = (type, theme) => {
  switch (type) {
    case 'account':
      return theme.palette.primary.main;
    case 'debt':
    case 'bill':
    case 'borrow':
    case 'expense':
    case 'repayment':
      return theme.palette.error.main;
    case 'asset':
    case 'paycheck':
    case 'income':
      return theme.palette.success.main;
    case 'purchase':
      return theme.palette.yellow.main;
    case 'sale':
      return theme.palette.orange.main;
    default:
      return theme.palette.error.main;
  }
};

const findIcon = (type, pending = false) => {
  switch (type) {
    case 'account':
      return AccountBalanceIcon;
    case 'asset':
      return AccountBalanceWalletIcon;
    case 'debt':
      return CreditCardIcon;
    case 'bill':
      return PaymentsIcon;
    case 'borrow':
      return AssuredWorkloadIcon;
    case 'expense':
      if (pending) return MoreHorizIcon;
      return PaymentIcon;
    case 'repayment':
      if (pending) return MoreHorizIcon;
      return CurrencyExchangeIcon;
    case 'paycheck':
      return LocalAtmIcon;
    case 'purchase':
      return ShoppingCartIcon;
    case 'sale':
      return SellIcon;
    case 'income':
      return AttachMoneyIcon;
    default:
      return null;
  }
};

const findAccount = (transaction, accounts) => {
  let accountId = '';
  if (transaction.payment_from_id) {
    accountId = transaction.payment_from_id;
  } else if (transaction.account_id) {
    accountId = transaction.account_id;
  }

  if (accountId) {
    const account = find(
      accounts,
      (account) => account.account_id === accountId
    );
    if (account) return account.name;
  }
  return '';
};

export {
  findAmount,
  findCategory,
  findSource,
  findId,
  findColor,
  findIcon,
  findAccount,
};
