import axios from '../xhr_libs/axios';
import { get, forEach, map } from 'lodash';
import dayjs from 'dayjs';

const parseArray = (arr) => {
  return arr.map((record) => {
    return parseRecord(record);
  });
};

const parseRecord = (record) => {
  let parsed = JSON.parse(record);
  forEach(parsed, (value, key) => {
    if (key === 'last_update' || key === 'date') {
      parsed[key] = dayjs.unix(parsed[key]).format('MM-DD-YYYY');
    }
  });
  return parsed;
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

/*
######## ##     ## ########  ######## ##    ##  ######  ########  ######
##        ##   ##  ##     ## ##       ###   ## ##    ## ##       ##    ##
##         ## ##   ##     ## ##       ####  ## ##       ##       ##
######      ###    ########  ######   ## ## ##  ######  ######    ######
##         ## ##   ##        ##       ##  ####       ## ##             ##
##        ##   ##  ##        ##       ##   ### ##    ## ##       ##    ##
######## ##     ## ##        ######## ##    ##  ######  ########  ######
*/

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

export const getExpensesInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/expenses/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return parseArray(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postExpenseAPI = async (new_expense) => {
  try {
    const response = await axios.post(`/expenses`, new_expense);
    if (get(response, 'status') === 200) {
      return parseRecord(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

/*
#### ##    ##  ######   #######  ##     ## ########  ######
 ##  ###   ## ##    ## ##     ## ###   ### ##       ##    ##
 ##  ####  ## ##       ##     ## #### #### ##       ##
 ##  ## ## ## ##       ##     ## ## ### ## ######    ######
 ##  ##  #### ##       ##     ## ##     ## ##             ##
 ##  ##   ### ##    ## ##     ## ##     ## ##       ##    ##
#### ##    ##  ######   #######  ##     ## ########  ######
*/

export const getRecentIncomesAPI = async () => {
  try {
    const response = await axios.get(`/incomes/recent`);
    if (get(response, 'status') === 200) {
      const payload = JSON.parse(get(response, 'data.result'));
      return parseArray(get(payload, 'incomes'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getIncomesInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/incomes/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return parseArray(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postIncomeAPI = async (new_income) => {
  try {
    const response = await axios.post(`/incomes`, new_income);
    if (get(response, 'status') === 200) {
      return parseRecord(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

/*
##     ##  #######  ##     ## ########   ######
##     ## ##     ## ##     ## ##     ## ##    ##
##     ## ##     ## ##     ## ##     ## ##
######### ##     ## ##     ## ########   ######
##     ## ##     ## ##     ## ##   ##         ##
##     ## ##     ## ##     ## ##    ##  ##    ##
##     ##  #######   #######  ##     ##  ######
*/

export const getRecentHoursAPI = async () => {
  try {
    const response = await axios.get(`/hours/recent`);
    if (get(response, 'status') === 200) {
      const payload = JSON.parse(get(response, 'data.result'));
      return parseArray(get(payload, 'hours'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getHoursInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/hours/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return parseArray(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postHourAPI = async (new_hour) => {
  try {
    const response = await axios.post(`/hours`, new_hour);
    if (get(response, 'status') === 200) {
      return parseRecord(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

/*
   ###     ######   ######  ######## ########  ######
  ## ##   ##    ## ##    ## ##          ##    ##    ##
 ##   ##  ##       ##       ##          ##    ##
##     ##  ######   ######  ######      ##     ######
#########       ##       ## ##          ##          ##
##     ## ##    ## ##    ## ##          ##    ##    ##
##     ##  ######   ######  ########    ##     ######
*/

export const getAssetsAPI = async () => {
  try {
    const response = await axios.get(`/assets`);
    if (get(response, 'status') === 200) {
      return parseArray(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

/*
########  ######## ########  ########  ######
##     ## ##       ##     ##    ##    ##    ##
##     ## ##       ##     ##    ##    ##
##     ## ######   ########     ##     ######
##     ## ##       ##     ##    ##          ##
##     ## ##       ##     ##    ##    ##    ##
########  ######## ########     ##     ######
*/

export const getDebtsAPI = async () => {
  try {
    const response = await axios.get(`/debts`);
    if (get(response, 'status') === 200) {
      return parseArray(get(response, 'data.result'));
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

/*
##    ## ######## ######## ##      ##  #######  ########  ######## ##     ##  ######
###   ## ##          ##    ##  ##  ## ##     ## ##     ##    ##    ##     ## ##    ##
####  ## ##          ##    ##  ##  ## ##     ## ##     ##    ##    ##     ## ##
## ## ## ######      ##    ##  ##  ## ##     ## ########     ##    #########  ######
##  #### ##          ##    ##  ##  ## ##     ## ##   ##      ##    ##     ##       ##
##   ### ##          ##    ##  ##  ## ##     ## ##    ##     ##    ##     ## ##    ##
##    ## ########    ##     ###  ###   #######  ##     ##    ##    ##     ##  ######
*/

export const getNetworthsAPI = async () => {
  try {
    const response = await axios.get(`/networths`);
    if (get(response, 'status') === 200) {
      const payload = parseArray(get(response, 'data.result'));
      return map(payload, (record) => {
        return {
          ...record,
          assets: parseArray(record['assets']),
          debts: parseArray(record['debts']),
        };
      });
    }
  } catch (error) {
    console.log('error: ', error);
  }
};
