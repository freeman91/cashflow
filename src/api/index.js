import axios from '../xhr_libs/axios';
import { get, map } from 'lodash';

export const getUserAPI = async () => {
  try {
    const response = await axios.get(`/user`);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putUserSettingsAPI = async (payload) => {
  try {
    const response = await axios.put(`/user`, payload);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
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
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getExpensesInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/expenses/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postExpenseAPI = async (new_expense) => {
  try {
    const response = await axios.post(`/expenses`, new_expense);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putExpenseAPI = async (updatedExpense) => {
  try {
    const response = await axios.put(
      `/expenses/${get(updatedExpense, 'id')}`,
      updatedExpense
    );
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const deleteExpenseAPI = async (expenseId) => {
  try {
    const response = await axios.delete(`/expenses/${expenseId}`);
    if (get(response, 'status') === 200) {
      return true;
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
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getIncomesInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/incomes/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postIncomeAPI = async (new_income) => {
  try {
    const response = await axios.post(`/incomes`, new_income);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putIncomeAPI = async (updatedIncome) => {
  try {
    const response = await axios.put(
      `/incomes/${get(updatedIncome, 'id')}`,
      updatedIncome
    );
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const deleteIncomeAPI = async (incomeId) => {
  try {
    const response = await axios.delete(`/incomes/${incomeId}`);
    if (get(response, 'status') === 200) {
      return true;
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
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const getHoursInRangeAPI = async (start, end) => {
  try {
    const response = await axios.get(`/hours/range/${start}/${end}`);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postHourAPI = async (new_hour) => {
  try {
    const response = await axios.post(`/hours`, new_hour);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putHourAPI = async (updatedHour) => {
  try {
    const response = await axios.put(
      `/hours/${get(updatedHour, 'id')}`,
      updatedHour
    );
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const deleteHourAPI = async (hourId) => {
  try {
    const response = await axios.delete(`/hours/${hourId}`);
    if (get(response, 'status') === 200) {
      return true;
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
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postAssetAPI = async (updatedAsset) => {
  try {
    const response = await axios.post(`/assets`, updatedAsset);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putAssetAPI = async (updatedAsset) => {
  try {
    const response = await axios.put(
      `/assets/${get(updatedAsset, 'id')}`,
      updatedAsset
    );
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const buyAssetAPI = async (assetId, payload) => {
  try {
    const response = await axios.put(`/assets/${assetId}/buy`, payload);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const sellAssetAPI = async (assetId, payload) => {
  try {
    const response = await axios.put(`/assets/${assetId}/sell`, payload);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
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
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postDebtAPI = async (updatedDebt) => {
  try {
    const response = await axios.post(`/debts`, updatedDebt);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putDebtAPI = async (updatedDebt) => {
  try {
    const response = await axios.put(
      `/debts/${get(updatedDebt, 'id')}`,
      updatedDebt
    );
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const debtPaymentAPI = async (debtId, payload) => {
  try {
    const response = await axios.put(`/debts/${debtId}/payment`, payload);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
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
      const payload = get(response, 'data.result');
      return map(payload, (record) => {
        return {
          ...record,
          assets: record['assets'],
          debts: record['debts'],
        };
      });
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

//  ██████╗  ██████╗  █████╗ ██╗     ███████╗
// ██╔════╝ ██╔═══██╗██╔══██╗██║     ██╔════╝
// ██║  ███╗██║   ██║███████║██║     ███████╗
// ██║   ██║██║   ██║██╔══██║██║     ╚════██║
// ╚██████╔╝╚██████╔╝██║  ██║███████╗███████║
//  ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝

export const getGoalsAPI = async () => {
  try {
    const response = await axios.get(`/goals`);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const postGoalAPI = async (goal) => {
  try {
    const response = await axios.post(`/goals`, goal);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};

export const putGoalAPI = async (goal) => {
  try {
    const response = await axios.put(`/goals/${get(goal, 'id')}`, goal);
    if (get(response, 'status') === 200) {
      return get(response, 'data.result');
    }
  } catch (error) {
    console.log('error: ', error);
  }
};
