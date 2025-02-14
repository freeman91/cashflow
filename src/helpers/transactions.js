import find from 'lodash/find';
import get from 'lodash/get';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';

const findAmount = (transaction) => {
  if (transaction._amount) return transaction._amount;
  if (transaction.amount) return transaction.amount;
  if (transaction.balance) return transaction.balance;
  if (transaction.value) return transaction.value;
  if (transaction.principal)
    return (
      transaction.principal +
      transaction.interest +
      get(transaction, 'escrow', 0)
    );
  if (transaction.take_home) return transaction.take_home;

  if (transaction._type === 'recurring') {
    if (transaction.item_type === 'income') {
      return transaction.income_attributes.amount;
    } else if (transaction.item_type === 'expense') {
      return transaction.expense_attributes.amount;
    } else if (transaction.item_type === 'paycheck') {
      return transaction.paycheck_attributes.take_home;
    } else if (transaction.item_type === 'repayment') {
      return transaction.repayment_attributes.amount;
    }
  }
  return 0;
};

const findSource = (transaction) => {
  if (transaction.merchant) return transaction.merchant;
  if (transaction.employer) return transaction.employer;
  if (transaction.source) return transaction.source;
  if (transaction.item_type === 'income')
    return transaction.income_attributes.source;
  if (transaction.item_type === 'expense')
    return transaction.expense_attributes.merchant;
  if (transaction.item_type === 'paycheck')
    return transaction.paycheck_attributes.employer;
  if (transaction.item_type === 'repayment')
    return transaction.repayment_attributes.merchant;
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
    case 'purchase':
      return transaction.purchase_id;
    case 'sale':
      return transaction.sale_id;
    case 'borrow':
      return transaction.borrow_id;
    case 'transfer':
      return transaction.transfer_id;
    case 'recurring':
      return transaction.recurring_id;
    default:
      return 'none';
  }
};

const findColor = (type, theme) => {
  switch (type) {
    case 'account':
      return theme.palette.primary.main;
    case 'borrow':
    case 'expense':
    case 'repayment':
      return theme.palette.error.main;
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

const findPaycheckContributionSum = (paycheck, type) => {
  const bContribution = get(paycheck, `benefits_contribution.${type}`, 0);
  const rContribution = get(paycheck, `retirement_contribution.${type}`, 0);
  return bContribution + rContribution;
};

export {
  findAmount,
  findCategory,
  findSource,
  findId,
  findColor,
  findIcon,
  findAccount,
  findPaycheckContributionSum,
};
