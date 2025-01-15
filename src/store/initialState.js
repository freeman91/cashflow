const details = {
  loading: false,
  currentRequestId: undefined,
  error: null,
  start: null,
  end: null,
};

export const itemView = {
  open: false,
  itemType: null,
  mode: null,
  attrs: {},
};

export const user = {
  ...details,
  item: {},
};

export const items = {
  data: [],
  ...details,
};

export const appSettings = {
  loading: 0,
  transactions: {
    tab: 'calendar',
  },
  recurring: {
    tab: 'calendar',
  },
  snackbar: { message: '' },
};
