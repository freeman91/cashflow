const details = {
  loading: false,
  currentRequestId: undefined,
  error: null,
  start: null,
  end: null,
};

export const dialogs = (() => {
  return [
    'account',
    'asset',
    'bill',
    'borrow',
    'debt',
    'expense',
    'income',
    'networth',
    'paycheck',
    'purchase',
    'repayment',
    'sale',
    'newTransaction',
  ].reduce((acc, resourceType) => {
    acc[resourceType] = {
      open: false,
      mode: '',
      attrs: {},
    };
    return acc;
  }, {});
})();

export const user = {
  ...details,
  item: {},
};

export const items = {
  data: [],
  ...details,
};
