import axios from '../xhr_libs/axios';
import { get, forEach } from 'lodash';
import dayjs from 'dayjs';

const parseArray = (arr) => {
  return arr.map((elem) => {
    let parsed = JSON.parse(elem);
    forEach(parsed, (value, key) => {
      if (key === 'last_update' || key === 'date') {
        parsed[key] = dayjs.unix(parsed[key]).format('MM-DD-YYYY');
      }
    });
    return parsed;
  });
};

export const getUserAPI = async () => {
  try {
    const response = await axios.get(`/users/user`);
    if (get(response, 'status') === 200) {
      return JSON.parse(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getRecentRecordsAPI = async () => {
  try {
    const response = await axios.get(`/records/recent`);
    if (get(response, 'status') === 200) {
      const payload = JSON.parse(get(response, 'data.result'));
      return {
        incomes: parseArray(get(payload, 'incomes')),
        hours: parseArray(get(payload, 'hours')),
        goals: parseArray(get(payload, 'goals')),
        assets: parseArray(get(payload, 'assets')),
        debts: parseArray(get(payload, 'debts')),
      };
    } else {
      console.error(response);
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getRecentExpensesAPI = async () => {
  try {
    const response = await axios.get(`/expenses/recent`);
    if (get(response, 'status') === 200) {
      const payload = JSON.parse(get(response, 'data.result'));
      return parseArray(get(payload, 'expenses'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postExpenseAPI = async (new_expense) => {
  try {
    const response = await axios.post(`/expenses`, new_expense);
    if (get(response, 'status') === 200) {
      return JSON.parse(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};
