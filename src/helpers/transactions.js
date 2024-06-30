import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

const findAmount = (transaction) => {
  if (transaction.amount) return transaction.amount;
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
  if (transaction.vendor) return transaction.vendor;
  if (transaction.lender) return transaction.lender;
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

const findColor = (transaction) => {
  switch (transaction._type) {
    case 'repayment':
    case 'expense':
      return 'red.400';
    case 'paycheck':
    case 'income':
      return 'green.400';
    default:
      return 'red.400';
  }
};

const findIcon = (transaction) => {
  switch (transaction._type) {
    case 'expense':
    case 'repayment':
      if (transaction.pending) return <MoreHorizIcon />;
      return <SouthIcon />;
    case 'paycheck':
    case 'income':
      return <NorthIcon />;
    default:
      return <SouthIcon />;
  }
};

export { findAmount, findCategory, findSource, findId, findColor, findIcon };
